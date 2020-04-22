<template>
  <div>
    <div>
      <span> Leaders: {{ authoritySet.leaders }} </span>
    </div>
    <ul>
      <li v-for="v in leaderVersions" :key="v.version">
        {{ v.version }}: {{ v.count }}
      </li>
    </ul>
    <div>
      <span> Audits: {{ authoritySet.audits }} </span>
    </div>
    <ul>
      <li v-for="v in auditVersions" :key="v.version">
        {{ v.version }}: {{ v.count }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["authoritySet"],
  computed: {
    auditVersions() {
      return this.authoritySet.auditVersions
        .map(function (d) {
          const copy = { ...d };
          delete copy.__typename;
          return copy;
        })
        .sort((a, b) => b.count - a.count);
    },
    leaderVersions() {
      return this.authoritySet.leaderVersions
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
