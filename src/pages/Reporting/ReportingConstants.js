/* eslint-disable no-param-reassign */
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { AccessTime as AccessTimeIcon } from '@material-ui/icons';
import {
  TempIcon,
  HumidIcon,
  LightIcon,
  BatteryIcon,
  PressureIcon,
  TiltIcon,
  ShockIcon,
} from '@components/Icons/Icons';
import {
  getFormattedCustodyRows,
} from '@pages/Shipment/ShipmentConstants';
import {
  convertUnitsOfMeasure,
} from '@utils/utilMethods';

export const SHIPMENT_OVERVIEW_TOOL_TIP = 'Select a shipment to view reporting data';

export const NO_DATA = 'No data to display';

export const SHIPMENT_OVERVIEW_COLUMNS = [
  {
    name: 'name',
    label: 'Shipment Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'status',
    label: 'Shipment Status',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'estimated_time_of_departure',
    label: 'Estimated Pickup Time',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (value && value !== '-'
        ? moment(value).format('MM/DD/yyyy')
        : value),
    },
  },
  {
    name: 'actual_time_of_departure',
    label: 'Actual Pickup Time',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (value && value !== '-'
        ? moment(value).format('MM/DD/yyyy')
        : value),
    },
  },
  {
    name: 'estimated_time_of_arrival',
    label: 'Estimated Arrival Time',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (value && value !== '-'
        ? moment(value).format('MM/DD/yyyy')
        : value),
    },
  },
  {
    name: 'actual_time_of_arrival',
    label: 'Actual Arrival Time',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (value && value !== '-'
        ? moment(value).format('MM/DD/yyyy')
        : value),
    },
  },
  {
    name: 'custodian_name',
    label: 'Custodian Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'custody_info',
    label: 'Custodian Details',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
];

export const getIcon = (item, color) => {
  switch (item.id) {
    case 'temperature':
      return <TempIcon color={color} name={item.name} />;

    case 'light':
      return <LightIcon color={color} name={item.name} />;

    case 'shock':
      return <ShockIcon color={color} name={item.name} />;

    case 'tilt':
      return <TiltIcon color={color} name={item.name} />;

    case 'humidity':
      return <HumidIcon color={color} name={item.name} />;

    case 'battery':
      return <BatteryIcon color={color} name={item.name} />;

    case 'pressure':
      return <PressureIcon color={color} name={item.name} />;

    case 'time':
      return <AccessTimeIcon />;

    default:
      return null;
  }
};

export const getShipmentOverview = (
  shipmentData,
  custodianData,
  custodyData,
  aggregateReportData,
  contactData,
  unitsOfMeasure,
) => {
  const shipmentList = [...shipmentData];
  let custodyRows = [];
  if (
    custodyData
    && custodianData
    && custodyData.length
    && custodianData.length
  ) {
    custodyRows = getFormattedCustodyRows(custodyData, custodianData);
  }

  shipmentList.forEach((list) => {
    const custodyInfo = [];
    let custodianName = '';
    const aggregateReportInfo = [];
    const contactInfo = [];
    const temperatureData = [];
    const lightData = [];
    const shockData = [];
    const tiltData = [];
    const humidityData = [];
    const batteryData = [];
    const pressureData = [];
    const markersToSet = [];

    const temperatureUnit = unitsOfMeasure.filter((obj) => obj.supported_class === 'Temperature')[0].name.toLowerCase();

    if (custodyRows.length > 0) {
      custodyRows.forEach((custody) => {
        if (custody.shipment_id === list.shipment_uuid) {
          custodianName += custody.custodian_data.name;
          contactData.forEach((contact) => {
            if (custody.custodian_data.contact_data[0] === contact.url) {
              contact.name = [
                contact.first_name,
                contact.middle_name,
                contact.last_name,
              ].join(' ');
              contact.address = [
                contact.address1,
                contact.address2,
                contact.city,
                contact.postal_code,
                contact.state,
                contact.country,
              ].join('\n');
              contactInfo.push(contact);
            }
          });
          if (custody.has_current_custody) {
            custody.custody_type = 'Current';
          } else if (custody.first_custody) {
            custody.custody_type = 'First';
          } else if (custody.last_custody) {
            custody.custody_type = 'Last';
          } else {
            custody.custody_type = 'NA';
          }
          custodyInfo.push(custody);
        }
      });
    }
    list.custodian_name = custodianName;
    list.custody_info = custodyInfo;
    list.contact_info = contactInfo;

    if (aggregateReportData && aggregateReportData.length > 0) {
      aggregateReportData.forEach((report) => {
        if (
          report.shipment_id === list.partner_shipment_id
          && report.report_entries.length > 0
        ) {
          let alert_status;
          let color;
          if (report.excursion_flag) {
            alert_status = 'Excursion';
            color = 'red';
          } else if (report.warning_flag) {
            alert_status = 'Warning';
            color = 'yellow';
          } else {
            alert_status = 'Normal';
            color = 'green';
          }
          report.report_entries.forEach((report_entry) => {
            try {
              const temperature = list.platform_name === 'tive'
                ? report_entry.report_temp
                : convertUnitsOfMeasure(
                  'celsius',
                  report_entry.report_temp,
                  temperatureUnit,
                  'temperature',
                );
              let localDateTime = '';
              if ('report_timestamp' in report_entry) {
                if (report_entry.report_timestamp !== null) {
                  localDateTime = moment(
                    report_entry.report_timestamp,
                  ).format('MMM DD YYYY, h:mm:ss a');
                }
              } else if ('report_location' in report_entry) {
                localDateTime = moment(
                  report_entry.report_location.timeOfPosition,
                ).format('MMM DD YYYY, h:mm:ss a');
              }
              // For a valid (latitude, longitude) pair: -90<=X<=+90 and -180<=Y<=180
              const latitude = report_entry.report_latitude
                || report_entry.report_location.latitude;
              const longitude = report_entry.report_longitude
                || report_entry.report_location.longitude;
              if ((latitude >= -90 && latitude <= 90) && (longitude >= -180 && longitude <= 180) && localDateTime !== '') {
                const marker = {
                  lat: latitude,
                  lng: longitude,
                  label: 'Clustered',
                  temperature,
                  light: report_entry.report_light,
                  shock: report_entry.report_shock,
                  tilt: report_entry.report_tilt,
                  humidity: report_entry.report_humidity,
                  battery: report_entry.report_battery,
                  pressure: report_entry.report_pressure,
                  color,
                  timestamp: localDateTime,
                  alert_status,
                };
                // Considered use case: If a shipment stays at some
                // position for long, other value changes can be
                // critical
                const markerFound = _.find(markersToSet, {
                  lat: marker.lat,
                  lng: marker.lng,
                  // temperature: marker.temperature,
                  // humidity: marker.humidity,
                });
                if (!markerFound) {
                  markersToSet.push(marker);
                }
                aggregateReportInfo.push(marker);
                const graphPoint = _.find(temperatureData, {
                  x: localDateTime,
                });
                if (!graphPoint) {
                  temperatureData.push({
                    x: localDateTime,
                    y: temperature,
                  });
                  lightData.push({
                    x: localDateTime,
                    y: report_entry.report_light,
                  });
                  shockData.push({
                    x: localDateTime,
                    y: report_entry.report_shock,
                  });
                  tiltData.push({
                    x: localDateTime,
                    y: report_entry.report_tilt,
                  });
                  humidityData.push({
                    x: localDateTime,
                    y: report_entry.report_humidity,
                  });
                  batteryData.push({
                    x: localDateTime,
                    y: report_entry.report_battery,
                  });
                  pressureData.push({
                    x: localDateTime,
                    y: report_entry.report_pressure,
                  });
                }
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log(e);
            }
          });
        }
      });
    }

    list.sensor_report = aggregateReportInfo;
    list.markers_to_set = _.orderBy(
      markersToSet,
      (item) => moment(item.timestamp),
      ['asc'],
    );
    list.temperature = temperatureData;
    list.light = lightData;
    list.shock = shockData;
    list.tilt = tiltData;
    list.humidity = humidityData;
    list.battery = batteryData;
    list.pressure = pressureData;
  });

  return _.orderBy(
    shipmentList,
    (shipment) => moment(shipment.estimated_time_of_departure)
    && moment(shipment.create_date),
    ['desc'],
  );
};

export const REPORT_TYPES = [
  { id: 'temperature', name: 'Temperature', unit: '\u00b0F' },
  { id: 'light', name: 'Light', unit: 'lux' },
  { id: 'shock', name: 'Shock', unit: 'mg' },
  { id: 'tilt', name: 'Tilt', unit: 'deg' },
  { id: 'humidity', name: 'Humidity', unit: '%' },
  { id: 'battery', name: 'Battery', unit: '%' },
  { id: 'pressure', name: 'Pressure', unit: 'Pa' },
];
