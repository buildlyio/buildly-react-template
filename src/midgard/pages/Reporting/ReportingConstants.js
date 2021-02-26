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
          }
        });
      }

      list["sensor_report"] = sensorReportInfo;
    });
    let sortedList = shipmentList.sort((a, b) => {
      return moment.utc(a.create_date).diff(moment.utc(b.create_date));
    });

    return sortedList;
  };
