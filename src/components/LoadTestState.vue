<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex xs12 lg4>
        <ActiveLoadTest v-if="active" :loadTest="loadTest"></ActiveLoadTest>
        <InactiveLoadTest v-else :loadTest="loadTest"></InactiveLoadTest>
      </v-flex>

      <v-flex xs12 lg8>
        <LatestBlockStats></LatestBlockStats>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ActiveLoadTest from "./LoadTestState/ActiveLoadTest";
import InactiveLoadTest from "./LoadTestState/InactiveLoadTest";
import LatestBlockStats from "./LoadTestState/LatestBlockStats";

export default {
  components: {
    ActiveLoadTest,
    InactiveLoadTest,
    LatestBlockStats,
  },
  props: ["loadTest"],
  computed: {
    active() {
      return this.loadTest && !this.loadTest.end;
    },
  },
};
</script>
