import { numberWithCommas } from "../../utils/utilMethods";

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
