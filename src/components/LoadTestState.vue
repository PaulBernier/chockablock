<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex xs12 lg4>
        <NoPastLoadTest v-if="!loadTest"></NoPastLoadTest>
        <ActiveLoadTest
          v-else-if="active"
          :loadTest="loadTest"
        ></ActiveLoadTest>
        <InactiveLoadTest v-else :loadTest="loadTest"></InactiveLoadTest>
      </v-flex>

      <v-flex xs12 lg8>
        <BlockStats></BlockStats>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import NoPastLoadTest from "./LoadTestState/NoPastLoadTest";
import ActiveLoadTest from "./LoadTestState/ActiveLoadTest";
import InactiveLoadTest from "./LoadTestState/InactiveLoadTest";
import BlockStats from "./LoadTestState/BlockStats";

export default {
  components: { NoPastLoadTest, ActiveLoadTest, InactiveLoadTest, BlockStats },
  props: ["loadTest"],
  computed: {
    active() {
      return (
        this.loadTest && !this.loadTest.events.find(e => e.type === "stop")
      );
    }
  }
};
</script>
