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

export const SHIPMENT_STATUS = [
  { value: "Planned", label: "Planned" },
  { value: "Enroute", label: "Enroute" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Completed", label: "Completed" },
];

export const TRANSPORT_MODE = [
  { value: "Air", label: "Air" },
  { value: "land-rail", label: "Land Rail" },
  { value: "land-road", label: "Land Road" },
  { value: "mixed", label: "Mixed" },
  { value: "sea", label: "Sea" },
];

export const SENSOR_PLATFORM = [
  { value: "iclp", label: "ICLP" },
  // { value: "tive", label: "Tive" },
];

export const associatedGatewayMock = [
  { id: 1, uuid: "GT123456", name: "Gateway 1" },
  { id: 1, uuid: "GT123457", name: "Gateway 2" },
  { id: 1, uuid: "GT123459", name: "Gateway 3" },
  { id: 1, uuid: "GT123458", name: "Gateway 4" },
  { id: 1, uuid: "GT123455", name: "Gateway 5" },
];

export const PRODUCT_MOCK = [
  {
    ean: "12345",
    upc: "12345",
    gtin: "12345",
    name: "Apples",
    value: 1200,
    bin_id: "12345",
    description: "American Apples",
    batch_run_id: "12345",
    gross_weight: 400,
    product_type: "Produces",
    inbound_bin_id: "",
    producer_bin_id: "",
    unit_of_measure: "https://tp-dev-shipment.buildly.io/unit_of_measure/1/",
    paper_tag_number: "12345",
    processor_bin_id: "",
    producer_batch_id: "",
    processor_batch_id: "",
    inbound_batch_lot_id: "",
    url: "abc",
  },
  {
    ean: "12345",
    upc: "12345",
    gtin: "12345",
    name: "Wheats",
    value: 1400,
    bin_id: "12345",
    description: "Wheats",
    batch_run_id: "12345",
    gross_weight: 600,
    product_type: "Grains",
    inbound_bin_id: "",
    producer_bin_id: "",
    unit_of_measure: "https://tp-dev-shipment.buildly.io/unit_of_measure/5/",
    paper_tag_number: "12345",
    processor_bin_id: "",
    producer_batch_id: "",
    processor_batch_id: "",
    inbound_batch_lot_id: "",
    url: "def",
  },
];
