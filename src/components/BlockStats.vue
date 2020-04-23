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

export default {
  components: { EpsChart, BlockTimeChart },
  props: ["blockStatHistory"],
  data() {
    return {
      chartOptions: {
        legend: {
          labels: {
            fontColor: "grey",
            fontSize: 14,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {
    history() {
      return this.blockStatHistory ? this.blockStatHistory.history : [];
    },
    epsChartData() {
      const labels = [],
        epsData = [],
        entryCountData = [];

      for (let i = 0; i < this.history.length; ++i) {
        const e = this.history[i];
        labels.push(e.height.toString());
        entryCountData.push(e.entryCount);

        if (i === this.history.length - 1) {
          epsData.push(
            e.entryCount /
              (this.blockStatHistory.nextBlockStartTime - e.timestamp)
          );
        } else {
          epsData.push(
            e.entryCount / (this.history[i + 1].timestamp - e.timestamp)
          );
        }
      }

      return {
        labels,
        datasets: [
          {
            label: "Average Entry Per Second",
            yAxisID: "left-y-axis",
            borderColor: "#F4B75D",
            borderWidth: 1,
            pointBackgroundColor: "#F4B75D",
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 5,
            data: epsData,
          },
          {
            label: "Entry count",
            yAxisID: "right-y-axis",
            borderColor: "#F7D7A8",
            borderWidth: 1,
            pointBackgroundColor: "#F7D7A8",
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 5,
            data: entryCountData,
          },
        ],
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
          data.push(this.blockStatHistory.nextBlockStartTime - e.timestamp);
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
            data,
          },
        ],
      };
    },
  },
};
</script>
