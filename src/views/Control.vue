<template>
  <v-container>
    <v-layout wrap v-if="$apollo.queries.loadConfig.loading">
      <v-flex xs12>
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-flex>
    </v-layout>
    <Control v-else :loadConfig="loadConfig"></Control>
  </v-container>
</template>

<script>
import LOAD_CONFIG from "../graphql/LoadConfig.gql";
import LOAD_CONFIG_CHANGED from "../graphql/LoadConfigChanged.gql";

import Control from "@/components/Control";

export default {
  components: { Control },
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
