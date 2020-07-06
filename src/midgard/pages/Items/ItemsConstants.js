import { numberWithCommas } from "../../utils/utilMethods";

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
    format: (value) => `$${numberWithCommas(value)}`,
  },
  {
    id: "gross_weight",
    label: "Gross Weight",
    minWidth: 150,
    format: (value) => `${numberWithCommas(value)}`,
    type: "number",
  },
  {
    id: "unitsMeasure",
    label: "Units of Measure",
    minWidth: 50,
    type: "number",
  },
];

export const getFormattedRow = (data, itemTypeList, unitsOfMeasure) => {
  if (data && itemTypeList) {
    let formattedData = [...data];
    formattedData.forEach((element) => {
      itemTypeList.forEach((type) => {
        if (type.url === element.item_type) {
          element["item_type_value"] = type.name;
        }
      });
      if (unitsOfMeasure) {
        unitsOfMeasure.forEach((unit) => {
          if (unit.url === element.unit_of_measure) {
            element["unitsMeasure"] = unit.name;
          }
        });
      }
    });
    return formattedData;
  }
  return data;
};
