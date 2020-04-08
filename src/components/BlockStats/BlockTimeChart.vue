<script>
import { Bar, mixins } from "vue-chartjs";
import "chartjs-plugin-annotation";

export default {
  extends: Bar,
  props: ["chartData", "options"],
  mixins: [mixins.reactiveProp],
  mounted() {
    this.renderChart(this.chartData, {
      legend: {
        labels: {
          fontColor: "grey",
          fontSize: 14,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      annotation: {
        annotations: [
          {
            type: "line",
            mode: "horizontal",
            scaleID: "y-axis-0",
            value: 600,
            borderColor: "#C85D59",
            borderWidth: 2,
          },
        ],
      },
    });
  },
};
</script>
