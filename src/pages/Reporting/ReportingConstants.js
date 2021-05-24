import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import {
  AccessTime as AccessTimeIcon,
} from '@material-ui/icons';
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

export const SENSOR_REPORT_TOOLTIP = 'Shipment Sensor Report till current time';

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
  showUTC,
) => {
  let shipmentList = [];
  let custodyRows = [];
  if (
    custodyData
    && custodianData
    && custodyData.length
    && custodianData.length
  ) {
    custodyRows = getFormattedCustodyRows(custodyData, custodianData);
  }

  _.forEach(shipmentData, (shipment) => {
    const editedShipment = shipment;
    let custodyInfo = [];
    let custodianName = '';
    let aggregateReportInfo = [];
    let contactInfo = [];
    let temperatureData = [];
    let lightData = [];
    let shockData = [];
    let tiltData = [];
    let humidityData = [];
    let batteryData = [];
    let pressureData = [];
    let markersToSet = [];

    const temperatureUnit = _.lowerCase(
      _.find(
        unitsOfMeasure,
        { supported_class: 'Temperature' },
      ).name,
    );

    if (custodyRows.length > 0) {
      _.forEach(custodyRows, (custody) => {
        const editedCustody = custody;
        if (custody.shipment_id === shipment.shipment_uuid) {
          custodianName += custody.custodian_data.name;
          _.forEach(contactData, (contact) => {
            const editedContact = contact;
            if (custody.custodian_data.contact_data[0] === contact.url) {
              editedContact.name = [
                contact.first_name,
                contact.middle_name,
                contact.last_name,
              ].join(' ');
              editedContact.address = [
                contact.address1,
                contact.address2,
                contact.city,
                contact.postal_code,
                contact.state,
                contact.country,
              ].join('\n');
              contactInfo = [...contactInfo, editedContact];
            }
          });
          if (custody.has_current_custody) {
            editedCustody.custody_type = 'Current';
          } else if (custody.first_custody) {
            editedCustody.custody_type = 'First';
          } else if (custody.last_custody) {
            editedCustody.custody_type = 'Last';
          } else {
            editedCustody.custody_type = 'NA';
          }
          custodyInfo = [...custodyInfo, editedCustody];
        }
      });
    }
    editedShipment.custodian_name = custodianName;
    editedShipment.custody_info = custodyInfo;
    editedShipment.contact_info = contactInfo;

    if (
      aggregateReportData
      && aggregateReportData.length > 0
    ) {
      _.forEach(aggregateReportData, (report) => {
        if (
          report.shipment_id === shipment.partner_shipment_id
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
          _.forEach(report.report_entries, (report_entry) => {
            try {
              const temperature = editedShipment.platform_name === 'tive'
                ? report_entry.report_temp
                : convertUnitsOfMeasure(
                  'celsius',
                  report_entry.report_temp,
                  temperatureUnit,
                  'temperature',
                );

              let dateTime = '';
              if ('report_timestamp' in report_entry) {
                if (report_entry.report_timestamp !== null) {
                  const dt1 = showUTC
                    ? moment.utc(report_entry.report_timestamp)
                    : moment(report_entry.report_timestamp);
                  dateTime = dt1.format('MMM DD YYYY, h:mm:ss a');
                }
              } else if ('report_location' in report_entry) {
                const dt2 = showUTC
                  ? moment.utc(
                    report_entry.report_location.timeOfPosition,
                  )
                  : moment(
                    report_entry.report_location.timeOfPosition,
                  );
                dateTime = dt2.format('MMM DD YYYY, h:mm:ss a');
              }

              // For a valid (latitude, longitude) pair: -90<=X<=+90 and -180<=Y<=180
              const latitude = report_entry.report_latitude
                || report_entry.report_location.latitude;
              const longitude = report_entry.report_longitude
                || report_entry.report_location.longitude;
              if (
                (latitude >= -90
                  && latitude <= 90)
                && (longitude >= -180
                  && longitude <= 180)
                && dateTime !== ''
              ) {
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
                  timestamp: dateTime,
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
                  markersToSet = [...markersToSet, marker];
                }
                aggregateReportInfo = [...aggregateReportInfo, marker];
                const graphPoint = _.find(temperatureData, {
                  x: dateTime,
                });
                if (!graphPoint) {
                  temperatureData = [
                    ...temperatureData,
                    {
                      x: dateTime,
                      y: temperature,
                    },
                  ];
                  lightData = [
                    ...lightData,
                    {
                      x: dateTime,
                      y: report_entry.report_light,
                    },
                  ];
                  shockData = [
                    ...shockData,
                    {
                      x: dateTime,
                      y: report_entry.report_shock,
                    },
                  ];
                  tiltData = [
                    ...tiltData,
                    {
                      x: dateTime,
                      y: report_entry.report_tilt,
                    },
                  ];
                  humidityData = [
                    ...humidityData,
                    {
                      x: dateTime,
                      y: report_entry.report_humidity,
                    },
                  ];
                  batteryData = [
                    ...batteryData,
                    {
                      x: dateTime,
                      y: report_entry.report_battery,
                    },
                  ];
                  pressureData = [
                    ...pressureData,
                    {
                      x: dateTime,
                      y: report_entry.report_pressure,
                    },
                  ];
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

    editedShipment.sensor_report = aggregateReportInfo;
    editedShipment.markers_to_set = _.orderBy(
      markersToSet,
      (item) => moment(item.timestamp),
      ['asc'],
    );
    editedShipment.temperature = temperatureData;
    editedShipment.light = lightData;
    editedShipment.shock = shockData;
    editedShipment.tilt = tiltData;
    editedShipment.humidity = humidityData;
    editedShipment.battery = batteryData;
    editedShipment.pressure = pressureData;

    shipmentList = [...shipmentList, editedShipment];
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

export const SENSOR_REPORT_COLUMNS = [
  {
    name: 'alert_status',
    label: 'Alert Status',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'timestamp',
    label: 'Tag Captured Timestamp',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'lat',
    label: 'Location (Latitude)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
  {
    name: 'lng',
    label: 'Location (Longitude)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
  {
    name: 'light',
    label: 'Light (lux)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
  {
    name: 'humidity',
    label: 'Humidity (%)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
  {
    name: 'temperature',
    label: 'Temperature (\u00b0F)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(Number(value))
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
  {
    name: 'shock',
    label: 'Shock (mg)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
  {
    name: 'tilt',
    label: 'Tilt (deg)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
  {
    name: 'battery',
    label: 'Battery (%)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
  {
    name: 'pressure',
    label: 'Pressure (Pa)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
];
