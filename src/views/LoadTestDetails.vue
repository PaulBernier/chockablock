<template>
  <v-container fluid>
    <v-layout wrap v-if="$apollo.queries.loadTest.loading">
      <v-flex xs12 text-xs-center>
        <v-progress-circular indeterminate color="primary">
        </v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout wrap v-else-if="!loadTest" text-xs-center class="subheading">
      <v-flex xs12
        >No load test with ID
        <span class="primary--text">"{{ loadtestId }}"</span> found.</v-flex
      >
    </v-layout>
    <LoadTestDetails
      v-else-if="loadTest.end"
      :loadTest="loadTest"
    ></LoadTestDetails>
  </v-container>
</template>

<script>
import LoadTestDetails from "@/components/LoadTestDetails";

import LOAD_TEST from "@/graphql/LoadTest.gql";

export default {
  components: { LoadTestDetails },
  data() {
    return {
      loadTest: {},
    };
  },
  apollo: {
    loadTest() {
      return {
        query: LOAD_TEST,
        variables: {
          id: this.loadtestId,
        },
      };
    },
  },
  computed: {
    loadtestId() {
      return this.$route.params.id.trim();
    },
  },
  watch: {
    loadTest() {
      if (this.loadTest && !this.loadTest.end) {
        this.$router.replace("/");
      }
    },
  },
};
</script>
