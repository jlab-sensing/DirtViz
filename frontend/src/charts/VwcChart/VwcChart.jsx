import { React } from 'react';
import 'chartjs-adapter-luxon';
import PropTypes from 'prop-types';
import ChartWrapper from '../ChartWrapper';
import { DateTime } from 'luxon';

export default function VwcChart({ data, stream }) {
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
            hour: 'hh:mm a',
            day: 'D',
          },
        },
      },
      ecAxis: {
        position: 'right',
        beginAtZero: true,
        suggestedMax: 650,
        title: {
          display: true,
          text: 'EC (µS/cm)',
        },
      },
      vwcAxis: {
        position: 'left',
        beginAtZero: true,
        suggestedMax: 0.65,
        title: {
          display: true,
          text: 'VWC (%)',
        },
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
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
      ecAxis: {
        position: 'right',
        beginAtZero: true,
        suggestedMax: 650,
        title: {
          display: true,
          text: 'EC (µS/cm)',
        },
      },
      vwcAxis: {
        position: 'left',
        beginAtZero: true,
        suggestedMax: 0.65,
        title: {
          display: true,
          text: 'VWC (%)',
        },
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <ChartWrapper id='vwc' data={data} options={chartOptions} />;
}

VwcChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
};
