<template>
  <v-flex>
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
</template>

<script>
export default {
  props: ["loadConfig"]
};
</script>
