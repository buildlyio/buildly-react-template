import moment from "moment";
import _ from "lodash";

export const CUSTODIAN_TYPE_TOOLTIP = 
  "Custodian Type(s) available in the system";

export const GATEWAY_TYPE_TOOLTIP = 
  "Gateway Type(s) available in the system";

export const ITEM_TYPE_TOOLTIP = 
  "Item Type(s) available in the system";

export const PRODUCT_TYPE_TOOLTIP = 
  "Product Type(s) available in the system";

export const SHIPMENT_FLAG_TOOLTIP = 
  "Shipment Flag(s) available in the system";

export const CUSTODIAN_TYPE_COLUMNS = [
  {
    name: "name",
    label: "Name",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "create_date",
    label: "Created At",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-" 
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : value
    },
  },
  {
    name: "edit_date",
    label: "Last Edited At",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-" 
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : value
    },
  },
];

export const GATEWAY_TYPE_COLUMNS = [
  {
    name: "name",
    label: "Name",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "create_date",
    label: "Created At",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-" 
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : value
    },
  },
  {
    name: "edit_date",
    label: "Last Edited At",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-" 
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : value
    },
  },
];

export const ITEM_TYPE_COLUMNS = [
  {
    name: "name",
    label: "Name",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "create_date",
    label: "Created At",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-" 
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : value
    },
  },
  {
    name: "edit_date",
    label: "Last Edited At",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-" 
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : value
    },
  },
];

export const PRODUCT_TYPE_COLUMNS = [
  {
    name: "name",
    label: "Name",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "create_date",
    label: "Created At",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-" 
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : value
    },
  },
  {
    name: "edit_date",
    label: "Last Edited At",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-" 
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : value
    },
  },
];

export const SHIPMENT_FLAG_COLUMNS = [
  {
    name: "name",
    label: "Flag Name",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "type",
    label: "Flag Type",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => _.capitalize(value)
    },
  },
  {
    name: "max_flag",
    label: "Maximum Limit Flag",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value ? "YES" : "NO"
    },
  },
  {
    name: "min_flag",
    label: "Minimum Limit Flag",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value ? "YES" : "NO"
    },
  },
  {
    name: "create_date",
    label: "Created At",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-" 
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : value
    },
  },
  {
    name: "edit_date",
    label: "Last Edited At",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-" 
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : value
    },
  },
];