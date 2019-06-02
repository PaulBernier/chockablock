<template>
  <v-container fluid>
    <v-layout flex-child wrap>
      <v-flex xs12 lg4 d-flex>
        <NoPastLoadTest v-if="!loadTest"></NoPastLoadTest>
        <ActiveLoadTest
          v-else-if="active"
          :loadTest="loadTest"
        ></ActiveLoadTest>
        <InactiveLoadTest v-else :loadTest="loadTest"></InactiveLoadTest>
      </v-flex>

      <v-flex xs12 lg8 pa-2 d-flex>
        <v-sheet class="d-flex" elevation="2" height="416">
          <v-container>
            <v-layout wrap> </v-layout>
          </v-container>
        </v-sheet>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import NoPastLoadTest from "./LoadTestState/NoPastLoadTest";
import ActiveLoadTest from "./LoadTestState/ActiveLoadTest";
import InactiveLoadTest from "./LoadTestState/InactiveLoadTest";

export default {
  components: { NoPastLoadTest, ActiveLoadTest, InactiveLoadTest },
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
