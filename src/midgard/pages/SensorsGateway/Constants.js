import moment from "moment";

export const gatewayColumns = [
  { id: "id", label: "Id", minWidth: 50 },
  { id: "gateway_uuid", label: "UUID", minWidth: 300 },
  { id: "name", label: "Alias", minWidth: 180 },
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
    id: "shipment_ids",
    label: "Shipment#",
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

export const getFormattedRow = (data, itemTypeList) => {
  if (data && itemTypeList) {
    let formattedData = [...data];
    formattedData.forEach((element) => {
      itemTypeList.forEach((type) => {
        if (type.url === element.gateway_type) {
          element["gateway_type_value"] = type.name;
        }
      });
    });
    let sortedList = formattedData.sort((a, b) => {
      return moment.utc(a.create_date).diff(moment.utc(b.create_date));
    });
    return sortedList;
  }
  return data;
};

export const sensorsColumns = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "sensor_uuid", label: "UUID", minWidth: 150 },
  { id: "name", label: "Alias", minWidth: 150 },
  { id: "sensor_type_value", label: "Type", minWidth: 150 },
  {
    id: "activation_date",
    label: "Activated",
    minWidth: 150,
    format: (value) =>
      value && value !== "-" ? returnFormattedData(value) : value,
  },
];

export const getFormattedSensorRow = (data, sensorTypeList) => {
  if (data && sensorTypeList) {
    let formattedData = [...data];
    formattedData.forEach((element) => {
      sensorTypeList.forEach((type) => {
        if (type.url === element.sensor_type) {
          element["sensor_type_value"] = type.name;
        }
      });
    });
    let sortedList = formattedData.sort((a, b) => {
      return moment.utc(a.create_date).diff(moment.utc(b.create_date));
    });
    return sortedList;
  }
  return data;
};
