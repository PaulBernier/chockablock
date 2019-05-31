<template>
  <v-container fluid>
    <v-layout flex-child wrap>
      <v-flex xs12 lg4 d-flex>
        <v-layout wrap>
          <v-flex xs12 lg6 pa-2>
            <v-sheet class="d-flex" color="primary" elevation="2" height="200">
              <v-container>
                <v-layout wrap text-xs-center>
                  <v-flex xs12 class="display-3 font-weight-bold" mb-4
                    >ON</v-flex
                  >
                  <v-flex xs12 class="subheading grey--text text--darken-3">
                    Started on 2019-06-01 16:22
                  </v-flex>
                  <v-flex xs12 class="subheading grey--text text--darken-3"
                    >by luap</v-flex
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
                    5 EPS
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
                  <v-flex
                    xs12
                    class="headline primary--text"
                    text-xs-center
                    mb-2
                  >
                    10,483,123 EC
                  </v-flex>
                  <v-flex xs12 class="subheading" text-xs-center>
                    EC3MVTBYTo2Y1HrEKxeEGfNNoKhLZ9ZYQhb26zQUzngJ6SLUVRX9
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
                  <v-flex xs12 class="subheading">Profile: Constant</v-flex>
                  <v-flex xs12 class="subheading">Chains spread: 50</v-flex>
                  <v-flex xs12 class="subheading">Chains spread: 50</v-flex>
                  <v-flex xs12 class="subheading">Chains spread: 50</v-flex>
                  <v-flex xs12 class="subheading">Chains spread: 50</v-flex>
                  <v-flex xs12 class="subheading">Chains spread: 50</v-flex>
                  <v-flex xs12 class="subheading"
                    >Entry size: 1024 bytes</v-flex
                  >
                </v-layout>
              </v-container>
            </v-sheet>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 lg8 pa-2 d-flex>
        <v-sheet class="d-flex" elevation="2" height="416">
          <v-container>
            <v-layout wrap> </v-layout>
          </v-container>
        </v-sheet>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ["loadConfig"]
};
</script>
