// import "./Dashboard.css";
import { React, useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import "chartjs-adapter-luxon";
import zoomPlugin from "chartjs-plugin-zoom";
import { getCellIds } from "../../services/cell";
import { getTerosData } from "../../services/teros";
import { getPowerData } from "../../services/power";
import PwrChart from "../../charts/PwrChart/PwrChart";
import VChart from "../../charts/VChart/VChart";
import VwcChart from "../../charts/VwcChart/VwcChart";
import TempChart from "../../charts/TempChart/TempChart";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateTime } from "luxon";
import DownloadBtn from "../../components/DownloadBtn";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import HorizontalRuleRoundedIcon from "@mui/icons-material/HorizontalRuleRounded";
Chart.register(CategoryScale);
Chart.register(zoomPlugin);

function Dashboard() {
  const [startDate, setStartDate] = useState(
    DateTime.now().minus({ months: 1 })
  );
  const [endDate, setEndDate] = useState(DateTime.now());
  const [dBtnDisabled, setDBtnDisabled] = useState(true);
  const [cellData, setCellData] = useState({});
  //const [selectedCell, setSelectedCell] = useState(0);
  const [selectedCells, setSelectedCells] = useState([]);
  const updateSelectedCells = (event) => {
    setSelectedCells(event.target.value); // Update selected cell IDs when the selection changes
  };
  //
  const [cellIds, setCellIds] = useState({
    data: [],
  });
  const [tempChartData, setTempChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const [vChartData, setVChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: "black",
        borderWidth: 2,
        yAxisID: "vAxis",
      },
      {
        data: [],
        borderColor: "black",
        borderWidth: 2,
        yAxisID: "cAxis",
      },
    ],
  });
  const [pwrChartData, setPwrChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Voltage",
        data: [],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const [vwcChartData, setVWCChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "VWC",
        data: [],
        borderColor: "black",
        borderWidth: 2,
        yAxisID: "vwcAxis",
      },
      {
        label: "EC",
        data: [],
        borderColor: "black",
        borderWidth: 2,
        yAxisID: "ecAxis",
      },
    ],
  });

  //create combine charts
  const [combinedVChartData, setCombinedVChartData] = useState({
    // Initialize the chart data with empty datasets for both groups
    datasets: [
      {
        label: "Voltage (v)",
        data: [],
        borderColor: "lightgreen",
        borderWidth: 2,
        fill: false,
        yAxisID: "vAxis",
        radius: 2,
        pointRadius: 2,
      },
      {
        label: "Current (µA)",
        data: [],
        borderColor: "purple",
        borderWidth: 2,
        fill: false,
        yAxisID: "cAxis",
        radius: 2,
        pointRadius: 2,
      },
    ],
  });

  const [combinedTempChartData, setCombinedTempChartData] = useState({
    // Initialize the chart data with empty datasets for both groups
    labels: [],
    datasets: [
      {
        label: "Temperature",
        data: [],
        borderColor: "red",
        borderWidth: 2,
        fill: false,
        radius: 2,
        pointRadius: 2,
      },
    ],
  });

  const [combinedPwrChartData, setCombinedPwrChartData] = useState({
    // Initialize the chart data with empty datasets for both groups
    labels: [],
    datasets: [
      {
        label: "Power (µV)",
        data: [],
        borderColor: "orange",
        borderWidth: 2,
        fill: false,
        radius: 2,
        pointRadius: 2,
      },
    ],
  });

  const [combinedVwcChartData, setCombinedVwcChartData] = useState({
    // Initialize the chart data with empty datasets for both groups
    labels: [],
    datasets: [
      {
        label: "Volumetric Water Content (VWC)",
        data: [],
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
        yAxisID: "vwcAxis",
        radius: 2,
        pointRadius: 2,
      },
      {
        label: "Electrical Conductivity (µS/cm)",
        data: [],
        borderColor: "black",
        borderWidth: 2,
        fill: false,
        yAxisID: "ecAxis",
        radius: 2,
        pointRadius: 2,
      },
    ],
  });


  const updateCharts = (sC, sD, eD) => {
    // getCellData(sC, sD, eD).then((response) => {
    //   const cellDataObj = response.data;
    //   cellDataObj.timestamp = cellDataObj.timestamp.map((dateTime) =>
    //     DateTime.fromHTTP(dateTime)
    //   );
    // setCellData(cellDataObj);
    getPowerData(sC, sD, eD).then((response) => {
      const powerDataObj = response.data;
      powerDataObj.timestamp = powerDataObj.timestamp.map((dateTime) =>
        DateTime.fromHTTP(dateTime)
      );

      //update the first group of data
      setVChartData({
        labels: powerDataObj.timestamp,
        datasets: [
          {
            label: "Voltage (v)",
            data: powerDataObj.v,
            borderColor: "lightgreen",
            borderWidth: 2,
            fill: false,
            yAxisID: "vAxis",
            radius: 2,
            pointRadius: 2,
          },
          {
            label: "Current (µA)",
            data: powerDataObj.i,
            borderColor: "purple",
            borderWidth: 2,
            fill: false,
            yAxisID: "cAxis",
            radius: 2,
            pointRadius: 2,
          },
        ],
      });
      //update the second group of data
      setCombinedVChartData({
        labels: powerDataObj.timestamp,
        datasets: [
          {
            ...vChartData.datasets[0], // Keep the previous settings for the first dataset
            data: powerDataObj.v.map((value, index) => value + vChartData.datasets[0].data[index]),
          },
          {
            ...vChartData.datasets[1], // Keep the previous settings for the second dataset
            data: powerDataObj.i.map((value, index) => value + vChartData.datasets[1].data[index]),
          },
        ],
      });
      
      //first
      setPwrChartData({
        labels: powerDataObj.timestamp,
        datasets: [
          {
            label: "Power (µV)",
            data: powerDataObj.p,
            borderColor: "orange",
            borderWidth: 2,
            fill: false,
            radius: 2,
            pointRadius: 2,
          },
        ],
      });
      // Update the second group of data (combinedPwrChartData) and combine it with the first group (pwrChartData)
      setCombinedPwrChartData({
        labels: powerDataObj.timestamp,
        datasets: [
          {
            ...pwrChartData.datasets[0], // Keep the previous settings for the first dataset
            data: powerDataObj.p.map((value, index) => value + pwrChartData.datasets[0].data[index]),
          },
        ],
      });
    });

    
    getTerosData(sC, sD, eD).then((response) => {
      const terosDataObj = response.data;
      terosDataObj.timestamp = terosDataObj.timestamp.map((dateTime) =>
        DateTime.fromHTTP(dateTime)
      );
      //first
      setVWCChartData({
        labels: terosDataObj.timestamp,
        datasets: [
          {
            label: "Volumetric Water Content (VWC)",
            data: terosDataObj.vwc,
            borderColor: "blue",
            borderWidth: 2,
            fill: false,
            yAxisID: "vwcAxis",
            radius: 2,
            pointRadius: 2,
          },
          {
            label: "Electrical Conductivity (µS/cm)",
            data: terosDataObj.ec,
            borderColor: "black",
            borderWidth: 2,
            fill: false,
            yAxisID: "ecAxis",
            radius: 2,
            pointRadius: 2,
          },
        ],
      });

      // Update the second group of data (combinedVWCChartData) and combine it with the first group (vwcChartData)
      setCombinedVwcChartData({
        labels: terosDataObj.timestamp,
        datasets: [
          {
            ...vwcChartData.datasets[0], // Keep the previous settings for the first dataset
            data: terosDataObj.vwc.map((value, index) => value + vwcChartData.datasets[0].data[index]),
          },
          {
            ...vwcChartData.datasets[1], // Keep the previous settings for the second dataset
            data: terosDataObj.ec.map((value, index) => value + vwcChartData.datasets[1].data[index]),
          },
        ],
      });

      //first
      setTempChartData({
        labels: terosDataObj.timestamp,
        datasets: [
          {
            label: "Temperature",
            data: terosDataObj.temp,
            borderColor: "red",
            borderWidth: 2,
            fill: false,
            radius: 2,
            pointRadius: 2,
          },
        ],
      });
      // Update the second group of data (combinedTempChartData) and combine it with the first group (tempChartData)
      setCombinedTempChartData({
        labels: terosDataObj.timestamp,
        datasets: [
          {
            ...tempChartData.datasets[0], // Keep the previous settings for the first dataset
            data: terosDataObj.temp.map((value, index) => value + tempChartData.datasets[0].data[index]),
          },
        ],
      });
    });
  };

  useEffect(() => {
    updateCharts(selectedCells, startDate, endDate);
  }, [selectedCells]);

  useEffect(() => {
    setDBtnDisabled(false);
  }, [setCellData]);

  useEffect(() => {
    getCellIds().then((response) => {
      setCellIds({
        data: response.data,
      });
    });
  }, []);

  // useEffect(() => {
  //   updateCharts(selectedCells, startDate, endDate);
  // }, [selectedCells, startDate, endDate]);

  useEffect(() => {
    if (cellIds.data[0]) {
      updateCharts(cellIds.data[0].id);
      setSelectedCells(parseInt(cellIds.data[0].id));
    }
  }, [cellIds]);

  return (
    
    <Stack
      direction="column"
      divider={<Divider orientation="horizontal" flexItem />}
      justifyContent="spaced-evently"
      sx={{ height: "100vh", boxSizing: "border-box" }}
    ><p> hello world </p>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        alignItems="center"
        justifyContent="space-evenly"
        sx={{ p: 2 }}
        flexItem
      >
        <FormControl sx={{ width: 1 / 4 }}>
          <InputLabel id="cell-select">Cell</InputLabel>
          <Select
            labelId="cell-select-label"
            id="cell-select"
            //revised
            multiple // Set the multiple prop to enable multiple selection
            value={selectedCells} // Use selectedCells array instead of selectedCell
            label="Cell"
            onChange={updateSelectedCells}
            //
            // value={selectedCell}
            // label="Cell"
            // defaultValue={selectedCell}
            // onChange={(e) => {
            //   setSelectedCell(e.target.value);
            // }}
          >
            {cellIds.data.map(({ id, location, name }) => {
              return (
                <MenuItem value={id} key={id}>
                  {name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Box display="flex" justifyContent="center" alignItems="center">
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DateTimePicker
              label="Start Date"
              value={startDate}
              onChange={(startDate) => setStartDate(startDate)}
              views={["year", "month", "day", "hours"]}
            />
          </LocalizationProvider>
          <HorizontalRuleRoundedIcon sx={{ mr: 1, ml: 1 }} />
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DateTimePicker
              label="End Date"
              value={endDate}
              onChange={(endDate) => setEndDate(endDate)}
              views={["year", "month", "day", "hours"]}
            />
          </LocalizationProvider>
        </Box>
        <DownloadBtn disabled={dBtnDisabled} data={cellData} />
      </Stack>
      <Grid
        container
        spacing = {3}
        sx={{ height: "100%", width: "100%", p: 2 }}
        alignItems="center"
        justifyContent="space-evenly"
        columns={{ xs: 4, sm: 8, md: 12 }}
        >
        <Grid item sx={{ height: "50%" }} xs={4} sm={4} md={5.5} p={0.25}>
          <VChart data={combinedVChartData} /> {/* Replace with your desired chart */}
        </Grid>
        <Grid item sx={{ height: "50%" }} xs={4} sm={4} md={5.5} p={0.25}>
          <PwrChart data={combinedPwrChartData} />
        </Grid>
        <Grid item sx={{ height: "50%" }} xs={4} sm={4} md={5.5} p={0.25}>
          <VwcChart data={combinedVwcChartData} />
        </Grid>
        <Grid item sx={{ height: "50%" }} xs={4} sm={4} md={5.5} p={0.25}>
          <TempChart data={combinedTempChartData} />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default Dashboard;
