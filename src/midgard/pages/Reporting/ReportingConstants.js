import React from "react";
import moment from "moment";
import _ from "lodash";
import { getFormattedCustodyRows } from "../Shipment/ShipmentConstants";
import { convertUnitsOfMeasure, getLocalDateTime } from "midgard/utils/utilMethods";
import { TempIcon, HumidIcon, LightIcon, BatteryIcon, PressureIcon, TiltIcon, ShockIcon } from "../../components/Icons/Icons";
import AccessTimeIcon from '@material-ui/icons/AccessTime';

export const SHIPMENT_OVERVIEW_TOOL_TIP =
  "Select a shipment to view reporting data";

export const NO_DATA =
  "No data to display";

export const SHIPMENT_OVERVIEW_COLUMNS = [
  {
    name: "name",
    label: "Shipment Name",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "status",
    label: "Shipment Status",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "estimated_time_of_departure",
    label: "Estimated Pickup Time",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-"
        ? moment(value).format("MM/DD/yyyy")
        : value
    },
  },
  {
    name: "actual_time_of_departure",
    label: "Actual Pickup Time",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-"
        ? moment(value).format("MM/DD/yyyy")
        : value
    },
  },
  {
    name: "estimated_time_of_arrival",
    label: "Estimated Arrival Time",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-"
        ? moment(value).format("MM/DD/yyyy")
        : value
    },
  },
  {
    name: "actual_time_of_arrival",
    label: "Actual Arrival Time",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-"
        ? moment(value).format("MM/DD/yyyy")
        : value
    },
  },
  {
    name: "custodian_name",
    label: "Custodian Name",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "custody_info",
    label: "Custodian Details",
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
      return <TempIcon color={color} name={item.name} />
    case 'light':
      return <LightIcon color={color} name={item.name} />
    case 'shock':
      return <ShockIcon color={color} name={item.name} />
    case 'tilt':
      return <TiltIcon color={color} name={item.name} />
    case 'humidity':
      return <HumidIcon color={color} name={item.name} />
    case 'battery':
      return <BatteryIcon color={color} name={item.name} />
    case 'pressure':
      return <PressureIcon color={color} name={item.name} />
    case 'time':
      return <AccessTimeIcon />
  }
}

export const getShipmentOverview = (
  shipmentData,
  custodianData,
  custodyData,
  aggregateReportData,
  contactData,
  unitsOfMeasure,
) => {
  let shipmentList = [...shipmentData];
  let custodyRows = [];
  if (
    custodyData &&
    custodyData.length &&
    custodianData &&
    custodianData.length
  ) {
    custodyRows = getFormattedCustodyRows(custodyData, custodianData);
  }

  shipmentList.forEach((list) => {
    let custodyInfo = [];
    let custodianName = "";
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

    let temperatureUnit = unitsOfMeasure.filter((obj) => {
      return obj.supported_class === "Temperature";
    })[0]["name"].toLowerCase()
    let tempConst = temperatureUnit[0].toUpperCase()

    if (custodyRows.length > 0) {
      custodyRows.forEach((custody) => {
        if (custody.shipment_id === list.shipment_uuid) {
          custodianName = custodianName + custody.custodian_data.name;
          contactData.forEach((contact) => {
            if (custody.custodian_data.contact_data[0] === contact.url) {
              contact['name'] = [contact['first_name'], contact['middle_name'], contact['last_name']].join(' ')
              contact['address'] = [contact['address1'], contact['address2'], contact['city'], contact['postal_code'], contact['state'], contact['country']].join('\n')
              contactInfo.push(contact);
            }
          })
          if (custody['has_current_custody'])
            custody['custody_type'] = 'Current'
          else if (custody['first_custody'])
            custody['custody_type'] = 'First'
          else if (custody['last_custody'])
            custody['custody_type'] = 'Last'
          else
            custody['custody_type'] = 'NA'
          custodyInfo.push(custody);
        }
      });
    }
    list["custodian_name"] = custodianName;
    list["custody_info"] = custodyInfo;
    list["contact_info"] = contactInfo;

    if (aggregateReportData && aggregateReportData.length > 0) {
      aggregateReportData.forEach((report) => {
        if (report.shipment_id === list.partner_shipment_id &&
          report.report_entries.length > 0) {
          const alert_status = report.excursion_flag ? "Excursion" : report.warning_flag ? "Warning" : "Normal";
          const color = report.excursion_flag ? "red" : report.warning_flag ? "yellow" : "green";
          report.report_entries.forEach((report_entry) => {
            try {
              const temperature = convertUnitsOfMeasure('celsius', report_entry.report_temp, temperatureUnit, 'temperature');  // Data in ICLP is coming in Celsius, conversion to selected unit
              let localDateTime = getLocalDateTime(report_entry.report_location.timeOfPosition)

              if ("report_timestamp" in report_entry) {
                if (report_entry["report_timestamp"] !== null)
                    localDateTime = getLocalDateTime(report_entry["report_timestamp"])
              }
             if (report_entry.report_location.locationMethod !== "NoPosition") {
              const marker = {
                lat: report_entry.report_location.latitude,
                lng: report_entry.report_location.longitude,
                label: 'Clustered',
                temperature: temperature,
                light: report_entry.report_light,
                shock: report_entry.report_shock,
                tilt: report_entry.report_tilt,
                humidity: report_entry.report_humidity,
                battery: report_entry.report_battery,
                pressure: report_entry.report_pressure,
                color: color,
                timestamp: localDateTime,
                alert_status: alert_status,
              }
              // Considered use case: If a shipment stays at some position for long, other value changes can be critical
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
                x: localDateTime
              });
              if (!graphPoint) {
                temperatureData.push({ 'x': localDateTime, 'y': temperature });
              lightData.push({ 'x': localDateTime, 'y': report_entry.report_light });
              shockData.push({ 'x': localDateTime, 'y': report_entry.report_shock });
              tiltData.push({ 'x': localDateTime, 'y': report_entry.report_tilt });
              humidityData.push({ 'x': localDateTime, 'y': report_entry.report_humidity });
              batteryData.push({ 'x': localDateTime, 'y': report_entry.report_battery });
              pressureData.push({ 'x': localDateTime, 'y': report_entry.report_pressure });
              }

            }
            } catch (e) {
              console.log(e);
            }
          });
        }
      });
    }

    list["sensor_report"] = aggregateReportInfo;
    list["markers_to_set"] = _.orderBy(markersToSet, (item) => {return moment(item.timestamp)}, ['asc']);
    list["temperature"] = temperatureData;
    list["light"] = lightData;
    list["shock"] = shockData;
    list["tilt"] = tiltData;
    list["humidity"] = humidityData;
    list["battery"] = batteryData;
    list["pressure"] = pressureData;
  });

  let sortedList = shipmentList.sort((a, b) => {
    return moment.utc(a.create_date).diff(moment.utc(b.create_date));
  });

  return sortedList;
};

export const REPORT_TYPES = [
  {
    id: "temperature",
    name: "Temperature",
    unit: "\u00b0F",
  },
  {
    id: "light",
    name: "Light",
    unit: "lux",
  },
  {
    id: "shock",
    name: "Shock",
    unit: "mg",
  },
  {
    id: "tilt",
    name: "Tilt",
    unit: "deg",
  },
  {
    id: "humidity",
    name: "Humidity",
    unit: "%",
  },
  {
    id: "battery",
    name: "Battery",
    unit: "%",
  },
  {
    id: "pressure",
    name: "Pressure",
    unit: "Pa",
  },
]