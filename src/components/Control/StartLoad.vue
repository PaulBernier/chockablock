<template>
  <v-form @submit.prevent="startLoad">
    <v-layout wrap text-xs-center xs12>
      <v-flex xs12 lg6 px-3>
        <v-layout wrap>
          <v-flex xs12>
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
          <v-flex xs12>
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
        </v-layout>
      </v-flex>
      <v-flex xs12 lg6 px-3>
        <v-layout wrap>
          <v-flex xs12>
            <v-select
              :items="loadTypes"
              v-model="type"
              box
              label="Load type"
            ></v-select>
          </v-flex>
          <v-flex xs12 v-show="type === 'constant'">
            <v-text-field
              prepend-inner-icon="speed"
              v-model.number="constantEps"
              label="EPS"
              min="0"
              step="0.1"
              box
              type="number"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 v-show="type === 'burst'">
            <v-text-field
              prepend-inner-icon="speed"
              v-model.number="burstNbEntries"
              label="Number of entries"
              min="1"
              step="1"
              box
              type="number"
            ></v-text-field>
          </v-flex>
        </v-layout>
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
        <div v-show="!canBeStarted" class="font-italic font-weight-bold">
          Select at least one agent
        </div>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
import START_TEST from "@/graphql/StartTest.gql";

export default {
  props: ["selectedAgents"],
  data() {
    return {
      loadTypes: [
        { text: "Constant", value: "constant" },
        { text: "Burst", value: "burst" },
      ],
      type: "constant",
      nbOfChains: 50,
      minEntrySize: 128,
      maxEntrySize: 1024,
      constantEps: 1,
      burstNbEntries: 100,
      loading: false,
    };
  },
  computed: {
    canBeStarted() {
      return this.selectedAgents.length > 0;
    },
  },
  methods: {
    async startLoad() {
      try {
        // Clear previous error message if any
        this.$emit("error", "");
        this.loading = true;
        const { data } = await this.$apollo.mutate({
          mutation: START_TEST,
          variables: {
            loadConfig: {
              entrySizeRange: {
                min: this.minEntrySize,
                max: this.maxEntrySize,
              },
              nbOfChains: this.nbOfChains,
              type: this.type,
              selectedAgents: this.selectedAgents,
              typedConfig: {
                constant: { eps: this.constantEps },
                burst: { nbEntries: this.burstNbEntries },
              },
            },
          },
        });
        this.$emit(
          "snack",
          `Load test successfully started (ID: ${data.startTest._id})`
        );
      } catch (e) {
        this.$emit("error", e.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
