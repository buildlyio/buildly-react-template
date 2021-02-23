import moment from "moment";

export const CUSTODIAN_TYPE_TOOLTIP = 
  "Custodian Type(s) available in the system";

export const GATEWAY_TYPE_TOOLTIP = 
  "Gateway Type(s) available in the system";

export const ITEM_TYPE_TOOLTIP = 
  "Item Type(s) available in the system";

export const PRODUCT_TYPE_TOOLTIP = 
  "Product Type(s) available in the system";

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