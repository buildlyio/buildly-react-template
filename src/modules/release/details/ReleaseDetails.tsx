import React from "react";
import { useParams } from "react-router-dom";
import DoughnutChart from "../../../components/ReleaseCharts/Doughnut";
import BarChart from "../../../components/ReleaseCharts/BarChart";
import "./ReleaseDetails.css";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ProgressBar, Tab, Tabs } from "react-bootstrap";
import ReleaseForm from "./components/ReleaseForm";

function ReleaseDetails() {
  const { releaseUuid } = useParams();

  // Tabs
  const [tabKey, setTabKey] = React.useState<string>("report");

  // Sample data
  const pieChartLabels = ["Done", "In progress", "Overdue"];
  const pieChartLabel = "Releases summary";
  const pieChartData = [7, 5, 3];

  const barChartLabels = ["bike", "car", "scooter", "truck", "auto", "Bus"];
  const barChartData = [
    {
      label: "Done",
      backgroundColor: "#0D5595",
      data: [17, 16, 4, 11, 8, 9],
    },
    {
      label: "In progress",
      backgroundColor: "#F8943C",
      data: [14, 2, 10, 6, 12, 16],
    },
    {
      label: "Overdue",
      backgroundColor: "#C91B1A",
      data: [2, 21, 13, 3, 24, 7],
    },
  ];
  const backgroundColor = "#02b844";
  const borderWidth = 1;
  const borderColor = "#000000";

  // Table
  function createData(
    name: string,
    progress: number,
    progress_bar_variant: string,
    status: number,
    features: number,
    issues: number,
    release_date: string
  ) {
    return {
      name,
      progress,
      progress_bar_variant,
      status,
      features,
      issues,
      release_date,
      history: [
        {
          date: "2020-01-05",
          customerId: "11091700",
          amount: 3,
        },
        {
          date: "2020-01-02",
          customerId: "Anonymous",
          amount: 1,
        },
      ],
    };
  }

  function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell>
            <ProgressBar
              now={row.progress}
              label={`${row.progress}%`}
              variant={row.progress_bar_variant}
            />
          </TableCell>
          <TableCell align="right">{row.status}</TableCell>
          <TableCell align="center">{row.features}</TableCell>
          <TableCell align="center">{row.issues}</TableCell>
          <TableCell align="right">{row.release_date}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Total price ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow) => (
                      <TableRow key={historyRow.date}>
                        <TableCell component="th" scope="row">
                          {historyRow.date}
                        </TableCell>
                        <TableCell>{historyRow.customerId}</TableCell>
                        <TableCell align="right">{historyRow.amount}</TableCell>
                        <TableCell align="right">
                          {Math.round(historyRow.amount * row.status * 100) /
                            100}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  const rows = [
    createData("Release 1", 59, "info", 6.0, 24, 4.0, "2020-01-05"),
    createData("Release 2", 37, "warning", 9.0, 37, 4.3, "2020-01-05"),
    createData("Release 3", 62, "info", 16.0, 24, 6.0, "2020-01-05"),
    createData("Release 4", 15, "danger", 3.7, 67, 4.3, "2020-01-05"),
    createData("Release 5", 56, "info", 16.0, 49, 3.9, "2020-01-05"),
  ];

  return (
    <>
      <section className="toolbar">
        {" "}
        <h6>{releaseUuid}</h6>
      </section>

      <Tabs
        id="release-details-tabs"
        activeKey={tabKey}
        onSelect={(k) => {
          if (k) {
            setTabKey(k);
          }
        }}
      >
        <Tab eventKey="report" title="Report">
          <div className="container-fluid my-2">
            <div className="row">
              <div className="col chart-container">
                <DoughnutChart
                  id="releases"
                  labels={pieChartLabels}
                  label={pieChartLabel}
                  data={pieChartData}
                />
              </div>
              <div className="col chart-container">
                <BarChart
                  id="features"
                  label="Features summary"
                  labels={barChartLabels}
                  data={barChartData}
                  backgroundColor={backgroundColor}
                  borderWidth={borderWidth}
                  borderColor={borderColor}
                />
              </div>
              <div className="col chart-container">
                <BarChart
                  id="issues"
                  label="Bugs summary"
                  labels={barChartLabels}
                  data={barChartData}
                  backgroundColor={backgroundColor}
                  borderWidth={borderWidth}
                  borderColor={borderColor}
                />
              </div>
            </div>
          </div>
          <div className="container-fluid my-2">
            <div className="row">
              <div className="col chart-container">
                <DoughnutChart
                  id="releases"
                  labels={pieChartLabels}
                  label={pieChartLabel}
                  data={pieChartData}
                />
              </div>
              <div className="col chart-container">
                <DoughnutChart
                  id="releases"
                  labels={pieChartLabels}
                  label={pieChartLabel}
                  data={pieChartData}
                />
              </div>
            </div>
          </div>
        </Tab>
        <Tab eventKey="details" title="Details">
          <ReleaseForm />
        </Tab>
        <Tab eventKey="features-issues" title="Features & Issues">
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Name</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="center">Features</TableCell>
                  <TableCell align="center">Issues</TableCell>
                  <TableCell align="right">Release date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <Row key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Tab>
      </Tabs>
    </>
  );
}
export default ReleaseDetails;
