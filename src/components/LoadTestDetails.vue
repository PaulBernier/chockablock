<template>
  <v-layout wrap>
    <v-flex xs12 lg4 pa-2
      ><LoadTestInfo :loadTest="loadTest"></LoadTestInfo>
    </v-flex>
    <v-flex xs12 lg8
      ><TimeRangeBlockStats
        :startTimestamp="blockTimeRange.start"
        :endTimestamp="blockTimeRange.end"
      ></TimeRangeBlockStats
    ></v-flex>
  </v-layout>
</template>

<script>
import LoadTestInfo from "@/components/LoadTestDetails/LoadTestInfo";
import TimeRangeBlockStats from "@/components/LoadTestDetails/TimeRangeBlockStats";

export default {
  components: { LoadTestInfo, TimeRangeBlockStats },
  props: ["loadTest"],
  computed: {
    blockTimeRange() {
      return {
        start: this.loadTest.start.timestamp - 1800,
        end: this.loadTest.end.timestamp + 1200,
      };
    },
  },
};
</script>
