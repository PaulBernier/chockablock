<template>
  <v-container fluid>
    <v-layout wrap v-if="$apollo.queries.loadConfig.loading">
      <v-flex xs12>Loading...</v-flex>
    </v-layout>
    <v-layout wrap v-else>
      <v-flex xs12>Running: {{ loadConfig.running }}</v-flex>
      <v-flex xs12>Target WPS: {{ loadConfig.targetWps }}</v-flex>
      <v-flex xs12>Chain IDs: {{ loadConfig.chainIds }}</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LOAD_CONFIG from "../graphql/LoadConfig.gql";
import LOAD_CONFIG_CHANGED from "../graphql/LoadConfigChanged.gql";

export default {
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
