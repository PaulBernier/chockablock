<template>
  <v-form @submit.prevent="startLoad">
    <v-layout wrap text-xs-center>
      <v-flex xs12>
        <v-text-field
          v-model.number="wps"
          label="WPS"
          min="0"
          step="0.1"
          box
          type="number"
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field
          v-model.number="nbOfChains"
          label="Number of chains"
          box
          type="number"
          min="1"
          step="1"
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-btn type="submit" :loading="loading" large>start loadtest</v-btn>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
import START_LOAD from "@/graphql/StartLoad.gql";

export default {
  data() {
    return {
      nbOfChains: 50,
      wps: 1,
      loading: false
    };
  },
  methods: {
    async startLoad() {
      try {
        this.loading = true;
        await this.$apollo.mutate({
          mutation: START_LOAD,
          variables: {
            wps: this.wps,
            nbOfChains: this.nbOfChains
          }
        });
      } catch (e) {
        this.$emit("error", e.message);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
