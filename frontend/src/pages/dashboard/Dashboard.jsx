// import "./Dashboard.css";
import { React, useState, useEffect } from 'react';
import 'chartjs-adapter-luxon';
import { getCellIds, getCellData } from '../../services/cell';
import { getTerosData } from '../../services/teros';
import { getPowerData } from '../../services/power';
import PwrChart from '../../charts/PwrChart/PwrChart';
import VChart from '../../charts/VChart/VChart';
import VwcChart from '../../charts/VwcChart/VwcChart';
import TempChart from '../../charts/TempChart/TempChart';
import { DateTime } from 'luxon';
import DownloadBtn from './DownloadBtn';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DateRangeSel from './DateRangeSel';

function Dashboard() {
  const [startDate, setStartDate] = useState(
    DateTime.now().minus({ days: 14 })
  );
  const [endDate, setEndDate] = useState(DateTime.now());
  const [dBtnDisabled, setDBtnDisabled] = useState(true);
  const [cellData, setCellData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(-1);
  const [cellIds, setCellIds] = useState([]);
  const [tempChartData, setTempChartData] = useState({
    label: [],
    datasets: [
      {
        data: [],
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  });
  const [vChartData, setVChartData] = useState({
    label: [],
    datasets: [
      {
        data: [],
        borderColor: 'black',
        borderWidth: 2,
        yAxisID: 'vAxis',
      },
      {
        data: [],
        borderColor: 'black',
        borderWidth: 2,
        yAxisID: 'cAxis',
      },
    ],
  });
  const [pwrChartData, setPwrChartData] = useState({
    label: [],
    datasets: [
      {
        label: 'Voltage',
        data: [],
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  });
  const [vwcChartData, setVWCChartData] = useState({
    label: [],
    datasets: [
      {
        label: 'VWC',
        data: [],
        borderColor: 'black',
        borderWidth: 2,
        yAxisID: 'vwcAxis',
      },
      {
        label: 'EC',
        data: [],
        borderColor: 'black',
        borderWidth: 2,
        yAxisID: 'ecAxis',
      },
    ],
  });

  const updateCharts = (sC, sD, eD) => {
    getCellData(sC, sD, eD).then((response) => {
      const cellDataObj = response.data;
      setCellData(cellDataObj);
    });
    getPowerData(sC, sD, eD).then((response) => {
      const powerDataObj = response.data;
      powerDataObj.timestamp = powerDataObj.timestamp.map((dateTime) =>
        DateTime.fromHTTP(dateTime)
      );
      setVChartData({
        labels: powerDataObj.timestamp,
        datasets: [
          {
            label: 'Voltage (mV)',
            data: powerDataObj.v,
            borderColor: 'lightgreen',
            borderWidth: 2,
            fill: false,
            yAxisID: 'vAxis',
            radius: 2,
            pointRadius: 2,
          },
          {
            label: 'Current (µA)',
            data: powerDataObj.i,
            borderColor: 'purple',
            borderWidth: 2,
            fill: false,
            yAxisID: 'cAxis',
            radius: 2,
            pointRadius: 2,
          },
        ],
      });
      setPwrChartData({
        labels: powerDataObj.timestamp,
        datasets: [
          {
            label: 'Power (µW)',
            data: powerDataObj.p,
            borderColor: 'orange',
            borderWidth: 2,
            fill: false,
            radius: 2,
            pointRadius: 2,
          },
        ],
      });
    });
    getTerosData(sC, sD, eD).then((response) => {
      const terosDataObj = response.data;
      terosDataObj.timestamp = terosDataObj.timestamp.map((dateTime) =>
        DateTime.fromHTTP(dateTime)
      );
      setVWCChartData({
        labels: terosDataObj.timestamp,
        datasets: [
          {
            label: 'Volumetric Water Content (VWC)',
            data: terosDataObj.vwc,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
            yAxisID: 'vwcAxis',
            radius: 2,
            pointRadius: 2,
          },
          {
            label: 'Electrical Conductivity (µS/cm)',
            data: terosDataObj.ec,
            borderColor: 'black',
            borderWidth: 2,
            fill: false,
            yAxisID: 'ecAxis',
            radius: 2,
            pointRadius: 2,
          },
        ],
      });
      setTempChartData({
        labels: terosDataObj.timestamp,
        datasets: [
          {
            label: 'Temperature',
            data: terosDataObj.temp,
            borderColor: 'red',
            borderWidth: 2,
            fill: false,
            radius: 2,
            pointRadius: 2,
          },
        ],
      });
    });
  };

  useEffect(() => {
    if (selectedCell != -1) {
      updateCharts(selectedCell, startDate, endDate);
    }
  }, [selectedCell, startDate, endDate]);

  useEffect(() => {
    if (Object.keys(cellData).length != 0) {
      setDBtnDisabled(false);
    }
  }, [cellData]);

  useEffect(() => {
    getCellIds().then((response) => {
      setCellIds(response.data);
    });
  }, []);
  useEffect(() => {
    if (cellIds[0]) {
      setSelectedCell(parseInt(cellIds[0].id));
    }
  }, [cellIds]);

  return (
    <Stack
      direction='column'
      divider={<Divider orientation='horizontal' flexItem />}
      justifyContent='spaced-evently'
      sx={{ height: '100vh', boxSizing: 'border-box' }}
    >
      <Stack
        direction='row'
        divider={<Divider orientation='vertical' flexItem />}
        alignItems='center'
        justifyContent='space-evenly'
        sx={{ p: 2 }}
        flexItem
      >
        <FormControl sx={{ width: 1 / 4 }}>
          <InputLabel id='cell-select'>Cell</InputLabel>
          {selectedCell != -1 && (
            <Select
              labelId='cell-select-label'
              id='cell-select'
              value={selectedCell}
              label='Cell'
              defaultValue={selectedCell}
              onChange={(e) => {
                setSelectedCell(e.target.value);
              }}
            >
              {Array.isArray(cellIds)
                ? cellIds.map(({ id, name }) => {
                    return (
                      <MenuItem value={id} key={id}>
                        {name}
                      </MenuItem>
                    );
                  })
                : ''}
            </Select>
          )}
        </FormControl>
        <Box display='flex' justifyContent='center' alignItems='center'>
          <DateRangeSel
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          ></DateRangeSel>
        </Box>
        <DownloadBtn disabled={dBtnDisabled} data={cellData} />
      </Stack>
      <Grid
        container
        spacing={3}
        sx={{ height: '100%', width: '100%', p: 2 }}
        alignItems='center'
        justifyContent='space-evenly'
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item sx={{ height: '50%' }} xs={4} sm={4} md={5.5} p={0.25}>
          <VChart data={vChartData} />
        </Grid>
        <Grid item sx={{ height: '50%' }} xs={4} sm={4} md={5.5} p={0.25}>
          <PwrChart data={pwrChartData} />
        </Grid>
        <Grid item sx={{ height: '50%' }} xs={4} sm={4} md={5.5} p={0.25}>
          <VwcChart data={vwcChartData} />
        </Grid>
        <Grid item sx={{ height: '50%' }} xs={4} sm={4} md={5.5} p={0.25}>
          <TempChart data={tempChartData} />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default Dashboard;
