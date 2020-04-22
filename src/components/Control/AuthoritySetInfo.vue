<template>
  <v-sheet elevation="2">
    <v-container>
      <v-layout wrap v-if="$apollo.queries.authoritySetInfo.loading">
        <v-flex xs12 text-xs-center>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-flex>
      </v-layout>
      <v-layout wrap v-else>
        <v-flex xs12 mb-3 class="font-weight-bold primary--text">
          Current authority set composition:
        </v-flex>
        <v-flex xs12 mb-3>
          <AuthoritySet :authoritySet="authoritySetInfo"></AuthoritySet>
        </v-flex>
        <v-flex xs12 v-if="authoritySetInfo.identitiesNotFound.length > 0">
          <div>Identities not found:</div>
          <ul>
            <li v-for="id in authoritySetInfo.identitiesNotFound" :key="id">
              {{ id }}
            </li>
          </ul>
        </v-flex>
      </v-layout>
    </v-container>
  </v-sheet>
</template>

<script>
import AuthoritySet from "@/components/AuthoritySet";

import AUTH_SET_INFO from "@/graphql/AuthoritySetInfo.gql";

export default {
  components: { AuthoritySet },
  data() {
    return {
      authoritySetInfo: {},
    };
  },
  apollo: {
    authoritySetInfo: {
      query: AUTH_SET_INFO,
    },
  },
};
</script>
