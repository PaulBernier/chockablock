<template>
  <v-layout wrap>
    <v-flex xs12 mb-5>
      <LoadTestState :loadConfig="loadConfig"></LoadTestState>
    </v-flex>
    <v-flex xs12 mb-2>
      <v-alert v-if="errorMesage" :value="true" type="error">
        {{ errorMesage }}
      </v-alert>
    </v-flex>
    <StopLoad
      v-if="loadConfig.running"
      @error="errorMesage = $event"
    ></StopLoad>
    <StartLoad v-else @error="errorMesage = $event"></StartLoad>
  </v-layout>
</template>

<script>
import LoadTestState from "@/components/LoadTestState";
import StartLoad from "./Control/StartLoad";
import StopLoad from "./Control/StopLoad";

export default {
  components: { StartLoad, StopLoad, LoadTestState },
  props: ["loadConfig"],
  data() {
    return {
      errorMesage: ""
    };
  }
};
</script>
