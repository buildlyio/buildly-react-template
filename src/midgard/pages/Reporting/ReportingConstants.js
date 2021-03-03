import moment from "moment";
import _ from "lodash";
import { getFormattedCustodyRows } from "../Shipment/ShipmentConstants";
import { convertUnitsOfMeasure , getLocalDateTime } from "midgard/utils/utilMethods";

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
          else if(custody['last_custody'])
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

    if (sensorReportData && sensorReportData.length > 0) {
      sensorReportData.forEach((report) => {
        if (report.shipment_id === list.partner_shipment_id &&
          report.report_entry !== null && typeof (report.report_entry) === 'object') {
          sensorReportInfo.push(report);
          const report_entry = report.report_entry;
          try {
            const parsedLocation = report_entry.report_location;
            const temperature = convertUnitsOfMeasure('celsius', report_entry.report_temp, temperatureUnit, 'temperature');  // Data in ICLP is coming in Celsius, conversion to selected unit
            const humidity = report_entry.report_humidity;
            const color = report.excursion_flag ? "red" : report.warning_flag ? "yellow" : "green";
            const localDateTime = getLocalDateTime(report.create_date)
            const marker = {
              lat: parsedLocation && parsedLocation.latitude,
              lng: parsedLocation && parsedLocation.longitude,
              label: parsedLocation && `Temperature: ${temperature}\u00b0${tempConst}, Humidity: ${humidity}% recorded at ${moment(parsedLocation.timeOfPosition).format('llll')}`,
              temp: temperature,
              humidity: humidity,
              color: color,
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
            }
            temperatureData.push({ 'x':localDateTime , 'y': temperature });
            lightData.push({ 'x': localDateTime, 'y': report_entry.report_light });
            shockData.push({ 'x': localDateTime, 'y': report_entry.report_shock });
            tiltData.push({ 'x': localDateTime, 'y': report_entry.report_tilt });
            humidityData.push({ 'x': localDateTime, 'y': report_entry.report_humidity });
            batteryData.push({ 'x': localDateTime, 'y': report_entry.report_battery });
            pressureData.push({ 'x': localDateTime, 'y': report_entry.report_pressure });

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
    id: "temperature",
    name: "Temperature",
    unit: "\u00b0F",
    color: "#fff",
  },
  {
    id: "light",
    name: "Light",
    unit: "lux",
    color: "#fff",
  },
  {
    id: "shock",
    name: "Shock",
    unit: "mg",
    color: "#fff",
  },
  {
    id: "tilt",
    name: "Tilt",
    unit: "deg",
    color: "#fff",
  },
  {
    id: "humidity",
    name: "Humidity",
    unit: "%",
    color: "#fff",
  },
  {
    id: "battery",
    name: "Battery",
    unit: "%",
    color: "#fff",
  },
  {
    id: "pressure",
    name: "Pressure",
    unit: "Pa",
    color: "#fff",
  },
]