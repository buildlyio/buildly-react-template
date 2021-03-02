import moment from "moment";
import _ from "lodash";
import { getFormattedCustodyRows } from "../Shipment/ShipmentConstants";
import { convertUnitsOfMeasure } from "midgard/utils/utilMethods";

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

export const getShipmentOverview = (
  shipmentData,
  custodianData,
  custodyData,
  sensorReportData,
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
    let sensorReportInfo = [];
    let contactInfo = {};
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
    let markerIndex = 1;

    if (custodyRows.length > 0) {
      custodyRows.forEach((custody) => {
        if (custody.shipment_id === list.shipment_uuid) {
          custodianName = custodianName + custody.custodian_data.name + ",";
          contactData.forEach((contact) => {
            if (custody.custodian_data.contact_data[0] == contact.url) {
              contactInfo['name'] = [contact['first_name'], contact['middle_name'], contact['last_name']].join(' ')
              contactInfo['address'] = [contact['address1'], contact['address2'], contact['city'], contact['postal_code'], contact['state'], contact['country']].join('\n')
            }
          })
          custodyInfo.push(custody);
        }
      });
    }
    list["custodian_name"] = custodianName;
    list["custody_info"] = custodyInfo;
    list["contact_info"] = contactInfo;

    if (sensorReportData && sensorReportData.length > 0) {
      sensorReportData.forEach((report) => {
        if (report.shipment_id === list.partner_shipment_id &&
          report.report_entry != null && typeof (report.report_entry) == 'object') {
          sensorReportInfo.push(report);
          const report_entry = report.report_entry;
          try {
            const parsedLocation = report_entry.report_location;
            if (parsedLocation.locationMethod !== "NoPosition") {
              const temperature = convertUnitsOfMeasure('celsius', report_entry.report_temp, temperatureUnit, 'temperature');  // Data in ICLP is coming in Celsius, conversion to selected unit
              const color = report.excursion_flag ? "red" : report.warning_flag ? "yellow" : "green";
              const marker = {
                lat: parsedLocation && parsedLocation.latitude,
                lng: parsedLocation && parsedLocation.longitude,
                label: parsedLocation && `Temperature: ${temperature}\u00b0${tempConst}, Humidity: ${report_entry.report_humidity}% recorded at ${moment(parsedLocation.timeOfPosition).format('llll')}`,
                temp: temperature,
                humidity: report_entry.report_humidity,
                color: color,
                index: markerIndex,
              }
              // Skip a marker on map only if temperature, humidity and lat long are all same.
              // Considered use case: If a shipment stays at some position for long, temperature and humidity changes can be critical
              const markerFound = _.find(markersToSet, {
                temp: marker.temp,
                humidity: marker.humidity,
                lat: marker.lat,
                lng: marker.lng,
              });
              if (!markerFound) {
                markersToSet.push(marker);
                markerIndex++;
              }
              temperatureData.push({ 'x': moment.utc(report.create_date).format('YYYY-MM-DD hh:mm:ss'), 'y': temperature });
              lightData.push({ 'x': moment.utc(report.create_date).format('YYYY-MM-DD hh:mm:ss'), 'y': report_entry.report_light });
              shockData.push({ 'x': moment.utc(report.create_date).format('YYYY-MM-DD hh:mm:ss'), 'y': report_entry.report_shock });
              tiltData.push({ 'x': moment.utc(report.create_date).format('YYYY-MM-DD hh:mm:ss'), 'y': report_entry.report_tilt });
              humidityData.push({ 'x': moment.utc(report.create_date).format('YYYY-MM-DD hh:mm:ss'), 'y': report_entry.report_humidity });
              batteryData.push({ 'x': moment.utc(report.create_date).format('YYYY-MM-DD hh:mm:ss'), 'y': report_entry.report_battery });
              pressureData.push({ 'x': moment.utc(report.create_date).format('YYYY-MM-DD hh:mm:ss'), 'y': report_entry.report_pressure });
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    }

    list["sensor_report"] = sensorReportInfo;
    list["markers_to_set"] = markersToSet;
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
    name: "temperature",
    unit: "\u00b0F",
  },
  {
    name: "light",
  },
  {
    name: "shock",
  },
  {
    name: "tilt",
  },
  {
    name: "humidity",
  },
  {
    name: "battery",
  },
  {
    name: "pressure",
  },
]