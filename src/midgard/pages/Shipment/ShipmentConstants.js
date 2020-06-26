import { numberWithCommas } from "../../utils/utilMethods";
import moment from "moment";

export const SHIPMENT_COLUMNS = [
  { id: "id", width: 150, maxWidth: 150 },
  {
    id: "actual_time_of_arrival",
    width: 150,
    maxWidth: 150,
    format: (value) => value && moment(value).format("MM/DD/yyyy"),
  },
  { id: "name", width: 150, maxWidth: 150 },
  { id: "custodian_name", width: 150, maxWidth: 150 },
  {
    id: "price",
    width: 150,
    maxWidth: 150,
    format: (value) => `$${numberWithCommas(value)}`,
  },
];
