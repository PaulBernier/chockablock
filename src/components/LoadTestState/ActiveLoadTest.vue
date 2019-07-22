<template>
  <v-layout wrap>
    <v-flex xs12 lg6 pa-2>
      <v-sheet class="d-flex" color="primary" elevation="2" height="200">
        <v-container>
          <v-layout wrap text-xs-center>
            <v-flex xs12 class="display-3 font-weight-bold" mb-4>ON</v-flex>
            <v-flex xs12 class="subheading grey--text text--darken-3">
              Started on {{ loadTest.start.timestamp | displayDate }}
            </v-flex>
            <v-flex xs12 class="subheading grey--text text--darken-3"
              >by {{ loadTest.start.user }}</v-flex
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
              <!-- TODO: make generic -->
              {{ loadTest.generatorConfig.eps }} EPS
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
              {{ ecBalance.balance.toLocaleString() }} EC
            </v-flex>
            <v-flex xs12 class="subheading" text-xs-center>
              {{ ecBalance.address }}
            </v-flex>
          </v-layout>
        </v-container>
      </v-sheet>
    </v-flex>
    <v-flex xs12 pa-2>
      <v-sheet class="d-flex" elevation="2">
        <v-container>
          <v-layout wrap>
            <v-flex xs12 class="headline primary--text" text-xs-center mb-4>
              Config
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
            <v-flex xs12 class="subheading">
              <pre>{{ config }}</pre>
            </v-flex>
          </v-layout>
        </v-container>
      </v-sheet>
    </v-flex>
    <v-flex xs12 pa-2>
      <v-sheet class="d-flex" elevation="2">
        <v-container>
          <v-layout wrap>
            <v-flex xs12 class="headline primary--text" text-xs-center mb-4>
              Authority Set
            </v-flex>
            <v-flex xs12 class="subheading">
              <div>
                <span class="font-weight-bold">
                  Leaders: {{ loadTest.authoritySet.leaders }}
                </span>
              </div>
              <ul>
                <li v-for="v in leaderVersions" :key="v.version">
                  {{ v.version }}: {{ v.count }}
                </li>
              </ul>
              <div>
                <span class="font-weight-bold">
                  Audits: {{ loadTest.authoritySet.audits }}
                </span>
              </div>
              <ul>
                <li v-for="v in auditVersions" :key="v.version">
                  {{ v.version }}: {{ v.count }}
                </li>
              </ul>
            </v-flex>
          </v-layout>
        </v-container>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import EC_BALANCE from "@/graphql/EcBalance.gql";
import EC_BALANCE_CHANGED from "@/graphql/EcBalanceChanged.gql";

export default {
  props: ["loadTest"],
  data() {
    return {
      ecBalance: { address: "", balance: 0 }
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
    config() {
      const copy = { ...this.loadTest.generatorConfig };
      delete copy.__typename;
      return copy;
    },
    auditVersions() {
      return this.loadTest.authoritySet.auditVersions
        .map(function(d) {
          const copy = { ...d };
          delete copy.__typename;
          return copy;
        })
        .sort((a, b) => b.count - a.count);
    },
    leaderVersions() {
      return this.loadTest.authoritySet.leaderVersions
        .map(function(d) {
          const copy = { ...d };
          delete copy.__typename;
          return copy;
        })
        .sort((a, b) => b.count - a.count);
    }
  }
};
</script>
