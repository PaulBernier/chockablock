<template>
  <v-layout wrap>
    <v-container>
      <v-flex xs12 mb-2>
        <v-alert v-if="errorMesage" :value="true" type="error">
          {{ errorMesage }}
        </v-alert>
      </v-flex>
      <v-layout wrap>
        <StopLoad v-if="active" @error="errorMesage = $event"></StopLoad>
        <StartLoad v-else @error="errorMesage = $event"></StartLoad>
      </v-layout>
    </v-container>
    <v-flex xs12 mb-5>
      <LoadTestState :loadTest="loadTest"></LoadTestState>
    </v-flex>
  </v-layout>
</template>

<script>
import LoadTestState from "@/components/LoadTestState";
import StartLoad from "./Control/StartLoad";
import StopLoad from "./Control/StopLoad";

export default {
  components: { StartLoad, StopLoad, LoadTestState },
  props: ["loadTest"],
  data() {
    return {
      errorMesage: ""
    };
  },
  computed: {
    active() {
      return (
        this.loadTest && !this.loadTest.events.find(e => e.type === "stop")
      );
    }
  }
};
</script>
