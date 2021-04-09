import moment from "moment";
import { compareSort } from "../../utils/utilMethods";

export const gatewayColumns = [
  // { id: "id", label: "Id", minWidth: 50 },
  // { id: "gateway_uuid", label: "UUID", minWidth: 300 },
  { id: "name", label: "Gateway Name", minWidth: 200 },
  {
    id: "gateway_type_value",
    label: "Type",
    minWidth: 150,
  },
  {
    id: "last_known_battery_level",
    label: "Battery",
    minWidth: 150,
  },
  {
    id: "gateway_status",
    label: "Status",
    minWidth: 150,
    format: (value) =>
      value && value !== "-"
        ? value.charAt(0).toUpperCase() + value.substr(1)
        : value,
  },
  {
    id: "shipment",
    label: "Shipments",
    minWidth: 150,
  },
  {
    id: "activation_date",
    label: "Activation",
    minWidth: 180,
    format: (value) =>
      value && value !== "-" ? returnFormattedData(value) : value,
  },
];

const returnFormattedData = (value) => {
  let formattedDate = moment(value);
  return formattedDate.format("MM/DD/yyyy");
};

export const getFormattedRow = (data, itemTypeList, shipmentData) => {
  if (data && itemTypeList && shipmentData) {
    let formattedData = [...data];
    formattedData.forEach((element) => {
      element["shipment"] = [];
      itemTypeList.forEach((type) => {
        if (type.url === element.gateway_type) {
          element["gateway_type_value"] = type.name;
        }
      });
      shipmentData.forEach((shipment) => {
        if (
          element.shipment_ids &&
          element.shipment_ids.includes(shipment.partner_shipment_id)
        ) {
          element["shipment"].push(shipment.name);
        }
      });
      if (element["shipment"].length === 0) element["shipment"] = "-";
    });
    let sortedList = formattedData.sort((a, b) => {
      return moment.utc(a.create_date).diff(moment.utc(b.create_date));
    });
    return sortedList;
  }
  return data;
};

export const sensorsColumns = [
  // { id: "id", label: "ID", minWidth: 50 },
  // { id: "sensor_uuid", label: "UUID", minWidth: 150 },
  { id: "name", label: "Sensor Name", minWidth: 150, maxWidth: 150 },
  { id: "sensor_type_value", label: "Type", minWidth: 150, maxWidth: 150 },
  {
    id: "activation_date",
    label: "Activated",
    minWidth: 150,
    format: (value) =>
      value && value !== "-" ? returnFormattedData(value) : value,
  },
  {
    id: "associated_gateway",
    label: "Associated Gateway",
    minWidth: 150,
    maxWidth: 150,
  },
];

export const getFormattedSensorRow = (data, sensorTypeList, gatewayData) => {
  if (data && sensorTypeList) {
    let formattedData = [...data];
    formattedData.forEach((element) => {
      sensorTypeList.forEach((type) => {
        if (type.url === element.sensor_type) {
          element["sensor_type_value"] = type.name;
        }
      });
      if (gatewayData && gatewayData.length) {
        gatewayData.forEach((gateway) => {
          if (gateway.url === element.gateway) {
            element["associated_gateway"] = gateway.name;
          }
        });
      }
    });
    let sortedList = formattedData.sort((a, b) => {
      return moment.utc(a.create_date).diff(moment.utc(b.create_date));
    });
    return sortedList;
  }
  return data;
};

export const GATEWAY_STATUS = [
  { value: "available", name: "Available" },
  { value: "unavailable", name: "Unavailable" },
  { value: "assigned", name: "Assigned" },
  { value: "in-transit", name: "In-transit" },
];

export const getAvailableGateways = (
  data,
  gateway_type,
  gatewayTypeList,
  shipmentData
) => {
  let gatewayData = getFormattedRow(data, gatewayTypeList, shipmentData);
  return (
    gatewayData.sort(compareSort("name")) &&
    gatewayData.filter(
      (gateway) =>
        // !gateway.is_active &&
        gateway.gateway_status === "available" &&
        gateway.gateway_type_value.toLowerCase().includes(gateway_type)
    )
  );
};
