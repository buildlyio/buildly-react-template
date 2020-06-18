export const gatewayColumns = [
  { id: "gateway_uuid", label: "UUID", minWidth: 150 },
  { id: "name", label: "Alias", minWidth: 180 },
  {
    id: "",
    label: "# of Units",
    minWidth: 100,
  },
  {
    id: "gateway_type",
    label: "Type",
    minWidth: 150,
  },
  {
    id: "last_known_battery_level",
    label: "Battery",
    minWidth: 150,
  },
  {
    id: "shipment_ids",
    label: "Shipment#",
    minWidth: 150,
  },
  {
    id: "activation_date",
    label: "Activation",
    minWidth: 150,
  },
];

export const sensorsColumns = [
  { id: "sensor_uuid", label: "UUID", minWidth: 150 },
  { id: "name", label: "Alias", minWidth: 150 },
  { id: "sensor_type", label: "Type", minWidth: 150 },
  { id: "activation_date", label: "Activated", minWidth: 150 },
];
