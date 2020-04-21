<template>
  <ul>
    <li>Load agents: {{ loadTest.agentsCount }}</li>
    <li>Entry size: {{ loadTest.entrySizeRange | formatRange }}</li>
    <li>Chains: {{ loadTest.chainIds.length }}</li>
    <!-- Type specific config -->
    <li>Type: {{ loadTest.type }}</li>
    <template v-if="loadTest.type === 'constant'">
      <li>EPS: {{ loadTest.generatorConfig.eps }}</li>
    </template>
  </ul>
</template>

<script>
export default {
  props: ["loadTest"],
};
</script>
