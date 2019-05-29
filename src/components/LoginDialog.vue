<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn flat v-on="on" class="mr-2">
          <span>Control Panel</span>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Control Panel Log In
        </v-card-title>

        <v-card-text>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                v-model="username"
                label="Username"
                required
                box
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
                box
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-alert v-if="errorMesage" :value="true" type="error">
                {{ errorMesage }}
              </v-alert>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="login" :loading="loading">
            Log In
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import LOG_IN from "@/graphql/LogIn.gql";

export default {
  name: "LoginDialog",
  data() {
    return {
      loading: false,
      dialog: false,
      username: "",
      password: "",
      errorMesage: ""
    };
  },
  methods: {
    async login() {
      try {
        this.loading = true;
        const { data } = await this.$apollo.mutate({
          mutation: LOG_IN,
          variables: {
            name: this.username,
            password: this.password
          }
        });
        localStorage.setItem("jwt_token", data.login);
        this.dialog = false;
        this.$router.push({ name: "control" });
      } catch (e) {
        this.errorMesage = e.message;
      } finally {
        this.loading = false;
      }
    }
  },
  watch: {
    dialog() {
      this.errorMesage = "";
      if (this.dialog) {
        if (localStorage.getItem("jwt_token")) {
          this.$router.push({ name: "control" });
        }
      }
    }
  }
};
</script>
