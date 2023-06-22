import { React } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import { zoomOptions } from "../defaultChartOptions";
import PropTypes from "prop-types";

export default function PwrChart(props) {
  const data = props.data;

  //add
  // const chartRef = useRef(null);
  // let chartInstance = null;

  // const handleResetZoom = () => {
  //   if (chartInstance) {
  //     chartInstance.resetZoom();
  //   }
  // };

  // useEffect(() => {
  //   if (chartRef.current) {
  //     chartInstance = chartRef.current.chartInstance;
  //   }
  // }, []);
  //add

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
            day: "D",
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Power (µV",
        },
      },
    },
    plugins: {
      zoom: zoomOptions,
      title: {
       display: true,
       position: 'bottom',
       text: "click to zoom",
       text: (ctx) => '<Click to Zoom>  Zoom: ' + zoomStatus() + ', Pan: ' + panStatus()
      }
    },
    onClick(e) {
      const chart = e.chart;
      chart.options.plugins.zoom.zoom.wheel.enabled = !chart.options.plugins.zoom.zoom.wheel.enabled;
      chart.options.plugins.zoom.zoom.pinch.enabled = !chart.options.plugins.zoom.zoom.pinch.enabled;
      chart.update();
    }
};

  const panStatus = () => zoomOptions.pan.enabled ? 'enabled' : 'disabled';
  const zoomStatus = () => zoomOptions.zoom.wheel.enabled ? 'enabled' : 'disabled';
  

  // return (
  //   <div>
  //     <Line data={data} options={chartOptions} />
  //     <button onClick={handleResetZoom}>Reset Zoom</button>
  //   </div>
  // );

  return <Line data={data} options={chartOptions} />;


  //return //(
    //<div>
      //<Line data={data} options={chartOptions} />

    //</div>
  //);
}
    //<button onClick={handleResetZoom}>Reset Zoom</button>
  // return (
  //   <div>
  //   <line data=={data} />
  //   <button/>
  //   </div>
  //   )


//   Not this:
// return()
// <div>
// </div>
// <line data=={data} />
// <button/>
// )

PwrChart.propTypes = {
  data: PropTypes.object,
};
