export const RECALL_DATA = [
  {
    shipmentId: "10000",
    issue: "recall",
    affected: "2000",
    custodian: "CN01222",
  },
  {
    shipmentId: "20000",
    issue: "recall",
    affected: "2000",
    custodian: "CN01222",
  },
  {
    shipmentId: "30000",
    issue: "recall",
    affected: "2000",
    custodian: "CN01222",
  },
  {
    shipmentId: "40000",
    issue: "recall",
    affected: "2000",
    custodian: "CN01222",
  },
];

export const DELAY_DATA = [
  {
    shipmentId: "10000",
    delay: "74",
    itemNo: "400",
    risk: "100000",
    custodian: "CN01222",
  },
  {
    shipmentId: "10000",
    delay: "74",
    itemNo: "400",
    risk: "100000",
    custodian: "CN01222",
  },
  {
    shipmentId: "10000",
    delay: "74",
    itemNo: "400",
    risk: "100000",
    custodian: "CN01222",
  },
  {
    shipmentId: "10000",
    delay: "74",
    itemNo: "400",
    risk: "100000",
    custodian: "CN01222",
  },
];

export const CUSTODIAN_DATA = [
  {
    name: "Nicole",
    id: 1,
    contact_data: "Arizona, Newyork",
    custodian_glns: "GLN123456",
    currentShipments: "SH123456, ABC23456",
  },
  {
    name: "Adam",
    id: 2,
    contact_data: "Arizona, Newyork",
    custodian_glns: "GLN123456",
    currentShipments: "SH123456, ABC23456",
  },
  {
    name: "Cathy",
    id: 3,
    contact_data: "Arizona, Newyork",
    custodian_glns: "GLN123456",
    currentShipments: "SH123456, ABC23456",
  },
];

export const COUNTRY_CHOICES = ["USA"];

export const STATE_CHOICES = [
  "AL",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "AK",
  "HI",
];

export const ADDRESS_TYPE = [
  "home",
  "billing",
  "business",
  "delivery",
  "mailing",
];

export const associatedGatewayMock = [
  { id: 1, uuid: "GT123456", name: "Gateway 1" },
  { id: 1, uuid: "GT123457", name: "Gateway 2" },
  { id: 1, uuid: "GT123459", name: "Gateway 3" },
  { id: 1, uuid: "GT123458", name: "Gateway 4" },
  { id: 1, uuid: "GT123455", name: "Gateway 5" },
];

export const shipmentMock = [
  {
    id: "SH10234567",
    name: "Shipment 1",
    item: "Chocolates",
    price: "$10,000",
    date: "02/06/2020",
  },
  {
    id: "SH10234567",
    name: "Shipment 1",
    item: "Chocolates",
    price: "$10,000",
    date: "02/06/2020",
  },
  {
    id: "SH10234567",
    name: "Shipment 1",
    item: "Chocolates",
    price: "$10,000",
    date: "02/06/2020",
  },
];
