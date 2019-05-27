<template>
  <v-layout wrap text-xs-center>
    <v-flex xs12>
      <v-btn @click="stopLoad" large>stop loadtest</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import STOP_LOAD from "@/graphql/StopLoad.gql";

export default {
  methods: {
    async stopLoad() {
      try {
        await this.$apollo.mutate({
          mutation: STOP_LOAD
        });
      } catch (e) {
        this.$emit("error", e.message);
      }
    }
  }
};
</script>
