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
    },
    pinch: {
      enabled: true,
    },
    mode: 'xy',
  },
  pan: {
    enabled: true,
    mode: 'xy',
  }
};
// </block>
// </block>

const panStatus = () => zoomOptions.pan.enabled ? 'enabled' : 'disabled';
const zoomStatus = () => zoomOptions.zoom.drag.enabled ? 'enabled' : 'disabled';

const actions = [
  {
    name: 'Reset zoom',
    handler(chart) {
      chart.resetZoom();
    }
  }
];