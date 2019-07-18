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
      <v-flex xs12 v-for="loadTest in loadTestHistory" :key="loadTest._id" my-3>
        <v-sheet elevation="4">
          <v-layout wrap pa-3>
            <v-flex xs1 class="primary--text" mb-3>Start</v-flex>
            <v-flex xs5 mb-3>
              {{ loadTest.start.timestamp | displayDate }}
            </v-flex>
            <v-flex xs1 class="primary--text">Duration</v-flex>
            <v-flex xs5>
              {{ getDuration(loadTest) }}
            </v-flex>
            <v-flex xs1 class="primary--text">Type</v-flex>
            <v-flex xs5>{{ loadTest.type }}</v-flex>
            <v-flex xs1 class="primary--text">Config</v-flex>

            <v-flex xs5>
              <pre>{{ getConfig(loadTest) }}</pre>
            </v-flex>
          </v-layout>
        </v-sheet>
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
import LOAD_TEST_HISTORY from "../graphql/LoadTestHistory.gql";
import moment from "moment";

const PAGE_SIZE = 10;

export default {
  name: "app",
  data: () => ({
    loadTestHistory: [],
    showMoreEnabled: true
  }),
  apollo: {
    loadTestHistory: {
      query: LOAD_TEST_HISTORY,
      variables: {
        lastId: "",
        pageSize: PAGE_SIZE
      }
    }
  },
  computed: {
    lastId() {
      return this.loadTestHistory.length === 0
        ? ""
        : this.loadTestHistory[this.loadTestHistory.length - 1]._id;
    }
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
          lastId: this.lastId,
          pageSize: PAGE_SIZE
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newLoadTests = fetchMoreResult.loadTestHistory;
          const hasMore = fetchMoreResult.loadTestHistory.length === PAGE_SIZE;

          this.showMoreEnabled = hasMore;

          return {
            loadTestHistory: [
              ...previousResult.loadTestHistory,
              ...newLoadTests
            ]
          };
        }
      });
    }
  },
  filters: {
    displayDate(timestamp) {
      return moment(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss ([GMT]Z)");
    }
  }
};
</script>