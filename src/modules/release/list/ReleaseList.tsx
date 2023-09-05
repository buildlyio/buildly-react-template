import { useMachine } from "@xstate/react";
import { releaseMachine } from "../../../state/release/release";
import { ReleaseService } from "../../../services/release.service";
import Table from "react-bootstrap/Table";
import { Release } from "../../../interfaces/release";
import React, { useState } from "react";
import CustomModal from "../../../components/ReleaseModal/Modal";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Card, ProgressBar, Stack } from "react-bootstrap";
import DoughnutChart from "../../../components/ReleaseCharts/Doughnut";
import BarChart from "../../../components/ReleaseCharts/BarChart";
import {
  Box,
  Collapse,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const orgUuid = "baa50960-1a98-4ced-bb16-b60662ddea55";
const releaseService = new ReleaseService();

function ReleaseList() {
  const [state, send] = useMachine(releaseMachine, {
    services: {
      loadReleases: async (): Promise<any> => {
        return releaseService.loadReleases("");
      },
    },
  });

  // Add/Edit release modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Sample data
  const pieChartLabel = "Releases summary";
  const pieChartLabels = ["Done", "In progress", "Overdue"];
  const pieChartData = [7, 5, 3];

  const barChartLabels = [
    "Release 1",
    "Release 2",
    "Release 3",
    "Release 4",
    "Release 5",
    "Release 6",
  ];
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
      {/*handleShow*/}

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
              label="Issues summary"
              labels={barChartLabels}
              data={barChartData}
              backgroundColor={backgroundColor}
              borderWidth={borderWidth}
              borderColor={borderColor}
            />
          </div>
        </div>
      </div>

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

      <Card>
        <Card.Body>
          <Card.Title>
            <Stack direction="horizontal" gap={3}>
              <h4>Releases</h4>

              {/*<Button*/}
              {/*  className=" ms-auto"*/}
              {/*  variant="outline-secondary"*/}
              {/*  size="sm"*/}
              {/*  onClick={handleShow}*/}
              {/*>*/}
              {/*  New release*/}
              {/*</Button>*/}
            </Stack>
          </Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Release date</th>
                <th>Features</th>
              </tr>
            </thead>
            <tbody>
              {state.matches("Releases Loaded") &&
                state.context.releases.map((release: Release) => (
                  <tr key={release.release_uuid}>
                    <td>
                      <Link
                        to={{
                          pathname: `/releases/${release.release_uuid}`,
                        }}
                      >
                        {release.name}
                      </Link>{" "}
                    </td>
                    <td>{release.release_date}</td>
                    <td>{release.features_count}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>

      {/*Add/Edit release modal*/}
      <CustomModal show={show} />
    </>
  );
}

export default ReleaseList;