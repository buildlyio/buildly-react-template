import { useActor, useSelector } from "@xstate/react";
import Table from "react-bootstrap/Table";
import { Release } from "../../../interfaces/release";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Dropdown, ProgressBar } from "react-bootstrap";
import DoughnutChart from "../../../components/Charts/Doughnut";
import BarChart from "../../../components/Charts/BarChart";
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
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { HttpService } from "../../../services/http.service";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import "./ReleaseList.css";
import { GlobalStateContext } from "../../../context/globalState";
import LoadingSpinner from "../../../components/Spinner";
import Chatbot from "../../../components/Chatbot/Chatbot";
import { routes } from "../../../routes/routesConstants";

const httpService = new HttpService();

interface BarChartData {
  label: string;
  key: string;
  backgroundColor: string;
  data: number[];
}

function ReleaseList() {
  // define current product (select from product state)
  // const [currentProduct, setCurrentProduct] = useState(null as any);

  // define release summary
  const [releasesSummary, setReleasesSummary] = useState(null as any);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const globalContext = useContext(GlobalStateContext);
  const [productState] = useActor(globalContext.productMachineService);
  const [releaseState, sendRelease] = useActor(
    globalContext.releaseMachineService
  );
  const selectCurrentProduct = (state: any) => state.context.selectedProduct;
  const selectReleases = (state: any) => state.context.releases;

  const currentProduct = useSelector(
    globalContext.productMachineService,
    selectCurrentProduct
  );
  const releases = useSelector(
    globalContext.releaseMachineService,
    selectReleases
  );

  let featuresReleaseNames: string[] = [];
  let issuesReleaseNames: string[] = [];
  useEffect(() => {
    // set current product
    if (currentProduct) {
      sendRelease({
        type: "LoadReleases",
        product_uuid: currentProduct.product_uuid,
      });

      try {
        httpService
          .fetchData(
            `/release/release_summary/?product_uuid=${currentProduct.product_uuid}`,
            "release"
          )
          .then((response: any) => {
            // Construct issues summary data
            const issuesSummaryObj = generateBarChartData(
              response.data.issues,
              "issues_data"
            );
            issuesReleaseNames = issuesSummaryObj.releaseNames;

            // Construct features summary data
            const featuresSummaryObj = generateBarChartData(
              response.data.features,
              "features_data"
            );
            featuresReleaseNames = featuresSummaryObj.releaseNames;

            setReleasesSummary({
              releases: Object.values(response.data.releases),
              features: featuresSummaryObj.barChartSummaryData,
              issues: issuesSummaryObj.barChartSummaryData,
            });
          });
      } catch (httpError) {
        console.log("httpError : ", httpError);
      }
    }
  }, [productState]);

  /**
   * Construct bar chart data
   * @param data
   * @param dataField
   */
  const generateBarChartData = (data: any, dataField: string) => {
    const releaseNames: string[] = [];
    const barChartSummaryData: BarChartData[] = [
      {
        label: "Completed",
        key: "completed",
        backgroundColor: "#0D5595",
        data: [],
      },
      {
        label: "In progress",
        key: "in_progress",
        backgroundColor: "#F8943C",
        data: [],
      },
      {
        label: "Overdue",
        key: "overdue",
        backgroundColor: "#C91B1A",
        data: [],
      },
    ];

    data.forEach((entry: any) => {
      releaseNames.push(entry.release);
      Object.keys(entry[dataField]).forEach((key) => {
        const index = barChartSummaryData.findIndex(
          (summaryEntry) => summaryEntry.key === key
        );

        if (index > -1) {
          barChartSummaryData[index].data.push(entry[dataField][key]);
        }
      });
    });

    return { releaseNames, barChartSummaryData };
  };

  // Add/Edit release modal
  const [showReleaseModal, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // Release form
  const [formData, setFormData] = useState({} as Release);

  // Update formData on form value change
  const updateFormData = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitRelease = (event: any) => {
    event.preventDefault();
    if (currentProduct) {
      const data = { product_uuid: currentProduct.product_uuid, ...formData };
      sendRelease({ type: "Submit", release: data });
    }
  };

  const deleteRelease = (row: any) => {
    sendRelease({ type: "Delete", release_uuid: row.release_uuid });
  };

  // Sample data
  const pieChartLabels = ["Completed", "Overdue", "In progress"];
  const backgroundColor = "#02b844";
  const borderWidth = 1;
  const borderColor = "#000000";

  // Table
  function createData(
    release_uuid: string,
    name: string,
    features_done: number,
    // progress_bar_variant: string,
    // status: number,
    features_count: number,
    issues_count: number,
    release_date: string
  ) {
    const barValue = (features_done / features_count) * 100;
    return {
      release_uuid,
      name,
      features_done,
      // progress_bar_variant,
      // status,
      features_count,
      issues_count,
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

  /**
   * Init progress bar
   * @param row
   */
  const initProgressBar = (row: any) => {
    const value = (row.features_done / row.features_count) * 100;
    const theme = value > 74 ? "info" : value > 40 ? "warning" : "danger";
    return { value, theme };
  };

  function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    let progressBarObj = {
      value: 0,
      theme: "danger",
    };

    if (row.features_count > 0) {
      progressBarObj = initProgressBar(row);
    }

    let featuresList: any[] = [];
    if (open && row) {
      try {
        httpService
          .fetchData(
            `/feature/?release_features__release_uuid=${row.release_uuid}`,
            "release"
          )
          .then((response: any) => {
            featuresList = response.data;
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
          <TableCell>
            <Link
              to={{
                pathname: `${routes.RELEASE}/${row.release_uuid}`,
              }}
            >
              {row.name}
            </Link>{" "}
          </TableCell>
          <TableCell>
            <Tooltip
              title={`${progressBarObj.value}% achieved`}
              placement="right-start"
            >
              <ProgressBar
                now={progressBarObj.value}
                label={`${progressBarObj.value}%`}
                variant={progressBarObj.theme}
              />
            </Tooltip>
          </TableCell>
          {/*<TableCell align="right">{row.status}</TableCell>*/}
          <TableCell align="center">{row.features_count}</TableCell>
          <TableCell align="center">{row.issues_count}</TableCell>
          <TableCell align="center">{row.release_date}</TableCell>
          <TableCell align="right">
            <Dropdown>
              <Dropdown.Toggle variant="info" id="dropdown-basic">
                <IconButton aria-label="expand row" size="small">
                  <MoreVertIcon />
                </IconButton>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => deleteRelease(row)}>
                  Delete release
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              paddingLeft: 8,
              backgroundColor: "#f5f5f5",
            }}
            colSpan={12}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {/*<Typography variant="h6" gutterBottom component="div">*/}
                {/*  Features*/}
                {/*</Typography>*/}
                <Table size="small" aria-label="features">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Progress</TableCell>
                      {/*<TableCell>Status</TableCell>*/}
                      <TableCell>Issues</TableCell>
                      <TableCell align="right">Assignees</TableCell>
                      <TableCell align="right">Date Due</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {featuresList.length ? (
                      featuresList.map((feature) => (
                        <TableRow key={feature.feature_uuid}>
                          <TableCell component="th" scope="row">
                            {feature.name}
                          </TableCell>
                          <TableCell>{feature.progress}</TableCell>
                          <TableCell>{feature.status}</TableCell>
                          <TableCell>{feature.issues}</TableCell>
                          <TableCell align="right">
                            {feature.assignees}
                          </TableCell>
                          <TableCell align="right">
                            {feature.date_due}
                          </TableCell>
                          {/*<TableCell align="right">*/}
                          {/*  {Math.round(*/}
                          {/*      feature.amount * row.features_count * 100*/}
                          {/*  ) / 100}*/}
                          {/*</TableCell>*/}
                        </TableRow>
                      ))
                    ) : (
                      <div className="p-2">No features to display</div>
                    )}
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
      {summaryLoading ? (
        <>
          <div className="d-flex flex-column align-items-center justify-content-center h-50">
            <LoadingSpinner />
          </div>
        </>
      ) : (
        <>
          {" "}
          {releases.length ? (
            <>
              <div className="d-flex justify-content-between">
                <Typography variant="h6">Releases summary</Typography>

                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleShow}
                >
                  New release
                </Button>
              </div>

              {/*style={{ position: "relative", height: "33%" }}*/}

              {releasesSummary ? (
                <div className="container-fluid charts-parent-container">
                  <div
                    className="row flex-nowrap justify-content-between"
                    style={{ height: "100%" }}
                  >
                    <div
                      className="chart-container"
                      style={{
                        width: "32%",
                      }}
                    >
                      <DoughnutChart
                        id="releases"
                        labels={pieChartLabels}
                        label="Releases summary"
                        data={releasesSummary?.releases}
                      />
                    </div>
                    <div
                      className="chart-container"
                      style={{
                        width: "32%",
                      }}
                    >
                      <BarChart
                        id="features"
                        label="Features summary"
                        labels={featuresReleaseNames}
                        data={releasesSummary?.features}
                        backgroundColor={backgroundColor}
                        borderWidth={borderWidth}
                        borderColor={borderColor}
                      />
                    </div>
                    <div
                      className="chart-container"
                      style={{
                        width: "32%",
                      }}
                    >
                      <BarChart
                        id="issues"
                        label="Issues summary"
                        labels={issuesReleaseNames}
                        data={releasesSummary?.issues}
                        backgroundColor={backgroundColor}
                        borderWidth={borderWidth}
                        borderColor={borderColor}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="d-flex justify-content-between">
                <Typography variant="h6">Releases </Typography>
              </div>
              <TableContainer component={Paper} className="mt-2">
                <Table aria-label="collapsible table">
                  <TableHead
                    sx={{
                      "& .MuiTableCell-root": {
                        backgroundColor: "#EDEDED",
                      },
                    }}
                  >
                    <TableRow
                      sx={{
                        "& th": {
                          fontWeight: "500",
                        },
                      }}
                    >
                      <TableCell width="12" />
                      <TableCell width="33%">Name</TableCell>
                      <TableCell>Progress</TableCell>
                      {/*<TableCell align="right">Status</TableCell>*/}
                      <TableCell align="center">Features</TableCell>
                      <TableCell align="center">Issues</TableCell>
                      <TableCell align="center">Release date</TableCell>
                      <TableCell align="right" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {releases.length
                      ? releases.map((row: any) => (
                          <Row key={row.release_uuid} row={row} />
                        ))
                      : []}
                  </TableBody>
                </Table>
              </TableContainer>

              {/*Add/Edit release modal*/}
              <Modal
                show={showReleaseModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>New release</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {" "}
                  <Form noValidate>
                    {/*name*/}
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Name"
                        name="name"
                        required
                        onChange={(event) => updateFormData(event)}
                      />
                    </Form.Group>
                    {/*description*/}
                    <Form.Group className="mb-3" controlId="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="description"
                        onChange={(event) => updateFormData(event)}
                      />
                    </Form.Group>
                    {/*release date*/}
                    <Form.Group className="mb-3" controlId="date">
                      <Form.Label>Release date</Form.Label>
                      <Form.Control
                        size="sm"
                        type="date"
                        placeholder="Release date"
                        name="release_date"
                        required
                        onChange={(event) => updateFormData(event)}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                      type='button'
                    variant="outlined"
                      color='primary'
                    size="small"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      size="small" disabled={!(formData.name && formData.release_date)}
                      onClick={(event) => submitRelease(event)}
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          ) : (
            <>
              {" "}
              <div className="d-flex flex-column align-items-center justify-content-center h-50">
                <Typography variant="h6" className="text-center pb-2">
                  No releases to display for the current product. <br />
                  To get you started, create a release!
                </Typography>

                <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleShow}
                >
                  New release
                </Button>
              </div>
            </>
          )}
        </>
      )}
      <Chatbot />
    </>
  );
}

export default ReleaseList;
