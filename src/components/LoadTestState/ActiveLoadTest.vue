<template>
  <v-layout wrap>
    <v-flex xs12 lg6 pa-2>
      <v-sheet class="d-flex" color="primary" elevation="2" height="200">
        <v-container>
          <v-layout wrap text-xs-center>
            <v-flex xs12 class="display-3 font-weight-bold" mb-4>ON</v-flex>
            <v-flex xs12 class="subheading grey--text text--darken-3">
              Started on {{ loadTest.start.timestamp | formatDate }}
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
            <v-flex xs12 class="subheading break-word" text-xs-center>
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
              Info
            </v-flex>
            <v-flex xs12 class="subheading" mb-2>
              <span class="font-weight-bold">Test ID:</span>
              {{ loadTest._id }}
            </v-flex>
            <v-flex xs12 class="subheading" mb-2>
              <span class="font-weight-bold">Settings:</span>
              <TypedLoadConfigList :loadTest="loadTest"></TypedLoadConfigList>
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
              <AuthoritySet
                :authoritySet="laodTest.authoritySet"
              ></AuthoritySet>
            </v-flex>
          </v-layout>
        </v-container>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import TypedLoadConfigList from "@/components/TypedLoadConfigList";
import AuthoritySet from "@/components/AuthoritySet";

import EC_BALANCE from "@/graphql/EcBalance.gql";
import EC_BALANCE_CHANGED from "@/graphql/EcBalanceChanged.gql";

export default {
  props: ["loadTest"],
  components: { AuthoritySet, TypedLoadConfigList },
  data() {
    return {
      ecBalance: { address: "", balance: 0 },
    };
  },
  apollo: {
    ecBalance: {
      query: EC_BALANCE,
      subscribeToMore: {
        document: EC_BALANCE_CHANGED,
        updateQuery: (previousResult, { subscriptionData }) => {
          return { ecBalance: subscriptionData.data.ecBalanceChanged };
        },
      },
    },
  },
};
</script>
