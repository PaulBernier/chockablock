<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title
        class="headline primary--text"
        @click="$router.replace('/')"
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
      <LoginDialog v-if="$route.path === '/'"></LoginDialog>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import LoginDialog from "@/components/LoginDialog";

export default {
  components: { LoginDialog },
  name: "App",
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
