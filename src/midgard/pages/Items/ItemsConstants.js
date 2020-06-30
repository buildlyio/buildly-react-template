export const itemColumns = [
  { id: "id", label: "Item ID", minWidth: 150 },
  { id: "name", label: "Item Name", minWidth: 180 },
  { id: "desc", label: "Item Description", minWidth: 180 },
  {
    id: "units",
    label: "# of Units",
    minWidth: 100,
  },
  {
    id: "item_type_value",
    label: "Item Type",
    minWidth: 150,
  },
  {
    id: "shipping_id",
    label: "Shipping ID",
    minWidth: 150,
  },
  {
    id: "value",
    label: "Value",
    minWidth: 150,
  },
];

export const getFormattedRow = (data, itemTypeList, associatedToShipment) => {
  if (data && itemTypeList) {
    let formattedData = [...data];
    formattedData.forEach((element) => {
      itemTypeList.forEach((type) => {
        if (type.url === element.item_type) {
          element["item_type_value"] = type.name;
        }
      });
    });
    return formattedData;
  }
  return data;
};
