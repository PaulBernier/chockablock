<template>
  <v-container v-if="$apollo.queries.loadTest.loading">
    <v-layout wrap>
      <v-flex xs12>Loading...</v-flex>
    </v-layout>
  </v-container>
  <LoadTestState v-else :loadTest="loadTest"></LoadTestState>
</template>

<script>
import LoadTestState from "@/components/LoadTestState";

import LOAD_TEST from "../graphql/LoadTest.gql";
import LOAD_TEST_CHANGED from "../graphql/LoadTestChanged.gql";

export default {
  components: { LoadTestState },
  data() {
    return {
      loadTest: { id: "", events: [], generator: {} }
    };
  },
  apollo: {
    loadTest: {
      query: LOAD_TEST,
      subscribeToMore: {
        document: LOAD_TEST_CHANGED,
        updateQuery: (previousResult, { subscriptionData }) => {
          return { loadTest: subscriptionData.data.loadTestChanged };
        }
      }
    }
  }
};
</script>
