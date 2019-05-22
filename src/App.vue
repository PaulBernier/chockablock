<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Factom</span>
        <span class="font-weight-light">Loadtest</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat>
        <span class="mr-2">Control login</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>
