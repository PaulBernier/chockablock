<template>
  <v-layout wrap>
    <v-flex xs12 lg6 pa-2>
      <v-sheet class="d-flex" elevation="2" height="200">
        <v-container>
          <v-layout wrap text-xs-center class="grey--text">
            <v-flex xs12 class="display-3 font-weight-bold">OFF</v-flex>
          </v-layout>
        </v-container>
      </v-sheet>
    </v-flex>
    <v-flex xs12 lg6 pa-2> </v-flex>
    <v-flex xs12 pa-2>
      <v-sheet class="d-flex" elevation="2">
        <v-container>
          <v-layout wrap>
            <v-flex xs12 class="title primary--text text-xs-center" mb-5>
              Latest load testing
            </v-flex>
            <v-flex xs12 class="subheading" mb-2>
              Started by
              <span class="font-weight-bold">{{ loadTest.start.user }}</span> on
              <span class="font-weight-bold">{{
                loadTest.start.timestamp | displayDate
              }}</span>
            </v-flex>
            <v-flex xs12 class="subheading" mb-2>
              Stopped by
              <span class="font-weight-bold">{{ loadTest.end.user }}</span> on
              <span class="font-weight-bold">{{
                loadTest.end.timestamp | displayDate
              }}</span>
            </v-flex>
            <v-flex xs12 class="subheading" mb-2>
              Total duration:
              <span class="font-weight-bold">{{ duration }}</span>
            </v-flex>
            <v-flex xs12 class="subheading" mb-3>
              With config:
            </v-flex>
            <v-flex xs12 class="subheading">
              <pre>{{ config }}</pre>
            </v-flex>
          </v-layout>
        </v-container>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";

export default {
  props: ["loadTest"],
  computed: {
    duration() {
      const start = moment(this.loadTest.start.timestamp * 1000);
      const end = moment(this.loadTest.end.timestamp * 1000);
      return moment.duration(end.diff(start)).humanize();
    },
    config() {
      const copy = { ...this.loadTest.generatorConfig };
      delete copy.__typename;
      return copy;
    }
  },
  filters: {
    displayDate(timestamp) {
      return moment(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss ([GMT]Z)");
    }
  }
};
</script>
