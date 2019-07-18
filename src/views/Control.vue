<template>
  <v-layout wrap v-if="$apollo.queries.latestLoadTest.loading">
    <v-flex xs12 text-xs-center>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-flex>
  </v-layout>
  <Control v-else :loadTest="latestLoadTest"></Control>
</template>

<script>
import LATEST_LOAD_TEST from "../graphql/LatestLoadTest.gql";
import LATEST_LOAD_TEST_CHANGED from "../graphql/LatestLoadTestChanged.gql";

import Control from "@/components/Control";

export default {
  components: { Control },
  data() {
    return {
      latestLoadTest: {}
    };
  },
  apollo: {
    latestLoadTest: {
      query: LATEST_LOAD_TEST,
      subscribeToMore: {
        document: LATEST_LOAD_TEST_CHANGED,
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            latestLoadTest: subscriptionData.data.latestLoadTestChanged
          };
        }
      }
    }
  }
};
</script>
