<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title
        class="headline text-uppercase clickable"
        @click="$router.replace('/')"
      >
        <span class="font-weight-medium">Factom</span>
        <span class="font-weight-light">Loadtesting</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
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
  name: "App"
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
