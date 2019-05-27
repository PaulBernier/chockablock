<template>
  <v-layout wrap>
    <v-flex xs12 mb-5>
      <v-sheet
        wrap
        v-if="loadConfig.running"
        text-xs-center
        color="green"
        elevation="2"
      >
        <v-container>
          <v-layout wrap text-xs-center>
            <v-flex xs12 class="headline" mb-3> Load Testing Running</v-flex>
            <v-flex xs12 class="subheading">
              Target: {{ loadConfig.targetWps }} WPS
            </v-flex>

            <v-flex xs12 class="subheading">
              Spread on {{ loadConfig.chainIds.length }} chains
            </v-flex>
          </v-layout>
        </v-container>
      </v-sheet>
      <v-sheet wrap v-else text-xs-center color="grey lighten-3" elevation="2">
        <v-container>
          <v-layout wrap text-xs-center>
            <v-flex xs12 class="headline">
              Load Testing Off
            </v-flex>
          </v-layout>
        </v-container>
      </v-sheet>
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
import StartLoad from "./Control/StartLoad";
import StopLoad from "./Control/StopLoad";

export default {
  components: { StartLoad, StopLoad },
  props: ["loadConfig"],
  data() {
    return {
      errorMesage: ""
    };
  }
};
</script>
