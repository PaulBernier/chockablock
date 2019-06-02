<template>
  <v-layout wrap v-if="$apollo.queries.loadTest.loading">
    <v-flex xs12 text-xs-center>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-flex>
  </v-layout>
  <Control v-else :loadTest="loadTest"></Control>
</template>

<script>
import LOAD_TEST from "../graphql/LoadTest.gql";
import LOAD_TEST_CHANGED from "../graphql/LoadTestChanged.gql";

import Control from "@/components/Control";

export default {
  components: { Control },
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
