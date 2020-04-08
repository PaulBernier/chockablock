<template>
  <BlockStats :blockStatHistory="latestBlockStatHistory"></BlockStats>
</template>

<script>
import BlockStats from "@/components/BlockStats";

import LATEST_BLOCK_STAT_HISTORY from "@/graphql/LatestBlockStatHistory.gql";
import LATEST_BLOCK_STAT_HISTORY_CHANGED from "@/graphql/LatestBlockStatHistoryChanged.gql";

export default {
  components: { BlockStats },
  data() {
    return {
      latestBlockStatHistory: { nextBlockStartTime: 0, history: [] },
    };
  },
  apollo: {
    latestBlockStatHistory: {
      query: LATEST_BLOCK_STAT_HISTORY,
      subscribeToMore: {
        document: LATEST_BLOCK_STAT_HISTORY_CHANGED,
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            latestBlockStatHistory:
              subscriptionData.data.latestBlockStatHistoryChanged,
          };
        },
      },
    },
  },
};
</script>
