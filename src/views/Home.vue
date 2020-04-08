<template>
  <v-container v-if="$apollo.queries.latestLoadTest.loading">
    <v-layout wrap>
      <v-flex xs12>Loading...</v-flex>
    </v-layout>
  </v-container>
  <LoadTestState v-else :loadTest="latestLoadTest"></LoadTestState>
</template>

<script>
import LoadTestState from "@/components/LoadTestState";

import LATEST_LOAD_TEST from "../graphql/LatestLoadTest.gql";
import LATEST_LOAD_TEST_CHANGED from "../graphql/LatestLoadTestChanged.gql";

export default {
  components: { LoadTestState },
  data() {
    return {
      latestLoadTest: {},
    };
  },
  apollo: {
    latestLoadTest: {
      query: LATEST_LOAD_TEST,
      subscribeToMore: {
        document: LATEST_LOAD_TEST_CHANGED,
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            latestLoadTest: subscriptionData.data.latestLoadTestChanged,
          };
        },
      },
    },
  },
};
</script>
