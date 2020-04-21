<template>
  <v-form @submit.prevent="startLoad">
    <v-layout wrap text-xs-center xs12>
      <v-flex xs12>
        <v-layout wrap>
          <v-flex xs12 lg4 px-3>
            <v-text-field
              v-model.number="minEntrySize"
              label="MIN entry size"
              box
              type="number"
              min="32"
              :max="maxEntrySize"
              step="1"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 lg4 px-3>
            <v-text-field
              v-model.number="maxEntrySize"
              label="MAX entry size"
              box
              type="number"
              :min="minEntrySize"
              max="10240"
              step="1"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 lg4 px-3>
            <v-text-field
              v-model.number="nbOfChains"
              label="Number of chains"
              box
              type="number"
              min="1"
              step="1"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 lg4 offset-lg4 px-3>
        <v-text-field
          prepend-inner-icon="speed"
          v-model.number="eps"
          label="EPS"
          min="0"
          step="0.1"
          box
          type="number"
        ></v-text-field>
      </v-flex>

      <v-flex xs12>
        <v-btn
          type="submit"
          :loading="loading"
          large
          :disabled="!canBeStarted"
          class="grey--text text--darken-3"
          color="primary"
          >start loadtest</v-btn
        >
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
import START_TEST from "@/graphql/StartTest.gql";

export default {
  props: ["agentsCount"],
  data() {
    return {
      nbOfChains: 50,
      minEntrySize: 128,
      maxEntrySize: 1024,
      eps: 1,
      loading: false,
    };
  },
  computed: {
    canBeStarted() {
      return this.agentsCount > 0;
    },
  },
  methods: {
    async startLoad() {
      try {
        // Clear previous error message if any
        this.$emit("error", "");
        this.loading = true;
        await this.$apollo.mutate({
          mutation: START_TEST,
          variables: {
            loadConfig: {
              type: "constant",
              entrySizeRange: {
                min: this.minEntrySize,
                max: this.maxEntrySize,
              },
              nbOfChains: this.nbOfChains,
              typeConfig: {
                eps: this.eps,
              },
            },
          },
        });
      } catch (e) {
        this.$emit("error", e.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
