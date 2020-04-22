<template>
  <v-layout wrap>
    <v-container fluid>
      <v-layout wrap>
        <v-flex xs12 lg4>
          <v-layout wrap>
            <v-flex xs12 pa-2>
              <ConnectedAgents
                :agentsCount.sync="agentsCount"
              ></ConnectedAgents>
            </v-flex>
            <v-flex xs12 pa-2>
              <AuthoritySetInfo></AuthoritySetInfo>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 lg8 px-2>
          <v-layout wrap>
            <v-flex xs12 pa-2 v-show="errorMesage">
              <v-alert :value="true" type="error">
                {{ errorMesage }}
              </v-alert>
            </v-flex>
            <v-flex xs12 pa-2>
              <v-sheet elevation="2">
                <v-container fluid>
                  <StopLoad
                    v-show="active"
                    @error="errorMesage = $event"
                  ></StopLoad>
                  <StartLoad
                    v-show="!active"
                    @error="errorMesage = $event"
                    @snack="displaySnack"
                    :agentsCount="agentsCount"
                  ></StartLoad>
                </v-container>
              </v-sheet>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <v-flex xs12>
      <v-divider></v-divider>
    </v-flex>
    <v-flex xs12 mb-5>
      <LoadTestState :loadTest="loadTest"></LoadTestState>
    </v-flex>
    <v-snackbar v-model="snackbar" color="success" :timeout="5000">
      {{ snackMessage }}
    </v-snackbar>
  </v-layout>
</template>

<script>
import AGENTS from "@/graphql/Agents.gql";
import AGENTS_CHANGED from "@/graphql/AgentsChanged.gql";

import LoadTestState from "@/components/LoadTestState";
import ConnectedAgents from "./Control/ConnectedAgents";
import AuthoritySetInfo from "./Control/AuthoritySetInfo";
import StartLoad from "./Control/StartLoad";
import StopLoad from "./Control/StopLoad";

export default {
  components: {
    AuthoritySetInfo,
    ConnectedAgents,
    StartLoad,
    StopLoad,
    LoadTestState,
  },
  props: ["loadTest"],
  data() {
    return {
      snackbar: false,
      snackMessage: "",
      agentsCount: 0,
      errorMesage: "",
    };
  },
  computed: {
    active() {
      return this.loadTest && !this.loadTest.end;
    },
  },
  methods: {
    displaySnack(message) {
      this.snackMessage = message;
      this.snackbar = true;
    },
  },
};
</script>
