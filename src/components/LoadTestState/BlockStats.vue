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
      blockStatHistory: { currentBlockStartTime: 0, history: [] },
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
    history() {
      return this.blockStatHistory ? this.blockStatHistory.history : [];
    },
    epsChartData() {
      const labels = [],
        data = [];

      for (let i = 0; i < this.history.length; ++i) {
        const e = this.history[i];
        labels.push(e.height.toString());

        if (i === this.history.length - 1) {
          data.push(
            e.entryCount /
              (this.blockStatHistory.currentBlockStartTime - e.timestamp)
          );
        } else {
          data.push(
            e.entryCount / (this.history[i + 1].timestamp - e.timestamp)
          );
        }
      }

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

      for (let i = 0; i < this.history.length; ++i) {
        const e = this.history[i];
        labels.push(e.height.toString());
        backgroundColor.push(e.hasElection ? "#C85D59" : "#F4B75D");

        if (i === this.history.length - 1) {
          data.push(this.blockStatHistory.currentBlockStartTime - e.timestamp);
        } else {
          data.push(this.history[i + 1].timestamp - e.timestamp);
        }
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
