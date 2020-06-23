import moment from "moment";

export const gatewayColumns = [
  { id: "id", label: "Id", minWidth: 100 },
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
    format: (value) => returnFormattedData(value),
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
    return formattedData;
  }
  return data;
};
