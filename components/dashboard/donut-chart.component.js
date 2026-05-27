import { Component, Fragment } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(import("react-apexcharts"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

class Dountchart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // series: [props.count?.patients - props.count?.patientAppUsers, props.count?.patientAppUsers],
      options: {
        labels: ["Free Users", "Paid Users"],
        colors: ["#34c38f", "#556ee6"],
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "center",
          verticalAlign: "middle",
          floating: false,
          fontSize: "14px",
          offsetX: 0,
          offsetY: -10,
        },
        responsive: [
          {
            breakpoint: 600,
            options: {
              chart: {
                height: 220,
              },
              legend: {
                show: false,
              },
            },
          },
        ],
      },
    };
  }
  render() {
    return (
      <Fragment>
        <ReactApexChart options={this.state.options} series={[((this.props?.count?.patients ? this.props?.count?.patients : 0) - (this.props?.count?.patientAppUsers ? this.props?.count?.patientAppUsers : 0)), this.props?.count?.patientAppUsers ? this.props?.count?.patientAppUsers : 0]} type='donut' height={this.props.graphHeight} />
      </Fragment>
    );
  }
}

export default Dountchart;
