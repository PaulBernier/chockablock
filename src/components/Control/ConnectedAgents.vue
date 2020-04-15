<template>
  <v-sheet elevation="2">
    <v-container>
      <v-layout wrap v-if="agents.length === 0">
        <v-flex xs12>
          <div class="red--text font-weight-bold">
            No agent currently connected.
          </div>
        </v-flex>
      </v-layout>
      <v-layout wrap v-else>
        <v-flex xs12 mb-2>
          <div>Agents curently connected ({{ agents.length }}):</div>
        </v-flex>
        <v-flex xs12>
          <ul>
            <li v-for="a in agents" :key="a.name">
              {{ a.name }}
            </li>
          </ul>
        </v-flex>
      </v-layout>
    </v-container>
  </v-sheet>
</template>

<script>
import AGENTS from "@/graphql/Agents.gql";
import AGENTS_CHANGED from "@/graphql/AgentsChanged.gql";

export default {
  data() {
    return {
      agents: [],
    };
  },
  apollo: {
    agents: {
      query: AGENTS,
      subscribeToMore: {
        document: AGENTS_CHANGED,
        updateQuery: (previousResult, { subscriptionData }) => {
          return { agents: subscriptionData.data.agentsChanged };
        },
      },
    },
  },
};
</script>
