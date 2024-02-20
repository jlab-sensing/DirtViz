import { React } from 'react';
import 'chartjs-adapter-luxon';
import PropTypes from 'prop-types';
import ChartWrapper from '../ChartWrapper';
import { DateTime } from 'luxon';
export default function VChart({ data, stream }) {
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        position: 'bottom',
        title: {
          display: true,
          text: 'Time',
        },
        type: 'time',
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
            hour: 'hh:mm',
            day: 'D',
          },
        },
      },
      vAxis: {
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cell Voltage (mV)',
        },
        min: 0,
        max: 400,
        grid: {
          drawOnChartArea: false,
        },
      },
      cAxis: {
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Current (µA)',
        },
        min: 0,
        max: 160,
      },
    },
  };

  const streamChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        position: 'bottom',
        title: {
          display: true,
          text: 'Time',
        },
        type: 'time',
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
            second: 'hh:mm:ss',
            minute: 'hh:mm',
            hour: 'hh:mm a',
            day: 'D',
          },
        },
        suggestedMin: DateTime.now().minus({ second: 10 }).toJSON(),
        suggestedMax: DateTime.now().toJSON(),
      },
      vAxis: {
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cell Voltage (mV)',
        },
        min: 0,
        max: 400,
        grid: {
          drawOnChartArea: false,
        },
      },
      cAxis: {
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Current (µA)',
        },
        min: 0,
        max: 160,
      },
    },
  };

  return <ChartWrapper id='v' data={data} options={stream ? streamChartOptions : chartOptions} stream={stream} />;
}

VChart.propTypes = {
  data: PropTypes.object,
};
