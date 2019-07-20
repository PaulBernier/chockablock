<template>
  <BlockStats :blockStatHistory="blockStatHistory"></BlockStats>
</template>

<script>
import BlockStats from "@/components/BlockStats";

import BLOCK_STAT_HISTORY from "@/graphql/BlockStatHistory.gql";

export default {
  components: { BlockStats },
  props: ["startTimestamp", "endTimestamp"],
  data() {
    return {
      blockStatHistory: { nextBlockStartTime: 0, history: [] }
    };
  },
  apollo: {
    blockStatHistory() {
      return {
        query: BLOCK_STAT_HISTORY,
        variables: {
          startTimestamp: this.startTimestamp,
          endTimestamp: this.endTimestamp
        }
      };
    }
  }
};
</script>
