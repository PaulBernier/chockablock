<template>
  <v-container>
    <v-layout wrap v-if="$apollo.queries.loadConfig.loading">
      <v-flex xs12>Loading...</v-flex>
    </v-layout>
    <v-layout wrap v-else>
      <LoadTestState :loadConfig="loadConfig"></LoadTestState>
    </v-layout>
  </v-container>
</template>

<script>
import LoadTestState from "@/components/LoadTestState";

import LOAD_CONFIG from "../graphql/LoadConfig.gql";
import LOAD_CONFIG_CHANGED from "../graphql/LoadConfigChanged.gql";

export default {
  components: { LoadTestState },
  data() {
    return {
      loadConfig: { running: false, targetWps: 0, chainIds: [] }
    };
  },
  apollo: {
    loadConfig: {
      query: LOAD_CONFIG,
      subscribeToMore: {
        document: LOAD_CONFIG_CHANGED,
        updateQuery: (previousResult, { subscriptionData }) => {
          return { loadConfig: subscriptionData.data.loadConfigChanged };
        }
      }
    }
  }
};
</script>
