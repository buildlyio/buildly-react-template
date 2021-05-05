import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Typography,
  Box,
  Grid,
  IconButton,
  Hidden,
} from '@material-ui/core';
import {
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
  Apps as AppsIcon,
} from '@material-ui/icons';
import Loader from '@components/Loader/Loader';
import { MapComponent } from '@components/MapComponent/MapComponent';
import DataTable from '@components/Table/Table';
import CustomizedTooltips from '@components/ToolTip/ToolTip';
import { UserContext } from '@context/User.context';
import { environment } from '@environments/environment';
import { svgIcon } from '@pages/Shipment/ShipmentConstants';
import {
  getShipmentDetails,
  getDashboardItems,
} from '@redux/shipment/actions/shipment.actions';
import {
  getCustodians,
  getCustodianType,
  getContact,
  getCustody,
} from '@redux/custodian/actions/custodian.actions';
import {
  getItems,
  getItemType,
  getUnitsOfMeasure,
} from '@redux/items/actions/items.actions';
import {
  getGateways,
  getGatewayType,
  getSensors,
  getSensorType,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import { numberWithCommas } from '@utils/utilMethods';
import {
  recallColumns,
  delayColumns,
  getFormattedShipmentRow,
  DASHBOARD_MAP_TOOLTIP,
  DASHBOARD_RECALL_TOOLTIP,
  DASHBOARD_DELAY_TOOLTIP,
} from './DashboardConstants';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: 'bold',
  },
  tileView: {
    display: 'flex',
  },
  rowView: {
    display: 'flex',
    flexDirection: 'column',
  },
  switchViewSection: {
    background: '#383636',
    width: '100%',
    display: 'flex',
    minHeight: '40px',
    alignItems: 'center',
  },
  tileHeading: {
    flex: 1,
    padding: theme.spacing(1, 2),
    textTransform: 'uppercase',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
  },
  statisticTitle: {
    textTransform: 'uppercase',
    fontWeight: 400,
  },
  largeIcon: {
    width: 48,
    height: 48,
  },
}));

/**
 * Outputs the profile page for the user.
 */
const Dashboard = (props) => {
  const {
    shipmentData,
    custodianData,
    dispatch,
    itemData,
    gatewayData,
    shipmentFlag,
    unitsOfMeasure,
    custodyData,
    sensorData,
    aggregateReportData,
    loading,
    dashboardItems,
  } = props;
  const [tileView, setTileView] = useState(true);
  const classes = useStyles();
  const [delayedRows, setDelayedRows] = useState([]);
  const [excursionRows, setExcursionRows] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(5);
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (shipmentData === null) {
      const aggregate = !aggregateReportData;
      dispatch(getShipmentDetails(
        organization,
        null,
        aggregate,
      ));
    }
    if (custodianData === null) {
      dispatch(getCustodians(organization));
      dispatch(getCustodianType());
      dispatch(getContact(organization));
    }
    if (itemData === null) {
      dispatch(getItems(organization));
      dispatch(getItemType(organization));
    }
    if (gatewayData === null) {
      dispatch(getGateways(organization));
      dispatch(getGatewayType());
    }
    if (!unitsOfMeasure) {
      dispatch(getUnitsOfMeasure());
    }
    if (!custodyData) {
      dispatch(getCustody());
    }
    if (!sensorData) {
      dispatch(getSensors(organization));
      dispatch(getSensorType());
    }
    if (!dashboardItems) {
      dispatch(getDashboardItems(organization));
    }
  }, []);

  const returnIcon = (row) => {
    let flagType = '';
    let flag = '';
    const shipmentFlags = row.flag_list;
    if (shipmentFlags && shipmentFlags.length) {
      flagType = shipmentFlags[0].type;
      flag = shipmentFlags[0].name;
    }
    return svgIcon(flagType, flag);
  };

  useEffect(() => {
    if (
      shipmentData
      && custodianData
      && custodyData
      && aggregateReportData
      && itemData
      && shipmentFlag
    ) {
      const routesInfo = [];
      const delayedInfo = [];
      const excursionInfo = [];
      const formattedRow = getFormattedShipmentRow(
        shipmentData,
        custodianData,
        itemData,
        shipmentFlag,
        custodyData,
        aggregateReportData,
      );

      formattedRow.forEach((row) => {
        if (
          row.custody_info
          && row.custody_info.length > 0
        ) {
          row.custody_info.forEach((custody) => {
            if (
              custody.has_current_custody
              && row.status.toLowerCase() === 'enroute'
            ) {
              if (custody.start_of_custody_location) {
                routesInfo.push({
                  lat: custody.start_of_custody_location
                  && parseFloat(
                    custody.start_of_custody_location.split(',')[0],
                  ),
                  lng: custody.start_of_custody_location
                  && parseFloat(
                    custody.start_of_custody_location.split(',')[1],
                  ),
                  label: `${row.name}:${row.shipment_uuid}(Start Location)`,
                  icon: returnIcon(row),
                });
              }
              if (custody.end_of_custody_location) {
                routesInfo.push({
                  lat: custody.end_of_custody_location
                  && parseFloat(
                    custody.end_of_custody_location.split(',')[0],
                  ),
                  lng: custody.end_of_custody_location
                  && parseFloat(
                    custody.end_of_custody_location.split(',')[1],
                  ),
                  label: `${row.name}:${row.shipment_uuid}(End Location)`,
                  icon: returnIcon(row),
                });
              }
            }
          });
        }

        if (row.flag_list) {
          row.flag_list.forEach((flag) => {
            if (flag.name.toLowerCase().includes('delay')) {
              delayedInfo.push(row);
            } else {
              let itemExists = false;
              excursionInfo.forEach((item) => {
                itemExists = item.url === row.url;
              });
              if (
                !itemExists
                && row.status.toLowerCase() !== 'planned'
              ) {
                excursionInfo.push(row);
              }
            }
          });
        }
      });
      setMarkers(routesInfo);
      setZoomLevel(12);
      setDelayedRows(delayedInfo);
      setExcursionRows(excursionInfo);
    }
  }, [shipmentData, custodianData, itemData, shipmentFlag, custodyData, aggregateReportData]);

  return (
    <Box mt={3} mb={3}>
      <div className={classes.dashboardContainer}>
        {loading && <Loader open={loading} />}
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center"
        >
          <Grid item>
            <AppsIcon className={classes.largeIcon} />
          </Grid>
          <Grid item>
            <Typography
              className={classes.dashboardHeading}
              variant="h4"
            >
              Producer Dashboard
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3} mb={4}>
          <Grid container className={classes.root} spacing={2}>
            <Grid item md={3} xs={6}>
              <div className={classes.dashboardHeaderItems}>
                <Typography variant="h4">
                  {dashboardItems
                  && dashboardItems.items_in_transit
                    ? numberWithCommas(
                      dashboardItems.items_in_transit,
                    )
                    : '-'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  className={classes.statisticTitle}
                >
                  Items in transit
                </Typography>
              </div>
            </Grid>
            <Grid item md={3} xs={6}>
              <div className={classes.dashboardHeaderItems}>
                <Typography variant="h4">
                  {delayedRows
                  && delayedRows.length > 0
                    ? delayedRows.length
                    : 0}
                </Typography>
                <Typography
                  variant="subtitle2"
                  className={classes.statisticTitle}
                >
                  Delayed Shipment
                </Typography>
              </div>
            </Grid>
            <Grid item md={3} xs={6}>
              <div className={classes.dashboardHeaderItems}>
                <Typography variant="h4">
                  {dashboardItems
                  && dashboardItems.items_at_risk
                    ? dashboardItems.items_at_risk
                    : '-'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  className={classes.statisticTitle}
                >
                  Items at risk
                </Typography>
              </div>
            </Grid>
            <Grid item md={3} xs={6}>
              <div className={classes.dashboardHeaderItems}>
                <Typography variant="h4">
                  {dashboardItems
                  && dashboardItems.items_at_risk_value
                    ? `$${numberWithCommas(
                      dashboardItems.items_at_risk_value,
                    )}`
                    : '-'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  className={classes.statisticTitle}
                >
                  Revenue Risk
                </Typography>
              </div>
            </Grid>
            <Grid item md={3} xs={6}>
              <div className={classes.dashboardHeaderItems}>
                <Typography variant="h4">-</Typography>
                <Typography
                  variant="subtitle2"
                  className={classes.statisticTitle}
                >
                  Perfect order rate
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={tileView ? 6 : 12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className={classes.switchViewSection}>
                  <Typography
                    variant="h5"
                    className={classes.tileHeading}
                  >
                    Delayed Shipments
                    <CustomizedTooltips
                      toolTipText={DASHBOARD_DELAY_TOOLTIP}
                    />
                  </Typography>
                  <Hidden smDown>
                    <IconButton
                      className={classes.menuButton}
                      onClick={() => setTileView(!tileView)}
                      aria-label="menu"
                    >
                      {!tileView
                        ? <ViewCompactIcon />
                        : <ViewComfyIcon />}
                    </IconButton>
                  </Hidden>
                </div>
                <DataTable
                  rows={delayedRows}
                  columns={delayColumns}
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className={classes.switchViewSection}>
                  <Typography
                    variant="h5"
                    className={classes.tileHeading}
                  >
                    Recalls and Violations
                    <CustomizedTooltips
                      toolTipText={DASHBOARD_RECALL_TOOLTIP}
                    />
                  </Typography>
                  <Hidden smDown>
                    <IconButton
                      className={classes.menuButton}
                      onClick={() => setTileView(!tileView)}
                      aria-label="menu"
                    >
                      {!tileView
                        ? <ViewCompactIcon />
                        : <ViewComfyIcon />}
                    </IconButton>
                  </Hidden>
                </div>
                <DataTable
                  rows={excursionRows}
                  columns={recallColumns}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={tileView ? 6 : 12}>
            <div className={classes.switchViewSection}>
              <Typography
                className={classes.tileHeading}
                variant="h5"
              >
                Current Shipments
                <CustomizedTooltips
                  toolTipText={DASHBOARD_MAP_TOOLTIP}
                />
              </Typography>
              <Hidden smDown>
                <IconButton
                  className={classes.menuButton}
                  onClick={() => setTileView(!tileView)}
                  aria-label="menu"
                >
                  {!tileView
                    ? <ViewCompactIcon />
                    : <ViewComfyIcon />}
                </IconButton>
              </Hidden>
            </div>
            <MapComponent
              isMarkerShown
              markers={markers}
              zoom={zoomLevel}
              googleMapURL={environment.MAP_API_URL}
              loadingElement={
                <div style={{ height: '100%' }} />
              }
              containerElement={
                <div style={{ height: '620px' }} />
              }
              mapElement={
                <div style={{ height: '100%' }} />
              }
            />
          </Grid>
        </Grid>
      </div>
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
  ...state.shipmentReducer,
  ...state.custodianReducer,
  ...state.itemsReducer,
  ...state.sensorsGatewayReducer,
});
export default connect(mapStateToProps)(Dashboard);
