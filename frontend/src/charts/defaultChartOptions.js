// export const zoomOptions = {
//   zoom: {
//     pinch: {
//       enabled: true,
//     },
//     mode: "xy",
//   },
//   pan: {
//     enabled: true,
//     mode: "xy",
//   },
// };

export const zoomOptions = {
  zoom: {
    wheel: {
      enabled: true,
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
      backgroundColor: 'rgba(54, 162, 235, 0.3)'
    },
    pinch: {
      enabled: false,
    },
    mode: 'xy',
  },
  pan: {
    enabled: false,
    mode: 'xy',
  }
};
// </block>
// </block>

const panStatus = () => zoomOptions.pan.enabled ? 'enabled' : 'disabled';
const zoomStatus = () => zoomOptions.zoom.drag.enabled ? 'enabled' : 'disabled';


export const drawVerticalLine = (chartInstance) => {
  const { chart } = chartInstance;
  const { ctx, chartArea } = chart;

  if (chartInstance.tooltip._active && chartInstance.tooltip._active.length) {
    const activePoint = chartInstance.tooltip._active[0];
    const { x } = activePoint.element.parsed.x;
    const topY = chart.scales.y.top;
    const bottomY = chart.scales.y.bottom;

    // Draw vertical line
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.moveTo(x, topY);
    ctx.lineTo(x, bottomY);
    ctx.stroke();
    ctx.restore();

    // Display data value
    const value = chartInstance.data.datasets[activePoint.datasetIndex].data[activePoint.dataIndex];
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(value, x, topY - 10);
  }
};
// // <block:border:3>
// export const borderPlugin = {
//   id: 'chartAreaBorder',
//   beforeDraw(chart, args, options) {
//     const {ctx, chartArea: {left, top, width, height}} = chart;
//     if (chart.options.plugins.zoom.zoom.wheel.enabled) {
//       ctx.save();
//       ctx.strokeStyle = 'red';
//       ctx.lineWidth = 1;
//       ctx.strokeRect(left, top, width, height);
//       ctx.restore();
//     }
//   }
// };

export const actions = [
  {
    name: 'Toggle zoom',
    handler(chart) {
      zoomOptions.zoom.wheel.enabled = !zoomOptions.zoom.wheel.enabled;
      chart.update();
    }
  }, {
    name: 'Reset zoom',
    handler(chart) {
      chart.resetZoom();
    }
  }
];