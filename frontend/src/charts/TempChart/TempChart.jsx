import { React, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import { zoomOptions } from "../defaultChartOptions";
import PropTypes from "prop-types";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { Button } from "@mui/material";

Chart.register(zoomPlugin);

export default function TempChart(props) {
  const data = props.data;
  const chartRef = useRef();

  //zoom
  const handleResetZoom = () => {
    console.log("reset zoom");
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  // //zoom
  const handleToggleZoom = () => {
    console.log("toggle zoom");
    if (chartRef.current) {
      const wheelEnabled = chartRef.current.options.plugins.zoom.zoom.wheel.enabled;
      chartRef.current.options.plugins.zoom.zoom.wheel.enabled = !wheelEnabled;
      chartRef.current.update();
    }
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        position: "bottom",
        title: {
          display: true,
          text: "Time",
        },
        type: "time",
        ticks: {
          autoSkip: false,
          autoSkipPadding: 50,
          maxRotation: 0,
          major: {
            enabled: true,
          },
        },
        time: {
          displayFormats: {
            hour: "hh:mm a",
            day: "MM/dd",
          },
        },
      },
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        suggestedMax: 35,
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      zoom: zoomOptions,
      title: {
        display: true,
        text: (ctx) => {
          const {axis = 'xy', intersect, mode} = ctx.chart.options.interaction;
          return 'Zoom: ' + zoomStatus()
        }
      },
    }
  };

  const zoomStatus = () => zoomOptions.zoom.wheel.enabled ? 'enabled' : 'disabled';

  return (
    <>
      <Line ref={chartRef} data={data} options={chartOptions}/>
      <Button onClick={handleResetZoom} variant="outlined" size="small">Reset Zoom</Button>
      <Button onClick={handleToggleZoom} variant="outlined" size="small">Toggle Zoom</Button>
    </>
  );
}

TempChart.propTypes = {
  data: PropTypes.object,
};
