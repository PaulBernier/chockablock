<template>
  <v-layout wrap>
    <v-flex xs12 pa-2>
      <v-sheet class="d-flex" elevation="2" height="400">
        <EpsChart :chart-data="epsChartData" :options="chartOptions"></EpsChart>
      </v-sheet>
    </v-flex>
    <v-flex xs12 pa-2>
      <v-sheet class="d-flex" elevation="2" height="400">
        <BlockTimeChart
          :chart-data="blockTimeChartData"
          :options="chartOptions"
        ></BlockTimeChart>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import EpsChart from "./BlockStats/EpsChart";
import BlockTimeChart from "./BlockStats/BlockTimeChart";

import BLOCK_STAT_HISTORY from "@/graphql/BlockStatHistory.gql";
import BLOCK_STAT_HISTORY_CHANGED from "@/graphql/BlockStatHistoryChanged.gql";

export default {
  components: { EpsChart, BlockTimeChart },
  data() {
    return {
      blockStatHistory: [],
      chartOptions: {
        legend: {
          labels: {
            fontColor: "grey",
            fontSize: 14
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  apollo: {
    blockStatHistory: {
      query: BLOCK_STAT_HISTORY,
      subscribeToMore: {
        document: BLOCK_STAT_HISTORY_CHANGED,
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            blockStatHistory: subscriptionData.data.blockStatHistoryChanged
          };
        }
      }
    }
  },
  computed: {
    epsChartData() {
      const labels = [],
        data = [];

      this.blockStatHistory.forEach(e => {
        labels.push(e.height.toString());
        data.push(e.entryCount / 600);
      });

      return {
        labels,
        datasets: [
          {
            label: "Average Entry Per Second",
            backgroundColor: "#F4B75D",
            pointBackgroundColor: "#F4B75D",
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 5,
            data
          }
        ]
      };
    },
    blockTimeChartData() {
      const labels = [],
        backgroundColor = [],
        data = [];

      for (let i = 0; i < this.blockStatHistory.length - 1; ++i) {
        const e = this.blockStatHistory[i];
        labels.push(e.height.toString());
        backgroundColor.push(e.hasElection ? "#C85D59" : "#F4B75D");
        data.push(this.blockStatHistory[i + 1].timestamp - e.timestamp);
      }

      return {
        labels,
        datasets: [
          {
            label: "Block time (seconds)",
            backgroundColor,
            data
          }
        ]
      };
    }
  }
};
</script>
