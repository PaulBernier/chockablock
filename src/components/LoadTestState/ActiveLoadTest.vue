<template>
  <v-layout wrap>
    <v-flex xs12 lg6 pa-2>
      <v-sheet class="d-flex" color="primary" elevation="2" height="200">
        <v-container>
          <v-layout wrap text-xs-center>
            <v-flex xs12 class="display-3 font-weight-bold" mb-4>ON</v-flex>
            <v-flex xs12 class="subheading grey--text text--darken-3">
              Started on {{ started.timestamp | displayDate }}
            </v-flex>
            <v-flex xs12 class="subheading grey--text text--darken-3"
              >by {{ started.user }}</v-flex
            >
          </v-layout>
        </v-container>
      </v-sheet>
    </v-flex>
    <v-flex xs12 lg6 pa-2>
      <v-sheet class="d-flex" elevation="2" height="200">
        <v-container>
          <v-layout wrap text-xs-center>
            <v-flex xs12 class="display-3 primary--text" mb-4>
              {{ config.eps }} EPS
            </v-flex>
            <v-flex xs12 class="subheading">Current target</v-flex>
          </v-layout>
        </v-container>
      </v-sheet>
    </v-flex>
    <v-flex xs12 pa-2>
      <v-sheet class="d-flex" elevation="2">
        <v-container>
          <v-layout wrap>
            <v-flex xs12 class="headline primary--text" text-xs-center mb-2>
              {{ ecBalance.toLocaleString() }} EC
            </v-flex>
            <v-flex xs12 class="subheading" text-xs-center>
              {{ generatorData.ecAddress }}
            </v-flex>
          </v-layout>
        </v-container>
      </v-sheet>
    </v-flex>
    <v-flex xs12 pa-2>
      <v-sheet class="d-flex" elevation="2">
        <v-container>
          <v-layout wrap>
            <v-flex xs12 class="headline primary--text" text-xs-center mb-4
              >Config</v-flex
            >
            <v-flex xs12 class="subheading"
              ><pre>{{ config }}</pre></v-flex
            >
          </v-layout>
        </v-container>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";

import EC_BALANCE from "@/graphql/EcBalance.gql";
import EC_BALANCE_CHANGED from "@/graphql/EcBalanceChanged.gql";

export default {
  props: ["loadTest"],
  data() {
    return {
      ecBalance: 0
    };
  },
  apollo: {
    ecBalance: {
      query: EC_BALANCE,
      subscribeToMore: {
        document: EC_BALANCE_CHANGED,
        updateQuery: (previousResult, { subscriptionData }) => {
          return { ecBalance: subscriptionData.data.ecBalanceChanged };
        }
      }
    }
  },
  computed: {
    started() {
      const { user, timestamp } = this.loadTest.events.find(
        e => e.type === "start"
      );
      return { user, timestamp };
    },
    config() {
      const copy = { ...this.loadTest.generator.config };
      delete copy.__typename;
      return copy;
    },
    generatorData() {
      return this.loadTest.generator.data;
    }
  },
  filters: {
    displayDate(timestamp) {
      return moment(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss ([GMT]Z)");
    }
  }
};
</script>