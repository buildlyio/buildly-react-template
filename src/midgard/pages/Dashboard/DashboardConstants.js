import { numberWithCommas } from "../../utils/utilMethods";
import { getFormattedCustodyRows } from "../Shipment/ShipmentConstants";

export const recallColumns = [
  { id: "shipment_uuid", label: "Shipment ID", minWidth: 180 },
  { id: "shipment_flag", label: "Issue", minWidth: 150 },
  {
    id: "affected",
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
  custodyData
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
    let shipmentValue = 0;
    let custodyInfo = [];
    let custodianName = "";
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

    if (itemData && list.item_ids.length) {
      itemData.forEach((item) => {
        if (list.item_ids.indexOf(item.item_uuid) !== -1) {
          shipmentValue += item.value;
          list["value"] = shipmentValue;
        }
      });
    }
    if (shipmentFlag && shipmentFlag.length) {
      shipmentFlag &&
        shipmentFlag.forEach((flag) => {
          if (list.flags.indexOf(flag.url) !== -1 && flag.type !== "None") {
            list["shipment_flag"] = flag.name;
            list["flag_type"] = flag.type;
          }
        });
    }
  });
  return shipmentList;
};
