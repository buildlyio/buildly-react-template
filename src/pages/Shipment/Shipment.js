/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Box,
  Button,
  Chip,
  Fade,
  FormControl,
  FormLabel,
  Grid,
  Stack,
  TableCell,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Assignment as NoteIcon } from '@mui/icons-material';
import CustomizedSteppers from '@components/CustomizedStepper/CustomizedStepper';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import Loader from '@components/Loader/Loader';
import MapComponent from '@components/MapComponent/MapComponent';
import { getUser } from '@context/User.context';
import { routes } from '@routes/routesConstants';
import { getIcon, getShipmentFormattedRow, shipmentColumns } from '@utils/constants';
import { useQuery } from 'react-query';
import { getShipmentsQuery } from '@react-query/queries/shipments/getShipmentsQuery';
import { getCustodianQuery } from '@react-query/queries/custodians/getCustodianQuery';
import { getItemQuery } from '@react-query/queries/items/getItemQuery';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { getAllGatewayQuery } from '@react-query/queries/sensorGateways/getAllGatewayQuery';
import { getCustodyQuery } from '@react-query/queries/custodians/getCustodyQuery';
import { getSensorReportQuery } from '@react-query/queries/sensorGateways/getSensorReportQuery';
import { getSensorAlertQuery } from '@react-query/queries/sensorGateways/getSensorAlertQuery';
import useAlert from '@hooks/useAlert';
import { useStore } from '@zustand/timezone/timezoneStore';
import './ShipmentStyles.css';
import { TIVE_GATEWAY_TIMES } from '@utils/mock';
import { calculateLatLngBounds } from '@utils/utilMethods';

const Shipment = ({ history }) => {
  const muiTheme = useTheme();
  const user = getUser();
  const organization = user.organization.organization_uuid;
  const userLanguage = user.user_language;

  const { displayAlert } = useAlert();
  const { data } = useStore();

  let isShipmentDataAvailable = false;

  const [shipmentFilter, setShipmentFilter] = useState('Active');
  const [rows, setRows] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});
  const [allMarkers, setAllMarkers] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState({});
  const [zoom, setZoom] = useState(4);

  const { data: shipmentData, isLoading: isLoadingShipments, isFetching: isFetchingShipments } = useQuery(
    ['shipments', shipmentFilter, organization],
    () => getShipmentsQuery(organization, shipmentFilter === 'Active' ? 'Planned,En route,Arrived' : shipmentFilter, displayAlert),
    { refetchOnWindowFocus: false },
  );

  isShipmentDataAvailable = !_.isEmpty(shipmentData) && !isLoadingShipments && !isFetchingShipments;

  const { data: custodianData, isLoading: isLoadingCustodians } = useQuery(
    ['custodians', organization],
    () => getCustodianQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: itemData, isLoading: isLoadingItems } = useQuery(
    ['items', organization],
    () => getItemQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: allGatewayData, isLoading: isLoadingAllGateways, isFetching: isFetchingAllGateways } = useQuery(
    ['allGateways'],
    () => getAllGatewayQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: custodyData, isLoading: isLoadingCustodies } = useQuery(
    ['custodies', shipmentData, shipmentFilter],
    () => getCustodyQuery(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'shipment_uuid'), null))), displayAlert),
    {
      enabled: isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'shipment_uuid'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  const { data: sensorAlertData, isLoading: isLoadingSensorAlerts, isFetching: isFetchingSensorAlerts } = useQuery(
    ['sensorAlerts', shipmentData, shipmentFilter],
    () => getSensorAlertQuery(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null))), displayAlert),
    {
      enabled: isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  const { data: reportData1, isLoading: isLoadingReports1, isFetching: isFetchingReports1 } = useQuery(
    ['sensorReports', shipmentData, shipmentFilter],
    () => getSensorReportQuery(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null))), 10, displayAlert),
    {
      enabled: _.isEmpty(selectedShipment) && _.isEmpty(expandedRows) && isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  const {
    data: reportData2,
    isLoading: isLoadingReports2,
    isFetching: isFetchingReports2,
    refetch: refetchReports2,
  } = useQuery(
    ['sensorReports', shipmentData, shipmentFilter],
    () => getSensorReportQuery(encodeURIComponent(selectedShipment.partner_shipment_id), null, displayAlert),
    {
      enabled: !_.isEmpty(selectedShipment) && !_.isEmpty(expandedRows) && isShipmentDataAvailable && !_.isEmpty(encodeURIComponent(_.toString(_.without(_.map(shipmentData, 'partner_shipment_id'), null)))),
      refetchOnWindowFocus: false,
    },
  );

  const sensorReportData = selectedShipment ? reportData2 : reportData1;
  const isLoadingSensorReports = selectedShipment ? isLoadingReports2 : isLoadingReports1;
  const isFetchingSensorReports = selectedShipment ? isFetchingReports2 : isFetchingReports1;

  const isLoaded = isLoadingShipments
    || isLoadingCustodians
    || isLoadingItems
    || isLoadingUnits
    || isLoadingAllGateways
    || isLoadingCustodies
    || isLoadingSensorAlerts
    || isLoadingSensorReports
    || isLoading
    || isFetchingShipments
    || isFetchingAllGateways
    || isFetchingSensorAlerts
    || isFetchingSensorReports;

  useEffect(() => {
    const formattedRows = getShipmentFormattedRow(
      shipmentData,
      custodianData,
      custodyData,
      itemData,
      allGatewayData,
      sensorAlertData,
      muiTheme.palette.error.main,
      muiTheme.palette.info.main,
      sensorReportData,
    );
    const filteredRows = _.filter(formattedRows, { type: shipmentFilter });
    if (_.isEmpty(selectedCluster)) {
      setRows(filteredRows);
    }
    setAllMarkers(_.map(filteredRows, 'allMarkers'));
  }, [shipmentFilter, shipmentData, custodianData, custodyData,
    itemData, allGatewayData, sensorAlertData, sensorReportData]);

  useEffect(() => {
    if (!_.isEmpty(shipmentData) && !_.isEqual(isLoaded, true)) {
      const localDelayedShipments = JSON.parse(localStorage.getItem('delayedShipments')) || [];
      const delayedShipments = _.filter(shipmentData, (item) => item.delayed === true && item.status === 'Planned');
      const newDelayedShipments = _.filter(delayedShipments, (item) => !localDelayedShipments.includes(item.name));
      if (!_.isEmpty(newDelayedShipments)) {
        newDelayedShipments.forEach((item) => {
          displayAlert('error', `Shipment: ${item.name} has not yet departed.`);
        });
      }
      const updatedDelayedShipments = [...localDelayedShipments, ...newDelayedShipments.map((item) => item.name)];
      localStorage.setItem('delayedShipments', JSON.stringify(updatedDelayedShipments));
    }
  }, [shipmentData, isLoaded]);

  useEffect(() => {
    if (!_.isEmpty(markers) || !_.isEmpty(selectedCluster)) {
      setZoom(12);
    } else {
      setZoom(4);
    }
  }, [markers, selectedCluster]);

  useEffect(() => {
    if (selectedShipment) {
      processMarkers(selectedShipment, true);
    }
  }, [sensorAlertData, sensorReportData, data]);

  useEffect(() => {
    if (!_.isEmpty(selectedShipment)) {
      setLoading(true);
      refetchReports2();
    }
    if (expandedRows) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [selectedShipment, expandedRows]);

  useEffect(() => {
    if (!_.isEmpty(selectedCluster) && !_.isEmpty(rows)) {
      const { lat, lng } = selectedCluster;
      const { radius } = user.organization;
      const values = calculateLatLngBounds(lat, lng, radius);
      const filteredRows = rows.filter((obj) => !_.isEmpty(obj.allMarkers));
      const clusterFilteredRows = filteredRows.filter((obj) => {
        const firstMarker = _.first(obj.allMarkers);
        const isLatInRange = firstMarker.lat >= values.minLat && firstMarker.lat <= values.maxLat;
        const isLngInRange = firstMarker.lng >= values.minLng && firstMarker.lng <= values.maxLng;
        return isLatInRange && isLngInRange;
      });
      setRows(clusterFilteredRows);
    }
  }, [selectedCluster]);

  const processMarkers = (shipment, setExpanded = false) => {
    const dateFormat = !_.isEmpty(unitData) && _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure;
    const timeFormat = !_.isEmpty(unitData) && _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure;
    const tempMeasure = !_.isEmpty(unitData) && _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature')).unit_of_measure;
    let markersToSet = [];
    const filteredReports = _.filter(sensorReportData, {
      shipment_id: shipment.partner_shipment_id,
    });
    const filteredAlerts = _.filter(sensorAlertData, { shipment_id: shipment.partner_shipment_id });
    let newSteps = [];
    let arrivedSteps = [];
    let activeSteps = [];

    newSteps = [
      {
        id: 1,
        title: shipment.origin,
        titleColor: 'inherit',
        label: 'Shipment created',
        content: moment(shipment.create_date).tz(data).format(`${dateFormat} ${timeFormat}`),
        active: true,
        error: false,
        info: false,
        completed: shipment.last_fujitsu_verification_datetime && _.lte(
          moment(shipment.create_date).unix(),
          moment(shipment.last_fujitsu_verification_datetime).unix(),
        ),
      },
      {
        id: 2,
        title: shipment.origin,
        titleColor: 'inherit',
        label: 'Shipment started',
        content: _.isEmpty(shipment.actual_time_of_departure)
          ? moment(shipment.estimated_time_of_departure).tz(data).format(`${dateFormat} ${timeFormat}`)
          : moment(shipment.actual_time_of_departure).tz(data).format(`${dateFormat} ${timeFormat}`),
        caption: _.isEmpty(shipment.actual_time_of_departure) ? '(Estimated Time)' : '(Actual Time)',
        active: !!shipment.actual_time_of_departure,
        error: false,
        info: false,
        completed: shipment.last_fujitsu_verification_datetime && _.lte(
          moment(shipment.actual_time_of_departure || shipment.estimated_time_of_departure).unix(),
          moment(shipment.last_fujitsu_verification_datetime).unix(),
        ),
      },
    ];

    if (!_.isEmpty(filteredAlerts)) {
      const alerts = _.filter(filteredAlerts, (alert) => !alert.recovered_alert_id);
      const arrivedAlerts = _.filter(alerts, (alert) => {
        const createDate = moment(alert.create_date).unix();
        return (
          createDate >= (moment(shipment.actual_time_of_departure).unix() || moment(shipment.estimated_time_of_departure).unix())
          && createDate <= (moment(shipment.actual_time_of_arrival).unix() || moment(shipment.estimated_time_of_arrival).unix())
        );
      });
      const activeAlerts = _.filter(alerts, (alert) => {
        const createDate = moment(alert.create_date).unix();
        return !(
          createDate >= (moment(shipment.actual_time_of_departure).unix() || moment(shipment.estimated_time_of_departure).unix())
          && createDate <= (moment(shipment.actual_time_of_arrival).unix() || moment(shipment.estimated_time_of_arrival).unix())
        );
      });
      if (_.isEmpty(shipment.actual_time_of_arrival)) {
        arrivedSteps = _.map(alerts, (a) => {
          const error = _.includes(_.toLower(a.alert_type), 'max') || _.includes(_.toLower(a.alert_type), 'shock') || _.includes(_.toLower(a.alert_type), 'light');
          const info = _.includes(_.toLower(a.alert_type), 'min');
          const item = {
            id: a.parameter_type,
            color: error ? muiTheme.palette.error.main : muiTheme.palette.info.main,
            title: error ? `Maximum ${_.capitalize(a.parameter_type)} Excursion` : `Minimum ${_.capitalize(a.parameter_type)} Excursion`,
          };
          return ({
            id: moment(a.create_date).unix(),
            titleIcon: getIcon(item),
            title: a.parameter_type === 'shock' || a.parameter_type === 'light'
              ? `${_.toString(_.round(_.toNumber(a.parameter_value.split(' ')[0]), 2))} ${a.parameter_value.split(' ')[1]}`
              : a.parameter_value,
            titleColor: error ? muiTheme.palette.error.main : muiTheme.palette.info.main,
            label: 'Exception',
            content: moment(a.create_date).tz(data).format(`${dateFormat} ${timeFormat}`),
            active: false,
            completed: shipment.last_fujitsu_verification_datetime && _.lte(
              moment(a.create_date).unix(),
              moment(shipment.last_fujitsu_verification_datetime).unix(),
            ),
            error,
            info,
          });
        });
      } else {
        arrivedSteps = _.map(arrivedAlerts, (a) => {
          const error = _.includes(_.toLower(a.alert_type), 'max') || _.includes(_.toLower(a.alert_type), 'shock') || _.includes(_.toLower(a.alert_type), 'light');
          const info = _.includes(_.toLower(a.alert_type), 'min');
          const item = {
            id: a.parameter_type,
            color: error ? muiTheme.palette.error.main : muiTheme.palette.info.main,
            title: error ? `Maximum ${_.capitalize(a.parameter_type)} Excursion` : `Minimum ${_.capitalize(a.parameter_type)} Excursion`,
          };
          return ({
            id: moment(a.create_date).unix(),
            titleIcon: getIcon(item),
            title: a.parameter_type === 'shock' || a.parameter_type === 'light'
              ? `${_.toString(_.round(_.toNumber(a.parameter_value.split(' ')[0]), 2))} ${a.parameter_value.split(' ')[1]}`
              : a.parameter_value,
            titleColor: error ? muiTheme.palette.error.main : muiTheme.palette.info.main,
            label: 'Exception',
            content: moment(a.create_date).tz(data).format(`${dateFormat} ${timeFormat}`),
            active: false,
            completed: shipment.last_fujitsu_verification_datetime && _.lte(
              moment(a.create_date).unix(),
              moment(shipment.last_fujitsu_verification_datetime).unix(),
            ),
            error,
            info,
          });
        });
        activeSteps = _.map(activeAlerts, (a) => {
          const error = _.includes(_.toLower(a.alert_type), 'max') || _.includes(_.toLower(a.alert_type), 'shock') || _.includes(_.toLower(a.alert_type), 'light');
          const info = _.includes(_.toLower(a.alert_type), 'min');
          const item = {
            id: a.parameter_type,
            color: error ? muiTheme.palette.error.main : muiTheme.palette.info.main,
            title: error ? `Maximum ${_.capitalize(a.parameter_type)} Excursion` : `Minimum ${_.capitalize(a.parameter_type)} Excursion`,
          };
          return ({
            id: moment(a.create_date).unix(),
            titleIcon: getIcon(item),
            title: a.parameter_type === 'shock' || a.parameter_type === 'light'
              ? `${_.toString(_.round(_.toNumber(a.parameter_value.split(' ')[0]), 2))} ${a.parameter_value.split(' ')[1]}`
              : a.parameter_value,
            titleColor: error ? muiTheme.palette.error.main : muiTheme.palette.info.main,
            label: 'Exception',
            content: moment(a.create_date).tz(data).format(`${dateFormat} ${timeFormat}`),
            active: false,
            completed: shipment.last_fujitsu_verification_datetime && _.lte(
              moment(a.create_date).unix(),
              moment(shipment.last_fujitsu_verification_datetime).unix(),
            ),
            error,
            info,
          });
        });
      }
    }
    newSteps = [...newSteps, ...arrivedSteps];

    newSteps = [...newSteps, {
      id: _.maxBy(newSteps, 'id') ? (_.maxBy(newSteps, 'id').id + 1) : 3,
      title: shipment.destination,
      titleColor: 'inherit',
      label: 'Shipment arrived',
      content: _.isEmpty(shipment.actual_time_of_arrival)
        ? moment(shipment.estimated_time_of_arrival).tz(data).format(`${dateFormat} ${timeFormat}`)
        : moment(shipment.actual_time_of_arrival).tz(data).format(`${dateFormat} ${timeFormat}`),
      caption: _.isEmpty(shipment.actual_time_of_arrival) ? '(Estimated Time)' : '(Actual Time)',
      active: !!shipment.actual_time_of_arrival,
      error: false,
      info: false,
      completed: shipment.last_fujitsu_verification_datetime && _.lte(
        moment(shipment.actual_time_of_arrival || shipment.estimated_time_of_arrival).unix(),
        moment(shipment.last_fujitsu_verification_datetime).unix(),
      ),
    }];

    newSteps = [...newSteps, ...activeSteps];

    newSteps = [...newSteps, {
      id: _.maxBy(newSteps, 'id') ? (_.maxBy(newSteps, 'id').id + 2) : 4,
      title: shipment.destination,
      titleColor: 'inherit',
      label: 'Shipment completed',
      content: _.isEqual(shipment.status, 'Completed')
        ? moment(shipment.actual_time_of_completion || shipment.edit_date).tz(data).format(`${dateFormat} ${timeFormat}`)
        : moment(shipment.actual_time_of_arrival || shipment.estimated_time_of_arrival).add(24, 'h').tz(data).format(`${dateFormat} ${timeFormat}`),
      caption: !_.isEqual(shipment.status, 'Completed') ? '(Estimated Time)' : '(Actual Time)',
      active: _.isEqual(shipment.status, 'Completed'),
      error: false,
      info: false,
      completed: shipment.last_fujitsu_verification_datetime && _.lte(
        _.isEqual(shipment.status, 'Completed')
          ? moment(shipment.actual_time_of_completion || shipment.edit_date).unix()
          : moment(shipment.actual_time_of_arrival || shipment.estimated_time_of_arrival).add(24, 'h').unix(),
        moment(shipment.last_fujitsu_verification_datetime).unix(),
      ),
    }];

    if (!_.isEmpty(filteredReports)) {
      _.forEach(filteredReports, (report) => {
        const { report_entry } = report;
        let marker = {};
        let color = muiTheme.palette.success.main;
        let allAlerts = [];
        const date = moment(report.activation_date).tz(data).format(dateFormat);
        const time = moment(report.activation_date).tz(data).format(timeFormat);

        const preAlerts = _.orderBy(
          _.filter(filteredAlerts, (alert) => _.lte(_.toNumber(alert.report_id), report.id)),
          'create_date',
        );
        const recoveryAlerts = _.filter(preAlerts, (pa) => !!pa.recovered_alert_id);
        const recoveredIDs = _.uniq(_.map(recoveryAlerts, 'recovered_alert_id'));
        const recoveredTypeDateTime = _.map(recoveryAlerts, (ra) => (
          { parameter_type: ra.parameter_type, create_date: ra.create_date }
        ));
        const alertsTillNow = _.filter(preAlerts, (alert) => {
          const found = _.find(recoveredTypeDateTime, (radt) => (
            _.isEqual(radt.parameter_type, alert.parameter_type)
            && !!_.gt(radt.create_date, alert.create_date)
          ));

          return !found && !alert.recovered_alert_id
            && !_.includes(recoveredIDs, _.toString(alert.id));
        });

        let uniqueAlerts = [];
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'temperature' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'temperature' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'humidity' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'humidity' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'shock' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'shock' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'light' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'light' })];
        }
        uniqueAlerts = _.orderBy(uniqueAlerts, 'create_date');

        const exactAlertID = _.filter(preAlerts, { report_id: _.toString(report.id) });
        _.forEach(exactAlertID, (alert) => {
          if (alert.recovered_alert_id) {
            _.remove(uniqueAlerts, { parameter_type: alert.parameter_type });
            allAlerts = [...allAlerts, { id: alert.parameter_type, color, title: `${_.capitalize(alert.parameter_type)} Excursion Recovered` }];
          }
        });

        _.forEach(uniqueAlerts, (alert) => {
          if (alert) {
            let alertColor = '';
            let title = '';
            const found = _.find(allAlerts, { id: alert.parameter_type });
            if (found) {
              _.remove(allAlerts, { id: alert.parameter_type });
            }

            switch (true) {
              case _.includes(_.toLower(alert.alert_type), 'max'):
              case _.includes(_.toLower(alert.alert_type), 'shock'):
              case _.includes(_.toLower(alert.alert_type), 'light'):
                color = muiTheme.palette.error.main;
                alertColor = muiTheme.palette.error.main;
                title = `Maximum ${_.capitalize(alert.parameter_type)} Excursion`;
                break;

              case _.includes(_.toLower(alert.alert_type), 'min'):
                if (color !== muiTheme.palette.error.main) {
                  color = muiTheme.palette.info.main;
                }
                alertColor = muiTheme.palette.info.main;
                title = `Minimum ${_.capitalize(alert.parameter_type)} Excursion`;
                break;

              default:
                break;
            }

            allAlerts = [...allAlerts, { id: alert.parameter_type, color: alertColor, title }];
          }
        });

        const temperature = _.isEqual(_.toLower(tempMeasure), 'fahrenheit')
          ? report_entry.report_temp_fah
          : report_entry.report_temp_cel
            ? _.round(report_entry.report_temp_cel, 2)
            : report_entry.report_temp_cel;
        const probe = _.isEqual(_.toLower(tempMeasure), 'fahrenheit')
          ? report_entry.report_probe_fah
          : report_entry.report_probe_cel
            ? _.round(report_entry.report_probe_cel, 2)
            : report_entry.report_probe_cel;
        const shock = report_entry.report_shock && _.round(report_entry.report_shock, 2);
        const light = report_entry.report_light && _.round(report_entry.report_light, 2);

        // For a valid (latitude, longitude) pair: -90<=X<=+90 and -180<=Y<=180
        if (report_entry.report_location !== null
          && report_entry.report_latitude !== null
          && report_entry.report_longitude !== null) {
          const latitude = report_entry.report_latitude
            || report_entry.report_location.latitude;
          const longitude = report_entry.report_longitude
            || report_entry.report_location.longitude;
          if (
            (latitude >= -90 && latitude <= 90)
            && (longitude >= -180 && longitude <= 180)
            && date && time
          ) {
            marker = {
              lat: latitude,
              lng: longitude,
              location: report_entry.report_location,
              label: 'Clustered',
              temperature,
              light,
              shock,
              tilt: report_entry.report_tilt,
              humidity: report_entry.report_humidity,
              battery: report_entry.report_battery,
              pressure: report_entry.report_pressure,
              probe,
              color,
              allAlerts,
              date,
              time,
            };

            markersToSet = [...markersToSet, marker];
          }
        } else {
          marker = {
            lat: '*',
            lng: '*',
            location: 'N/A',
            label: 'Clustered',
            temperature,
            light,
            shock,
            tilt: report_entry.report_tilt,
            humidity: report_entry.report_humidity,
            battery: report_entry.report_battery,
            pressure: report_entry.report_pressure,
            probe,
            color,
            allAlerts,
            date,
            time,
          };
        }
      });
    }

    if (setExpanded) {
      const rowIndex = _.findIndex(rows, (item) => item.id === shipment.id, 0);
      setExpandedRows([rowIndex]);
      setSteps(_.orderBy(newSteps, 'id'));
    }

    setSelectedShipment(shipment);
    setMarkers(_.orderBy(markersToSet, [(obj) => moment(`${obj.date} ${obj.time}`)], ['desc']));
    setSelectedMarker(markers[0]);
  };

  const filterTabClicked = async (event, filter) => {
    isShipmentDataAvailable = false;
    setShipmentFilter(filter);
    setSelectedShipment(null);
    setMarkers([]);
    setSelectedMarker({});
    setExpandedRows([]);
    setSteps([]);
    setSelectedCluster({});
  };

  const renderSensorData = (marker) => {
    const isValidData = (
      marker.temperature !== null && marker.temperature !== undefined
      && marker.humidity !== null && marker.humidity !== undefined
      && marker.shock !== null && marker.shock !== undefined
      && marker.light !== null && marker.light !== undefined
      && marker.battery !== null && marker.battery !== undefined
    );
    const maxTemp = selectedShipment && _.orderBy(selectedShipment.max_excursion_temp, 'set_at', 'desc')[0];
    const minTemp = selectedShipment && _.orderBy(selectedShipment.min_excursion_temp, 'set_at', 'desc')[0];
    const maxHum = selectedShipment && _.orderBy(selectedShipment.max_excursion_humidity, 'set_at', 'desc')[0];
    const minHum = selectedShipment && _.orderBy(selectedShipment.min_excursion_humidity, 'set_at', 'desc')[0];
    const maxShock = selectedShipment && _.orderBy(selectedShipment.shock_threshold, 'set_at', 'desc')[0];
    const maxLight = selectedShipment && _.orderBy(selectedShipment.light_threshold, 'set_at', 'desc')[0];

    return isValidData && (
      <>
        <Grid container flex>
          <Typography>Temp (</Typography>
          <Typography className="shipmentMaxColor">{maxTemp.value}</Typography>
          <Typography>/</Typography>
          <Typography className="shipmentMinColor">{minTemp.value}</Typography>
          <Typography>{`): ${marker.temperature}`}</Typography>
        </Grid>
        <Grid container flex>
          <Typography>Humidity (</Typography>
          <Typography className="shipmentMaxColor">{maxHum.value}</Typography>
          <Typography>/</Typography>
          <Typography className="shipmentMinColor">{minHum.value}</Typography>
          <Typography>{`): ${marker.humidity}`}</Typography>
        </Grid>
        <Grid container flex>
          <Typography>Shock (</Typography>
          <Typography className="shipmentMaxColor">{maxShock.value}</Typography>
          <Typography>{`): ${marker.shock}`}</Typography>
        </Grid>
        <Grid container flex>
          <Typography>Light (</Typography>
          <Typography className="shipmentMaxColor">{maxLight.value}</Typography>
          <Typography>{`): ${marker.light}`}</Typography>
        </Grid>
        <Typography>{`Battery: ${marker.battery}`}</Typography>
      </>
    );
  };

  const renderIrregularTransmission = (marker) => {
    const hasInvalidData = (
      marker.temperature === null || marker.temperature === undefined
      || marker.humidity === null || marker.humidity === undefined
      || marker.shock === null || marker.shock === undefined
      || marker.light === null || marker.light === undefined
      || marker.battery === null || marker.battery === undefined
    );
    const maxTemp = selectedShipment && _.orderBy(selectedShipment.max_excursion_temp, 'set_at', 'desc')[0];
    const minTemp = selectedShipment && _.orderBy(selectedShipment.min_excursion_temp, 'set_at', 'desc')[0];
    const maxHum = selectedShipment && _.orderBy(selectedShipment.max_excursion_humidity, 'set_at', 'desc')[0];
    const minHum = selectedShipment && _.orderBy(selectedShipment.min_excursion_humidity, 'set_at', 'desc')[0];
    const maxShock = selectedShipment && _.orderBy(selectedShipment.shock_threshold, 'set_at', 'desc')[0];
    const maxLight = selectedShipment && _.orderBy(selectedShipment.light_threshold, 'set_at', 'desc')[0];

    return hasInvalidData && (
      <Grid item xs={12}>
        <Typography fontWeight={700} fontStyle="italic">
          Irregular Transmission:
        </Typography>
        {renderSensorValue('Temp ', marker.temperature, maxTemp.value, minTemp.value)}
        {renderSensorValue('Humidity ', marker.humidity, maxHum.value, minHum.value)}
        {renderSensorValue('Shock ', marker.shock, maxShock.value)}
        {renderSensorValue('Light ', marker.light, maxLight.value)}
        {renderSensorValue('Battery', marker.battery)}
      </Grid>
    );
  };

  const renderSensorValue = (label, value, max = null, min = null) => (
    !_.isEqual(value, null) && !_.isEqual(value, undefined) && (
      <Grid container flex>
        <Typography>{label}</Typography>
        {(max || min) && (
          <Typography>(</Typography>
        )}
        {max && (
          <Typography className="shipmentMaxColor">{max}</Typography>
        )}
        {max && min && (
          <Typography>/</Typography>
        )}
        {min && (
          <Typography className="shipmentMinColor">{min}</Typography>
        )}
        {(max || min) && (
          <Typography>)</Typography>
        )}
        <Typography>{`: ${value}`}</Typography>
      </Grid>
    )
  );

  return (
    <Box mt={5} mb={5}>
      {isLoaded && <Loader open={isLoaded} />}
      <Button type="button" onClick={(e) => history.push(routes.CREATE_SHIPMENT)} className="shipmentCreateButton">
        + Create Shipment
      </Button>
      {!_.isEmpty(selectedCluster) && (
        <Button
          type="button"
          className="shipmentGoBackButton"
          onClick={() => {
            const formattedRows = getShipmentFormattedRow(
              shipmentData,
              custodianData,
              custodyData,
              itemData,
              allGatewayData,
              sensorAlertData,
              muiTheme.palette.error.main,
              muiTheme.palette.info.main,
              sensorReportData,
            );
            const filteredRows = _.filter(formattedRows, { type: shipmentFilter });
            setSelectedCluster({});
            setRows(filteredRows);
            setExpandedRows([]);
            setSelectedShipment(null);
            setSelectedMarker({});
            setAllMarkers(_.map(filteredRows, 'allMarkers'));
            setMarkers([]);
            setSteps([]);
          }}
        >
          Go back to Global View
        </Button>
      )}
      <Grid container>
        <Grid item xs={12}>
          <div className={selectedShipment ? 'shipmentTitle notranslate' : 'shipmentTitle'}>
            <Typography variant="h6">
              {selectedShipment ? selectedShipment.name : 'All shipments'}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <MapComponent
            allMarkers={allMarkers}
            isMarkerShown={!_.isEmpty(markers)}
            showPath
            markers={markers}
            zoom={zoom}
            setSelectedMarker={setSelectedMarker}
            containerStyle={{ height: '600px' }}
            unitOfMeasure={unitData}
            setSelectedCluster={setSelectedCluster}
            selectedCluster={selectedCluster}
          />
        </Grid>
        <Grid item xs={12} className="shipmentDataTableHeader">
          <ToggleButtonGroup
            color="secondary"
            value={shipmentFilter}
          >
            <ToggleButton
              value="Active"
              size="medium"
              selected={shipmentFilter === 'Active'}
              className="shipmentDataTableHeaderItem"
              onClick={(event, value) => filterTabClicked(event, value)}
            >
              Active
            </ToggleButton>
            <ToggleButton
              value="Completed"
              size="medium"
              selected={shipmentFilter === 'Completed'}
              className="shipmentDataTableHeaderItem"
              onClick={(event, value) => filterTabClicked(event, value)}
            >
              Completed
            </ToggleButton>
            <ToggleButton
              value="Battery Depleted"
              size="medium"
              selected={shipmentFilter === 'Battery Depleted'}
              className="shipmentDataTableHeaderItem"
              onClick={(event, value) => filterTabClicked(event, value)}
            >
              Battery Depleted
            </ToggleButton>
            <ToggleButton
              value="Damaged"
              size="medium"
              selected={shipmentFilter === 'Damaged'}
              className="shipmentDataTableHeaderItem"
              onClick={(event, value) => filterTabClicked(event, value)}
            >
              Damaged
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12} className="shipmentDataTable">
          <DataTableWrapper
            hideAddButton
            loading={isLoading}
            filename="ShipmentData"
            rows={rows}
            columns={[
              {
                name: '',
                options: {
                  sort: false,
                  sortThirdClickReset: false,
                  filter: false,
                  customBodyRenderLite: (dataIndex) => (
                    rows[dataIndex] && rows[dataIndex].note
                      ? (
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          placement="bottom-start"
                          title={<Typography>{rows[dataIndex].note}</Typography>}
                          className="shipmentTooltip"
                        >
                          <NoteIcon />
                        </Tooltip>
                      ) : <></>
                  ),
                },
              },
              {
                name: 'name',
                label: 'Shipment Name',
                options: {
                  sort: true,
                  sortThirdClickReset: true,
                  filter: true,
                  customBodyRenderLite: (dataIndex) => (
                    <Typography
                      className="shipmentName notranslate"
                      onClick={(e) => {
                        history.push(routes.CREATE_SHIPMENT, {
                          ship: _.omit(rows[dataIndex], ['type', 'itemNames', 'tracker', 'battery_levels', 'alerts', 'allMarkers']),
                        });
                      }}
                    >
                      {rows[dataIndex].name}
                    </Typography>
                  ),
                },
              },
              ...shipmentColumns(
                data,
                _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                  ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                  : '',
                userLanguage,
                muiTheme,
              ),
              {
                name: 'battery_levels',
                label: 'Battery (%) with Intervals',
                options: {
                  sort: true,
                  sortThirdClickReset: true,
                  filter: true,
                  setCellProps: () => ({
                    style: {
                      width: '300px',
                      maxWidth: '300px',
                    },
                  }),
                  customBodyRenderLite: (dataIndex) => {
                    const ship = rows[dataIndex];
                    const tTime = _.find(TIVE_GATEWAY_TIMES, { value: ship.transmission_time });
                    const mTime = _.find(TIVE_GATEWAY_TIMES, { value: ship.measurement_time });

                    return (
                      <Grid container>
                        <Grid item className="shipmentGridTimeCenter">
                          <Typography variant="body1">
                            {ship.battery_levels}
                          </Typography>
                        </Grid>
                        <Grid item flex={1}>
                          <Typography variant="body1">
                            {`T: ${tTime ? tTime.short_label : 'N/A'}`}
                          </Typography>
                          <Typography variant="body1">
                            {`M: ${mTime ? mTime.short_label : 'N/A'}`}
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  },
                },
              },
            ]}
            extraOptions={{
              expandableRows: true,
              expandableRowsHeader: false,
              expandableRowsOnClick: true,
              download: false,
              filter: false,
              print: false,
              search: false,
              viewColumns: false,
              setRowProps: (row, dataIndex, rowIndex) => ({
                style: { color: _.isEqual(row[2], 'Planned') ? muiTheme.palette.background.light : 'inherit' },
              }),
              rowsExpanded: expandedRows,
              onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) => {
                if (_.isEmpty(allExpanded)) {
                  setAllMarkers(_.map(rows, 'allMarkers'));
                  setSelectedShipment(null);
                  setMarkers([]);
                  setSelectedMarker({});
                  setExpandedRows([]);
                  setSteps([]);
                } else {
                  processMarkers(rows[_.last(allExpanded).dataIndex], true);
                }
              },
              renderExpandableRow: (rowData, rowMeta) => {
                const colSpan = rowData.length + 1;
                const ship = rows[rowMeta.dataIndex];

                return (
                  <>
                    <TableRow>
                      <TableCell colSpan={colSpan}>
                        <CustomizedSteppers steps={steps} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={colSpan}>
                        <Grid container spacing={2}>
                          <Grid item xs={2}>
                            <Grid container rowGap={1}>
                              <Grid item xs={12}>
                                <Typography fontWeight={700}>
                                  Order ID:
                                </Typography>
                                <Typography className="notranslate">
                                  {ship.order_number}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography fontWeight={700}>
                                  Items:
                                </Typography>
                                {_.map(_.split(ship.itemNames, ','), (item, idx) => (
                                  <Typography className="notranslate" key={`${item}-${idx}`}>{item}</Typography>
                                ))}
                              </Grid>
                              <Grid item xs={12}>
                                <Typography fontWeight={700}>
                                  Status:
                                </Typography>
                                <Typography className="notranslate">
                                  {ship.type}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={2}>
                            <Grid container rowGap={1}>
                              {_.map(ship.carriers, (carr, idx) => (
                                <Grid key={`${carr}-${idx}`} item xs={12}>
                                  <Typography fontWeight={700}>
                                    {`Logistics company ${idx + 1}:`}
                                  </Typography>
                                  <Typography className="notranslate">
                                    {carr}
                                  </Typography>
                                </Grid>
                              ))}
                              <Grid item xs={12}>
                                <Typography fontWeight={700}>
                                  Receiver:
                                </Typography>
                                <Typography className="notranslate">
                                  {ship.destination}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={2}>
                            {!_.isEmpty(markers) && markers[0] && (
                              <Grid container rowGap={1}>
                                <Grid item xs={12}>
                                  <Typography fontWeight={700}>
                                    Last location:
                                  </Typography>
                                  <Typography>
                                    {markers[0].location}
                                  </Typography>
                                </Grid>
                              </Grid>
                            )}
                          </Grid>
                          <Grid item xs={2}>
                            {!_.isEmpty(markers) && markers[0] && (
                              <Grid container rowGap={1}>
                                <Grid item xs={12}>
                                  <Typography fontWeight={700}>
                                    Last Reading:
                                  </Typography>
                                  <Typography component="span" className="translate">
                                    Recorded at:
                                    <span className="notranslate">{` ${markers[0].date} ${markers[0].time}`}</span>
                                  </Typography>
                                  {renderSensorData(markers[0])}
                                </Grid>
                                {renderIrregularTransmission(markers[0])}
                              </Grid>
                            )}
                          </Grid>
                          <Grid item xs={4} alignItems="end" justifyContent="end">
                            <Grid container rowGap={1}>
                              <Grid item xs={12}>
                                <TextField
                                  variant="outlined"
                                  disabled
                                  multiline
                                  fullWidth
                                  maxRows={4}
                                  id="note"
                                  name="note"
                                  label="Note"
                                  autoComplete="note"
                                  value={ship.note || ''}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <FormControl
                                  fullWidth
                                  component="fieldset"
                                  variant="outlined"
                                  className="shipmentAttachedFiles"
                                  style={{
                                    padding: _.isEmpty(ship.uploaded_pdf)
                                      ? muiTheme.spacing(3)
                                      : muiTheme.spacing(1.5),
                                  }}
                                >
                                  <FormLabel component="legend" className="shipmentLegend">
                                    Attached Files
                                  </FormLabel>
                                  <Stack direction="row" spacing={1}>
                                    {!_.isEmpty(ship.uploaded_pdf)
                                      && _.map(ship.uploaded_pdf, (file, idx) => (
                                        <Chip key={`${file}-${idx}`} variant="outlined" label={file} />
                                      ))}
                                  </Stack>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </>
                );
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Shipment;
