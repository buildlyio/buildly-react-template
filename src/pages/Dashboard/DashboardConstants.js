import { numberWithCommas } from "../../utils/utilMethods";
import { getFormattedCustodyRows, getFormattedAggregateReportRow } from "../Shipment/ShipmentConstants";

export const DASHBOARD_MAP_TOOLTIP =
  "Start and end locations of custodians which have current custody of the shipments that are currently enroute.";

export const DASHBOARD_RECALL_TOOLTIP =
  "Shipments which are either recalled or have violations such as temperature, humidity and delay";

export const DASHBOARD_DELAY_TOOLTIP = "Shipments which are delayed";

export const recallColumns = [
  { id: "shipment_uuid", label: "Shipment ID", minWidth: 180 },
  {
    id: "flag_list",
    label: "Issue",
    minWidth: 150,
    format: (value) => {
      if (value && value.length) {
        let flagName = "";
        value.forEach((flag) => {
          flagName = flagName + flag.name + ", ";
        });
        return flagName;
      }
      return value;
    },
  },
  {
    id: "itemNo",
    label: "Affected Items",
    minWidth: 150,
  },
  {
    id: "custodian_name",
    label: "Current Custodians",
    minWidth: 180,
  },
];

export const delayColumns = [
  { id: "shipment_uuid", label: "Shipment ID", minWidth: 180 },
  {
    id: "delay",
    label: "Delay(hrs)",
    minWidth: 150,
  },
  {
    id: "itemNo",
    label: "Items",
    minWidth: 170,
  },
  {
    id: "risk",
    label: "Revenue Risk",
    minWidth: 170,
    format: (value) =>
      value && value !== "-" ? `$${numberWithCommas(value)}` : value,
  },
  {
    id: "custodian",
    label: "Current Custodians",
    minWidth: 170,
  },
];

export const getFormattedShipmentRow = (
  shipmentData,
  custodianData,
  itemData,
  shipmentFlag,
  custodyData,
  aggregateReportData
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
    let itemName = "";
    let custodyInfo = [];
    let custodianName = "";
    let flag_list = [];
    let aggregateReportInfo = [];

    if (custodyRows.length > 0) {
      custodyRows.forEach((custody) => {
        if (
          custody.shipment_id === list.shipment_uuid &&
          custody.has_current_custody
        ) {
          custodianName = custodianName + custody.custodian_data.name + ",";
          custodyInfo.push(custody);
        }
      });
    }
    list["custodian_name"] = custodianName;
    list["custody_info"] = custodyInfo;

    if (aggregateReportData && aggregateReportData.length > 0) {
      aggregateReportData.forEach((report) => {
        if (report.shipment_id === list.partner_shipment_id) {
          aggregateReportInfo.push(report);
        }
      });
    }

    list["sensor_report"] = aggregateReportInfo;

    if (itemData && list.items && list.items.length) {
      itemData.forEach((item) => {
        if (list.items.indexOf(item.url) !== -1) {
          itemName = itemName + item.name + ", ";
          list["itemNo"] = itemName;
        }
      });
    }
    if (shipmentFlag && shipmentFlag.length) {
      shipmentFlag &&
        shipmentFlag.forEach((flag) => {
          if (list.flags.indexOf(flag.url) !== -1 && flag.type !== "None") {
            list[`${flag.name.toLowerCase()}_flag`] = true;
            flag_list.push(flag);
          }
        });
    }
    list["flag_list"] = flag_list;
  });
  return shipmentList;
};
