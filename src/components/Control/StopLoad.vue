<template>
  <v-layout wrap text-xs-center>
    <v-flex xs12>
      <v-btn
        @click="stopLoad"
        large
        class="grey--text text--darken-3"
        color="primary"
        >stop loadtest</v-btn
      >
    </v-flex>
  </v-layout>
</template>

<script>
import STOP_TEST from "@/graphql/StopTest.gql";

export default {
  methods: {
    async stopLoad() {
      try {
        await this.$apollo.mutate({
          mutation: STOP_TEST,
        });
      } catch (e) {
        this.$emit("error", e.message);
      }
    },
  },
};
</script>
