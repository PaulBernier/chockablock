<template>
  <v-container fluid>
    <v-layout wrap v-if="$apollo.queries.loadTest.loading">
      <v-flex xs12 text-xs-center>
        <v-progress-circular indeterminate color="primary">
        </v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout wrap v-else>
      <v-flex xs12 lg4 pa-2
        ><LoadTestInfo :loadTest="loadTest"></LoadTestInfo>
      </v-flex>
      <v-flex xs12 lg8
        ><TimeRangeBlockStats
          :startTimestamp="blockTimeRange.start"
          :endTimestamp="blockTimeRange.end"
        ></TimeRangeBlockStats
      ></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LoadTestInfo from "@/components/LoadTestDetails/LoadTestInfo";
import TimeRangeBlockStats from "@/components/LoadTestDetails/TimeRangeBlockStats";

import LOAD_TEST from "@/graphql/LoadTest.gql";

export default {
  components: { LoadTestInfo, TimeRangeBlockStats },
  data() {
    return {
      loadTest: {}
    };
  },
  apollo: {
    loadTest() {
      return {
        query: LOAD_TEST,
        variables: {
          id: this.loadtestId
        }
      };
    }
  },
  computed: {
    loadtestId() {
      return this.$route.params.id;
    },
    blockTimeRange() {
      if (this.loadTest) {
        return {
          start: this.loadTest.start.timestamp - 1800,
          end: this.loadTest.end.timestamp + 1200
        };
      } else {
        return {
          start: 0,
          end: 0
        };
      }
    }
  }
};
</script>
