import { numberWithCommas } from "../../utils/utilMethods";
import moment from "moment";

export const SHIPMENT_COLUMNS = [
  { id: "id", width: 150, maxWidth: 150 },
  {
    id: "estimated_time_of_arrival",
    width: 150,
    maxWidth: 150,
    format: (value) => value && moment(value).format("yyyy/MM/DD"),
  },
  { id: "name", width: 150, maxWidth: 150 },
  { id: "custodian_name", width: 150, maxWidth: 150 },
  {
    id: "value",
    width: 150,
    maxWidth: 150,
    format: (value) => (value ? `$${numberWithCommas(value)}` : "-"),
  },
];

export const getFormattedRow = (shipmentData, custodianData, itemData) => {
  let shipmentList = [...shipmentData];
  shipmentList.forEach((list) => {
    let shipmentValue = 0;
    let custodianNames = "";
    if (custodianData && list.custodian_ids.length) {
      custodianData.forEach((custodian) => {
        if (list.custodian_ids.indexOf(custodian.custodian_uuid) !== -1) {
          custodianNames = custodianNames + custodian.name + ", ";
          list["custodian_name"] = custodianNames;
        }
      });
    }
    if (itemData && list.item_ids.length) {
      itemData.forEach((item) => {
        if (list.item_ids.indexOf(item.item_uuid) !== -1) {
          shipmentValue += item.value;
          list["value"] = shipmentValue;
        }
      });
    }
  });
  return shipmentList;
};
