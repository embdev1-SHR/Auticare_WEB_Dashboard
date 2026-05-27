
import React from 'react'
import dynamic from "next/dynamic";

function ScreeningResultChart(props) {

  const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });


  let state = {
          series: props.series,
          options: {
            labels:props.labels,
            fill: {
              colors: props.colors,
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
  return (
<> {typeof window !== "undefined" && <ReactApexChart key= {props} options={state.options} series={state.series} type="donut" height={230} />}</>
)
}

export default ScreeningResultChart