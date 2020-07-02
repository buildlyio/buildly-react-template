import React from "react";
import { connect } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { routes } from "../../../routes/routesConstants";
import { MapComponent } from "../../../components/MapComponent/MapComponent";
import { MAP_API_URL } from "../../../utils/utilMethods";
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
  infoList: {
    display: "flex",
  },
  table: {
    minWidth: 430,
  },
  tableCell: {
    borderBottom: "none",
    width: 100,
  },
}));

function ShipmentOverview(props) {
  const { history, children, shipmentFormData } = props;
  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mb={2}>
            <Typography variant="body1">Shipment Info</Typography>
          </Box>
          <TableContainer component={Card} variant="outlined">
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ borderBottom: "none", width: 100 }}>
                    Shipment ID
                  </TableCell>
                  <TableCell style={{ borderBottom: "none", width: 100 }}>
                    Description
                  </TableCell>
                  <TableCell style={{ borderBottom: "none", width: 100 }}>
                    Quantity{" "}
                  </TableCell>
                  <TableCell style={{ borderBottom: "none", width: 100 }}>
                    Item Type
                  </TableCell>
                  <TableCell style={{ borderBottom: "none", width: 100 }}>
                    Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>12345</TableCell>
                  <TableCell>sxzcfrdssss</TableCell>
                  <TableCell>100</TableCell>
                  <TableCell>abc</TableCell>
                  <TableCell>1400</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="body1">Origin Info</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ borderBottom: "none", width: 50 }}>
                          Shipment ID
                        </TableCell>
                        <TableCell style={{ borderBottom: "none", width: 50 }}>
                          Description
                        </TableCell>
                        <TableCell style={{ borderBottom: "none", width: 50 }}>
                          Quantity{" "}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>12345</TableCell>
                        <TableCell>sxzcfrdssss</TableCell>
                        <TableCell>100</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box mb={2}>
                <Typography variant="body1">Shipper Info</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ borderBottom: "none", width: 100 }}>
                          Shipment ID
                        </TableCell>
                        <TableCell style={{ borderBottom: "none", width: 100 }}>
                          Description
                        </TableCell>
                        <TableCell style={{ borderBottom: "none", width: 100 }}>
                          Quantity{" "}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>12345</TableCell>
                        <TableCell>sxzcfrdssss</TableCell>
                        <TableCell>100</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box mb={2}>
                <Typography variant="body1">Destination Info</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ borderBottom: "none", width: 100 }}>
                          Shipment ID
                        </TableCell>
                        <TableCell style={{ borderBottom: "none", width: 100 }}>
                          Description
                        </TableCell>
                        <TableCell style={{ borderBottom: "none", width: 100 }}>
                          Quantity{" "}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>12345</TableCell>
                        <TableCell>sxzcfrdssss</TableCell>
                        <TableCell>100</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MapComponent
                isMarkerShown
                googleMapURL={MAP_API_URL}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `200px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ShipmentOverview;
