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
              <span class="font-weight-bold">{{ started.user }}</span> on
              <span class="font-weight-bold">{{
                started.timestamp | displayDate
              }}</span>
            </v-flex>
            <v-flex xs12 class="subheading" mb-2>
              Stopped by
              <span class="font-weight-bold">{{ stopped.user }}</span> on
              <span class="font-weight-bold">{{
                stopped.timestamp | displayDate
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
    started() {
      const { user, timestamp } = this.loadTest.events.find(
        e => e.type === "start"
      );
      return { user, timestamp };
    },
    stopped() {
      const { user, timestamp } = this.loadTest.events.find(
        e => e.type === "stop"
      );
      return { user, timestamp };
    },
    duration() {
      const start = moment(this.started.timestamp * 1000);
      const stop = moment(this.stopped.timestamp * 1000);
      return moment.duration(stop.diff(start)).humanize();
    },
    config() {
      const copy = { ...this.loadTest.generator.config };
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
