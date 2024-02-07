import moment from 'moment-timezone';

export const RECALL_DATA = [
  {
    shipmentId: '10000',
    issue: 'recall',
    affected: '2000',
    custodian: 'CN01222',
  },
  {
    shipmentId: '20000',
    issue: 'recall',
    affected: '2000',
    custodian: 'CN01222',
  },
  {
    shipmentId: '30000',
    issue: 'recall',
    affected: '2000',
    custodian: 'CN01222',
  },
  {
    shipmentId: '40000',
    issue: 'recall',
    affected: '2000',
    custodian: 'CN01222',
  },
];

export const DELAY_DATA = [
  {
    shipmentId: '10000',
    delay: '74',
    itemNo: '400',
    risk: '100000',
    custodian: 'CN01222',
  },
  {
    shipmentId: '10000',
    delay: '74',
    itemNo: '400',
    risk: '100000',
    custodian: 'CN01222',
  },
  {
    shipmentId: '10000',
    delay: '74',
    itemNo: '400',
    risk: '100000',
    custodian: 'CN01222',
  },
  {
    shipmentId: '10000',
    delay: '74',
    itemNo: '400',
    risk: '100000',
    custodian: 'CN01222',
  },
];

export const CUSTODIAN_DATA = [
  {
    name: 'Nicole',
    id: 1,
    contact_data: 'Arizona, Newyork',
    custodian_glns: 'GLN123456',
    currentShipments: 'SH123456, ABC23456',
  },
  {
    name: 'Adam',
    id: 2,
    contact_data: 'Arizona, Newyork',
    custodian_glns: 'GLN123456',
    currentShipments: 'SH123456, ABC23456',
  },
  {
    name: 'Cathy',
    id: 3,
    contact_data: 'Arizona, Newyork',
    custodian_glns: 'GLN123456',
    currentShipments: 'SH123456, ABC23456',
  },
];

export const CURRENCY_CHOICES = ['Dollar'];

export const DATE_DISPLAY_CHOICES = [
  { label: moment().format('MMM DD, YYYY'), value: 'MMM DD, YYYY' },
  { label: moment().format('DD MMM, YYYY'), value: 'DD MMM, YYYY' },
  { label: moment().format('MM/DD/YYYY'), value: 'MM/DD/YYYY' },
  { label: moment().format('DD/MM/YYYY'), value: 'DD/MM/YYYY' },
];

export const TIME_DISPLAY_CHOICES = [
  { label: '12 Hour clock', value: 'hh:mm:ss A' },
  { label: '24 Hour clock', value: 'HH:mm:ss' },
];

export const UOM_DISTANCE_CHOICES = ['Miles', 'Kilometers'];

export const UOM_TEMPERATURE_CHOICES = ['Fahrenheit', 'Celsius'];

export const UOM_WEIGHT_CHOICES = ['Pounds', 'Kilograms'];

export const TIVE_GATEWAY_TIMES = [
  { value: 5, label: '5 Minutes' },
  { value: 10, label: '10 Minutes' },
  { value: 20, label: '20 Minutes' },
  { value: 30, label: '30 Minutes' },
  { value: 60, label: '1 Hour' },
  { value: 120, label: '2 Hours' },
  { value: 360, label: '6 Hours' },
  { value: 720, label: '12 Hours' },
];

export const ADDRESS_TYPE = [
  'home',
  'billing',
  'business',
  'delivery',
  'mailing',
];

export const CREATE_SHIPMENT_STATUS = [
  { value: 'Planned', label: 'Planned' },
  { value: 'En route', label: 'En route' },
  { value: 'Arrived', label: 'Arrived' },
];
export const USER_SHIPMENT_STATUS = [
  { value: 'Planned', label: 'Planned' },
  { value: 'En route', label: 'En route' },
  { value: 'Arrived', label: 'Arrived' },
  { value: 'Cancelled', label: 'Cancelled' },
];
export const ADMIN_SHIPMENT_STATUS = [
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Damaged', label: 'Damaged' },
  { value: 'Battery Depleted', label: 'Battery Depleted' },
];

export const TRANSPORT_MODE = [
  { value: 'Air', label: 'Air' },
  { value: 'land-rail', label: 'Land Rail' },
  { value: 'land-road', label: 'Land Road' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'sea', label: 'Sea' },
];

export const CARRIER = [
  { value: 'Logistics Provider', label: 'Logistics Provider' },
];

export const SENSOR_PLATFORM = [
  // { value: 'iclp', label: 'ICLP' },
  { value: 'Tive', label: 'Tive' },
  { value: 'ProofTracker Pro', label: 'ProofTracker Pro' },
];

export const associatedGatewayMock = [
  { id: 1, uuid: 'GT123456', name: 'Gateway 1' },
  { id: 1, uuid: 'GT123457', name: 'Gateway 2' },
  { id: 1, uuid: 'GT123459', name: 'Gateway 3' },
  { id: 1, uuid: 'GT123458', name: 'Gateway 4' },
  { id: 1, uuid: 'GT123455', name: 'Gateway 5' },
];

export const PRODUCT_MOCK = [
  {
    ean: '12345',
    upc: '12345',
    gtin: '12345',
    name: 'Apples',
    value: 1200,
    bin_id: '12345',
    description: 'American Apples',
    batch_run_id: '12345',
    gross_weight: 400,
    product_type: 'Produces',
    inbound_bin_id: '',
    producer_bin_id: '',
    paper_tag_number: '12345',
    processor_bin_id: '',
    producer_batch_id: '',
    processor_batch_id: '',
    inbound_batch_lot_id: '',
    url: 'abc',
  },
  {
    ean: '12345',
    upc: '12345',
    gtin: '12345',
    name: 'Wheats',
    value: 1400,
    bin_id: '12345',
    description: 'Wheats',
    batch_run_id: '12345',
    gross_weight: 600,
    product_type: 'Grains',
    inbound_bin_id: '',
    producer_bin_id: '',
    paper_tag_number: '12345',
    processor_bin_id: '',
    producer_batch_id: '',
    processor_batch_id: '',
    inbound_batch_lot_id: '',
    url: 'def',
  },
];
