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
          <div class="font-weight-bold primary--text">
            Select agents ({{ agents.length }} available):
          </div>
        </v-flex>
        <v-flex xs12>
          <ul class="no-bullet">
            <li
              v-for="a in agentsUI"
              :key="a.name"
              :title="`Latest update: ${a.latestUpdateTime.toLocaleString()}`"
            >
              <v-checkbox
                v-model="selected"
                :value="a.name"
                :label="`${a.name} (height: ${a.blockHeightText})`"
                color="primary"
                :hide-details="true"
              ></v-checkbox>
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
      selected: [],
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
  computed: {
    agentsUI() {
      return this.agents.map((a) => ({
        name: a.name,
        blockHeightText: a.blockHeight ? a.blockHeight.toLocaleString() : "-",
        latestUpdateTime: new Date(a.latestUpdateTime * 1000),
      }));
    },
  },
  watch: {
    selected() {
      this.$emit("update:selectedAgents", this.selected);
    },
    agents() {
      const set = new Set(this.agents.map((a) => a.name));
      // deselect agents that disconnected
      this.selected = this.selected.filter((s) => set.has(s));
    },
  },
};
</script>

<style scoped>
.no-bullet {
  list-style: none;
}
</style>
