<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title
        class="headline primary--text"
        @click="$router.replace('/', () => {})"
      >
        <router-link to="/">
          <span class="font-weight-medium">Chocka</span>
          <span class="font-weight-light">Block</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat to="/loadtest-history" class="mr-2">
        <span>Load Test History</span>
      </v-btn>
      <v-btn @click="authenticate" flat class="mr-2">
        <span>Control Panel</span>
      </v-btn>
      <LoginDialog ref="loginDialog"></LoginDialog>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import LoginDialog from "@/components/LoginDialog";
import VERIFY_AUTH from "@/graphql/VerifyAuth.gql";

export default {
  components: { LoginDialog },
  name: "App",
  methods: {
    async authenticate() {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        const { data } = await this.$apollo.query({
          query: VERIFY_AUTH,
          variables: {
            token,
          },
        });
        if (data.verifyAuth) {
          this.$router.push({ name: "control" });
          return;
        }
      }
      this.$refs.loginDialog.display();
    },
  },
};
</script>

<style>
a {
  text-decoration: none;
}
.break-word {
  word-break: break-all;
}
</style>
