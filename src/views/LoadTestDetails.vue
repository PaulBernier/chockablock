<template>
  <v-container> {{ loadtestId }}</v-container>
</template>

<script>
export default {
  computed: {
    loadtestId() {
      return this.$route.params.id;
    }
  }
};
</script>