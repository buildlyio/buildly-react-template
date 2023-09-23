import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Button, ProgressBar, Tab, Tabs } from "react-bootstrap";
import ReleaseForm from "./components/ReleaseForm";
import { HttpService } from "../../../services/http.service";

const httpService = new HttpService();

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
    feature_uuid: string,
    name: string,
    progress: number,
    progress_bar_variant: string,
    status: number,
    features: number,
    issues: number,
    release_date: string
  ) {
    return {
      feature_uuid,
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

  // Initialize release details
  const [releasesDetails, setReleaseDetails] = useState(null as any);
  const [releaseFeatures, setReleaseFeatures] = useState(null as any);
  if (releaseUuid) {
    if (!releasesDetails) {
      try {
        httpService
          .fetchData(`/release/${releaseUuid}/`, "release")
          .then((response: any) => {
            if (response && response.data) {
              setReleaseDetails(response.data);
            }
          });
      } catch (httpError) {
        console.log("httpError : ", httpError);
      }
    }

    if (!releaseFeatures) {
      try {
        httpService
          .fetchData(
            `/feature/?release_features__release_uuid=${releaseUuid}`,
            "release"
          )
          .then((response: any) => {
            if (response && response.data) {
              setReleaseFeatures(response.data);
            }
          });
      } catch (httpError) {
        console.log("httpError : ", httpError);
      }
    }
  }

  function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    let issuesList: any[] = [];
    if (open && row) {
      try {
        httpService
          .fetchData(`/issue/?feature=${row.feature_uuid}`, "release")
          .then((response: any) => {
            if (response && response.data) {
              issuesList = response.data;
            }
          });
      } catch (httpError) {
        console.log("httpError : ", httpError);
      }
    }

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
          {/*<TableCell>*/}
          {/*  <ProgressBar*/}
          {/*    now={row.progress}*/}
          {/*    label={`${row.progress}%`}*/}
          {/*    variant={row.progress_bar_variant}*/}
          {/*  />*/}
          {/*</TableCell>*/}
          <TableCell align="right">{row.status}</TableCell>
          {/*<TableCell align="center">{row.features}</TableCell>*/}
          {/*<TableCell align="center">{row.issues}</TableCell>*/}
          {/*<TableCell align="right">{row.release_date}</TableCell>*/}
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {/*<Typography variant="h6" gutterBottom component="div">*/}
                {/*  History*/}
                {/*</Typography>*/}
                <Table size="small" aria-label="issues">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                      {/*<TableCell align="right">Amount</TableCell>*/}
                      {/*<TableCell align="right">Total price ($)</TableCell>*/}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {issuesList.map((issue) => (
                      <TableRow key={issue.issue_uuid}>
                        <TableCell component="th" scope="row">
                          {issue.name}
                        </TableCell>
                        <TableCell>{issue.status}</TableCell>
                        {/*<TableCell align="right">{issue.amount}</TableCell>*/}
                        {/*<TableCell align="right">*/}
                        {/*  {Math.round(issue.amount * row.status * 100) / 100}*/}
                        {/*</TableCell>*/}
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

  return (
    <>
      <section className="toolbar ">
        {" "}
        <Button variant="dark" size="sm">
          <KeyboardArrowLeftIcon />
        </Button>
        <Link
          className="toolbar-header"
          to={{
            pathname: `/releases/`,
          }}
        >
          {releasesDetails && releasesDetails.name}
        </Link>{" "}
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
        {/*Release summary tab*/}
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

        {/*Edit details tab*/}
        <Tab eventKey="details" title="Details">
          <ReleaseForm releasesDetails={releasesDetails} />
        </Tab>

        {/*Features & Issues summary*/}
        <Tab eventKey="features-issues" title="Features & Issues">
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell width="12" />
                  <TableCell width="33%">Name</TableCell>
                  {/*<TableCell>Progress</TableCell>*/}
                  <TableCell align="center">Status</TableCell>
                  {/*<TableCell align="center">Features</TableCell>*/}
                  {/*<TableCell align="center">Issues</TableCell>*/}
                  {/*<TableCell align="right">Release date</TableCell>*/}
                </TableRow>
              </TableHead>
              <TableBody>
                {releaseFeatures && releaseFeatures.length
                  ? releaseFeatures.map((row: any) => (
                      <Row key={row.feature_uuid} row={row} />
                    ))
                  : []}
              </TableBody>
            </Table>
          </TableContainer>
        </Tab>
      </Tabs>
    </>
  );
}
export default ReleaseDetails;
