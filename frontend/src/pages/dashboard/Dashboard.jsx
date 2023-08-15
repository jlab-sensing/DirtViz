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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
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
  const [cellColors, setCellColors] = useState({});
  const updateSelectedCells = (event) => {
    setSelectedCells(event.target.value); // Update selected cell IDs when the selection changes
  };
  const [cellIds, setCellIds] = useState({
    data: [],
  });
  
  //create combine charts
  const [vChartData, setVChartData] = useState({
    // Initialize the chart data with empty datasets for both groups
    datasets: [
      {
        data: [],
      },
      {
        data: [],
      },
    ],
  });

  const [tempChartData, setTempChartData] = useState({
    // Initialize the chart data with empty datasets for both groups
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  const [pwrChartData, setPwrChartData] = useState({
    // Initialize the chart data with empty datasets for both groups
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  const [vwcChartData, setVwcChartData] = useState({
    // Initialize the chart data with empty datasets for both groups
    labels: [],
    datasets: [
      {
        data: [],
      },
      {
        data: [],
      },
    ],
  });

  const updateCharts = (sCs, sD, eD) => {
    const fetchDataPromises = [];
    const cellChartData = []; // To store the chart data for each cell
  
    // Loop through selected cell IDs and fetch data for each cell
    for (const cellId of sCs) {
      // Fetch data for Power Chart
      fetchDataPromises.push(
        getPowerData(cellId, sD, eD).then((response) => {
          const powerDataObj = response.data;
          powerDataObj.timestamp = powerDataObj.timestamp.map((dateTime) =>
            DateTime.fromHTTP(dateTime)
          );
  
          // Create an object with cellId, type, and data
          const cellPowerData = {
            cellid: cellId,
            type: "power",
            data: powerDataObj,
            //borderColor: cellColors[cellId],
          };
          cellChartData.push(cellPowerData); // Push the data for this cell to the array
        })
      );
  
      // Fetch data for VWC Chart
      fetchDataPromises.push(
        getTerosData(cellId, sD, eD).then((response) => {
          const terosDataObj = response.data;
          terosDataObj.timestamp = terosDataObj.timestamp.map((dateTime) =>
            DateTime.fromHTTP(dateTime)
          );
  
          // Create an object with cellId, type, and data
          const cellTerosData = {
            cellid: cellId,
            type: "teros",
            data: terosDataObj,
            //borderColor: cellColors[cellId],
          };
          cellChartData.push(cellTerosData); // Push the data for this cell to the array
        })
      );
    }
  
    // Use Promise.all to handle multiple data fetching asynchronously
    Promise.all(fetchDataPromises).then(() => {
      // Initialize the combined chart data with empty datasets
      const newVChartData = {
        ...vChartData,
        datasets: [],
        data: [],
      };
      const newTempChartData = {
        ...tempChartData,
        datasets: [],
          data: [],
      };
      const newPwrChartData = {
        ...pwrChartData,
        datasets: [],
          data: [],
      };
      const newVwcChartData = {
        ...vwcChartData,
        datasets: [],
          data: [],
      };

      // Access data for each cell and update the combined charts accordingly
      for (const cellData of cellChartData) {
        const cellId = cellData.cellid;
        const type = cellData.type;
        const data = cellData.data;

        

        if (type === "power") {
          // Update the combined Power Chart data for the specific cell
          //vchart data
          newVChartData.labels = data.timestamp;
          if (cellId == 1){
            newVChartData.datasets.push(
              {
                label: "Cell " + cellId + " Voltage (v)", 
                data: data.v,
                borderColor: "lightgreen",
                borderWidth: 2,
                fill: false,
                yAxisID: "vAxis",
                radius: 2,
                pointRadius: 1,
              },
              {
                label: "Cell " + cellId +" Current (µA)",
                data: data.i,
                borderColor: "purple",
                borderWidth: 2,
                fill: false,
                yAxisID: "cAxis",
                radius: 2,
                pointRadius: 1,
              }
            );
  
            //power data
            newPwrChartData.labels = data.timestamp;
            newPwrChartData.datasets.push(
              {
                label: "Cell " + cellId + " Power (µV)", 
                data: data.p,
                borderColor: "orange",
                borderWidth: 2,
                fill: false,
                radius: 2,
                pointRadius: 1,
              },
            );
          }else if (cellId == 2) {
            newVChartData.datasets.push(
              {
                label: "Cell " + cellId + " Voltage (v)", 
                data: data.v,
                borderColor: "green",//change to another in same shade
                borderWidth: 2,
                fill: false,
                yAxisID: "vAxis",
                radius: 2,
                pointRadius: 1,
              },
              {
                label: "Cell " + cellId +" Current (µA)",
                data: data.i,
                borderColor: "gold",//change to another in same shade
                borderWidth: 2,
                fill: false,
                yAxisID: "cAxis",
                radius: 2,
                pointRadius: 1,
              }
            );
  
            //power data
            newPwrChartData.labels = data.timestamp;
            newPwrChartData.datasets.push(
              {
                label: "Cell " + cellId + " Power (µV)", 
                data: data.p,
                borderColor: "yellow",//change to another in same shade
                borderWidth: 2,
                fill: false,
                radius: 2,
                pointRadius: 1,
              },
            );
          }
          
        } else if (type === "teros") {
          //Update the combined VWC Chart data for the specific cell
          if (cellId == 1) {
            newVwcChartData.labels = data.timestamp;
          newVwcChartData.datasets.push(
            {
              label: "Cell " + cellId + " Volumetric Water Content (VWC)", 
              data: data.vwc,
              borderColor: "blue",
              borderWidth: 2,
              fill: false,
              yAxisID: "vwcAxis",
              radius: 2,
              pointRadius: 1,
            },
            {
              label: "Cell " + cellId +" Electrical Conductivity (µS/cm)",
              data: data.ec,
              borderColor: "black",
              borderWidth: 2,
              fill: false,
              yAxisID: "ecAxis",
              radius: 2,
              pointRadius: 1,
            }
          );

          // Update the combined Temperature Chart data for the specific cell
          newTempChartData.labels = data.timestamp;
          newTempChartData.datasets.push(
            {
              label: "Cell " + cellId + " Temperature", 
              data: data.temp,
              borderColor: "red",
              borderWidth: 2,
              fill: false,
              radius: 2,
              pointRadius: 1,
            },
          );
        } else if (cellId == 2){
          newVwcChartData.labels = data.timestamp;
          newVwcChartData.datasets.push(
            {
              label: "Cell " + cellId + " Volumetric Water Content (VWC)", 
              data: data.vwc,
              borderColor: "cyan", //change to another in same shade
              borderWidth: 2,
              fill: false,
              yAxisID: "vwcAxis",
              radius: 2,
              pointRadius: 1,
            },
            {
              label: "Cell " + cellId +" Electrical Conductivity (µS/cm)",
              data: data.ec,
              borderColor: "brown", //change to another in same shade
              borderWidth: 2,
              fill: false,
              yAxisID: "ecAxis",
              radius: 2,
              pointRadius: 1,
            }
          );

          // Update the combined Temperature Chart data for the specific cell
          newTempChartData.labels = data.timestamp;
          newTempChartData.datasets.push(
            {
              label: "Cell " + cellId + " Temperature", 
              data: data.temp,
              borderColor: "pink", //change to another in same shade
              borderWidth: 2,
              fill: false,
              radius: 2,
              pointRadius: 1,
            },
          );
        }
        }
      }

      // Update the combined chart states
      setVChartData(newVChartData);
      setTempChartData(newTempChartData);
      setPwrChartData(newPwrChartData);
      setVwcChartData(newVwcChartData);
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

  useEffect(() => {
    updateCharts(selectedCells, startDate, endDate);
  }, [selectedCells, startDate, endDate]);

  useEffect(() => {
    if (cellIds.data[0]) {
      console.log (cellIds.data);
      updateCharts([parseInt(cellIds.data[0].id)]);
      //turn the list of obj into list of itergers, which is cellId
      setSelectedCells([parseInt(cellIds.data[0].id)]);
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
          <VChart data={vChartData} /> {/* Replace with your desired chart */}
        </Grid>
        <Grid item sx={{ height: "50%" }} xs={4} sm={4} md={5.5} p={0.25}>
          <PwrChart data={pwrChartData} />
        </Grid>
        <Grid item sx={{ height: "50%" }} xs={4} sm={4} md={5.5} p={0.25}>
          <VwcChart data={vwcChartData} />
        </Grid>
        <Grid item sx={{ height: "50%" }} xs={4} sm={4} md={5.5} p={0.25}>
          <TempChart data={tempChartData} />
        </Grid>
      </Grid>
    </Stack>
  );
          }
export default Dashboard;
