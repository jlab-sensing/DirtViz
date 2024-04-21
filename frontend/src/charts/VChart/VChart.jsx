import { React } from 'react';
import 'chartjs-adapter-luxon';
import PropTypes from 'prop-types';
import ChartWrapper from '../ChartWrapper';
import { DateTime } from 'luxon';
import { getMaxAxisAndStepValues } from '../alignAxis';

export default function VChart({ data, stream }) {
  const { leftYMax, rightYMax, leftYStep, rightYStep } = getMaxAxisAndStepValues(
    data.datasets[0],
    data.datasets[1],
    10,
    10,
  );
  console.log('axis', leftYMax, rightYMax, leftYStep, rightYStep);
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    parsing: false,
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
            day: 'MM/dd',
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
        ticks: {
          beginAtZero: true,
          stepSize: leftYStep,
        },
        // ticks: {
        //   count: 10,
        //   beginAtZero: true,
        //   autoSkip: false,
        //   stepSize: 100,
        //   grace: '5%',
        // },
        min: 0,
        max: leftYMax,
        // max: 400,
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
        ticks: {
          beginAtZero: true,
          stepSize: rightYStep,
        },
        // ticks: {
        //   count: 10,
        //   beginAtZero: true,
        //   autoSkip: false,
        //   stepSize: 100,
        //   grace: '5%',
        // },
        min: 0,
        max: rightYMax,
        // max: 400,
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
          padding: 15,
        },
        grid: {
          tickLength: 15,
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
        type: 'linear',
        grace: '10%',
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cell Voltage (mV)',
        },
        min: 0,
        suggestedMax: 400,
        grid: {
          drawOnChartArea: false,
        },
      },
      cAxis: {
        type: 'linear',
        grace: '10%',
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Current (µA)',
        },
        min: 0,
        suggestedMax: 160,
      },
    },
  };

  return <ChartWrapper id='v' data={data} options={stream ? streamChartOptions : chartOptions} stream={stream} />;
}

VChart.propTypes = {
  data: PropTypes.object,
  stream: PropTypes.bool,
};
