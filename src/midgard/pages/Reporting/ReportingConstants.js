import moment from "moment";
import { getFormattedCustodyRows } from "../Shipment/ShipmentConstants";

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

      if (custodyRows.length > 0) {
        custodyRows.forEach((custody) => {
          if (custody.shipment_id === list.shipment_uuid) {
            custodianName = custodianName + custody.custodian_data.name + ",";
            contactData.forEach((contact) => {
               if (custody.custodian_data.contact_data[0] == contact.url) {
                contactInfo['name'] = [contact['first_name'],contact['middle_name'],contact['last_name']].join(' ')
                contactInfo['address'] = [contact['address1'],contact['address2'],contact['city'],contact['postal_code'],contact['state'],contact['country']].join('\n')
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
          if (report.shipment_id.includes(list.partner_shipment_id)) {
            sensorReportInfo.push(report);
            //Change after new data format comes in
            temperatureData.push({'x': moment(report.create_date),'y': report.report_temp});
            lightData.push({'x': moment(report.create_date),'y': report.report_temp});
            shockData.push({'x': moment(report.create_date),'y': report.report_temp});
            tiltData.push({'x': moment(report.create_date),'y': report.report_temp});
            humidityData.push({'x': moment(report.create_date),'y': report.report_humidity});
            batteryData.push({'x': moment(report.create_date),'y': report.report_humidity});
            pressureData.push({'x': moment(report.create_date),'y': report.report_temp});
          }
        });
      }

      list["sensor_report"] = sensorReportInfo;
      list["temperature"] =  temperatureData;
      list["light"] =  lightData;
      list["shock"] =  shockData;
      list["tilt"] =  tiltData;
      list["humidity"] =  humidityData;
      list["battery"] =  batteryData;
      list["pressure"] =  pressureData;

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