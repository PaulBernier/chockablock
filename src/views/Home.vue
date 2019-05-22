<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex xs12>Running: {{ running }}</v-flex>
      <v-flex xs12>Target WPS: {{ targetWps }}</v-flex>
      <v-flex xs12>Chain IDs: {{ chainIds }}</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";

const cli = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

export default {
  data() {
    return {
      targetWps: 0,
      running: false,
      chainIds: []
    };
  },
  async created() {
    const {
      data: { data }
    } = await cli.post("/graphql", {
      query: "{loadConfig{targetWps, running, chainIds}}"
    });
    this.targetWps = data.loadConfig.targetWps;
    this.running = data.loadConfig.running;
    this.chainIds = data.loadConfig.chainIds;
  }
};
</script>
