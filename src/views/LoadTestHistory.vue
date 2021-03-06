<template>
  <v-container>
    <v-layout
      wrap
      v-if="
        loadTestHistory.length === 0 && $apollo.queries.loadTestHistory.loading
      "
    >
      <v-flex xs12 text-xs-center>
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout wrap v-else>
      <v-flex xs12 class="headline" mb-4 text-xs-center>
        Load Test History
      </v-flex>
      <v-flex xs12 v-for="loadTest in loadTestHistory" :key="loadTest._id" my-3>
        <router-link :to="'loadtest/' + loadTest._id">
          <v-sheet elevation="4">
            <v-layout row wrap pa-3>
              <v-flex d-flex xs12 sm6>
                <v-layout row wrap>
                  <v-flex xs3 class="primary--text">Start</v-flex>
                  <v-flex xs9>
                    {{ loadTest.start.timestamp | formatDate }}
                  </v-flex>
                  <v-flex xs3 class="primary--text">Duration</v-flex>
                  <v-flex xs9>
                    {{ getDuration(loadTest) }}
                  </v-flex>
                  <v-flex xs3 class="primary--text">Version tested</v-flex>
                  <v-flex xs9 v-if="loadTest.authoritySet">{{
                    loadTest.authoritySet.mainVersion
                  }}</v-flex>
                  <v-flex xs9 v-else>-</v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex xs12 sm6>
                <v-layout row wrap>
                  <v-flex xs3 class="primary--text">Settings</v-flex>
                  <v-flex xs9>
                    <TypedLoadConfigList
                      :loadTest="loadTest"
                    ></TypedLoadConfigList>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-sheet>
        </router-link>
      </v-flex>
      <v-flex xs12 text-xs-center>
        <v-btn v-if="showMoreEnabled" @click="showMore">
          Load more
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";

import TypedLoadConfigList from "@/components/TypedLoadConfigList";
import LOAD_TEST_HISTORY from "../graphql/LoadTestHistory.gql";

const PAGE_SIZE = 10;

export default {
  components: { TypedLoadConfigList },
  data: () => ({
    loadTestHistory: [],
    showMoreEnabled: true,
  }),
  apollo: {
    loadTestHistory: {
      query: LOAD_TEST_HISTORY,
      variables: {
        timestamp: null,
        pageSize: PAGE_SIZE,
      },
    },
  },
  computed: {
    lastTimestamp() {
      return this.loadTestHistory.length === 0
        ? null
        : this.loadTestHistory[this.loadTestHistory.length - 1].start.timestamp;
    },
  },
  methods: {
    getDuration(loadTest) {
      if (!loadTest.end) {
        return "currently running";
      }
      const start = moment(loadTest.start.timestamp * 1000);
      const end = moment(loadTest.end.timestamp * 1000);
      return moment.duration(end.diff(start)).humanize();
    },
    getConfig(loadTest) {
      const copy = { ...loadTest.generatorConfig };
      delete copy.__typename;
      return copy;
    },
    showMore() {
      this.$apollo.queries.loadTestHistory.fetchMore({
        variables: {
          timestamp: this.lastTimestamp,
          pageSize: PAGE_SIZE,
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newLoadTests = fetchMoreResult.loadTestHistory;
          const hasMore = fetchMoreResult.loadTestHistory.length === PAGE_SIZE;

          this.showMoreEnabled = hasMore;

          return {
            loadTestHistory: [
              ...previousResult.loadTestHistory,
              ...newLoadTests,
            ],
          };
        },
      });
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
