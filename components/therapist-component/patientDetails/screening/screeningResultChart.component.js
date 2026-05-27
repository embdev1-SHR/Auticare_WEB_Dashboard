import dynamic from "next/dynamic";
import { Component } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
// import ReactApexChart from "react-apexcharts";

class ScreeningResultChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [40, 10, 10, 15, 25],
      options: {
        labels: ["Rarely", "Sometimes", "Mostly", "Frequently", "Always"],

        fill: {
          colors: ["#51cec7", "#7da7ed", "#ef9981", "#29344a", "#ffc977"],
        },
        colors: ["#292c39"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
      },
    };
  }

  render() {
    return <> {typeof window !== "undefined" && <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={230} />}</>;
  }
}

export default ScreeningResultChart;
