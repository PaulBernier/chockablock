<template>
  <v-sheet elevation="2">
    <v-container>
      <v-layout wrap>
        <v-flex xs12 text-xs-center class="title primary--text" mb-5>
          {{ loadTest._id }}
        </v-flex>
        <v-flex xs12 class="subheading" mb-2>
          <span class="primary--text">Started</span> by
          {{ loadTest.start.user }}
          on {{ loadTest.start.timestamp | formatDate }}
        </v-flex>
        <v-flex xs12 class="subheading" mb-2>
          <span class="primary--text">Stopped</span> by
          {{ loadTest.end.user }} on {{ loadTest.end.timestamp | formatDate }}
        </v-flex>
        <v-flex xs12 class="subheading" mb-2>
          <span class="primary--text">Duration: </span>{{ duration }}
        </v-flex>
        <v-flex xs12 class="subheading" mb-2>
          <span class="primary--text">Settings</span>
          <TypedLoadConfigList :loadTest="loadTest"></TypedLoadConfigList>
        </v-flex>
        <v-flex xs12 class="subheading primary--text" mb-2>
          Authority Set:
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
</template>

<script>
import moment from "moment";

import TypedLoadConfigList from "@/components/TypedLoadConfigList";

export default {
  props: ["loadTest"],
  components: { TypedLoadConfigList },
  computed: {
    duration() {
      const start = moment(this.loadTest.start.timestamp * 1000);
      const end = moment(this.loadTest.end.timestamp * 1000);
      return moment.duration(end.diff(start)).humanize();
    },
    auditVersions() {
      return this.loadTest.authoritySet.auditVersions
        .map(function (d) {
          const copy = { ...d };
          delete copy.__typename;
          return copy;
        })
        .sort((a, b) => b.count - a.count);
    },
    leaderVersions() {
      return this.loadTest.authoritySet.leaderVersions
        .map(function (d) {
          const copy = { ...d };
          delete copy.__typename;
          return copy;
        })
        .sort((a, b) => b.count - a.count);
    },
  },
};
</script>
