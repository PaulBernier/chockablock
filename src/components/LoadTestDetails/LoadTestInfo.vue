<template>
  <v-sheet elevation="2">
    <v-container>
      <v-layout wrap>
        <v-flex xs12 text-xs-center class="title" mb-5>
          {{ loadTest._id }}
        </v-flex>
        <v-flex xs12 class="subheading" mb-2>
          Started by
          <span class="font-weight-bold">{{ loadTest.start.user }}</span>
          on
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
        <v-flex xs12 class="subheading" mb-2>
          Number of chains:
          <span class="font-weight-bold">{{
            this.loadTest.chainIds.length
          }}</span>
        </v-flex>
        <v-flex xs12 class="subheading" mb-2>
          Type:
          <span class="font-weight-bold">{{ this.loadTest.type }}</span>
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
