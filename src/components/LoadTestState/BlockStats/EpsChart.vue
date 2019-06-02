<script>
import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  props: ["chartData"],
  mixins: [mixins.reactiveProp],
  mounted() {
    this.renderChart(this.chartData, {
      legend: {
        labels: {
          fontColor: "grey",
          fontSize: 14
        }
      },
      responsive: true,
      maintainAspectRatio: false
    });
  }
};
</script>
