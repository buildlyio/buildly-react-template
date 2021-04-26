import _ from 'lodash';
import { numberWithCommas } from '@utils/utilMethods';

export const itemColumns = [
  {
    id: 'name',
    label: 'Item Name',
    minWidth: 180,
  },
  {
    id: 'number_of_units',
    label: '# of Units',
    minWidth: 100,
  },
  {
    id: 'item_type_value',
    label: 'Item Type',
    minWidth: 150,
  },
  {
    id: 'value',
    label: 'Value',
    minWidth: 150,
    format: (value) => (value && value !== '-'
      ? `$${numberWithCommas(value)}`
      : value),
  },
  {
    id: 'gross_weight',
    label: 'Gross Weight',
    minWidth: 150,
    type: 'number',
    format: (value) => (value && value !== '-'
      ? `${numberWithCommas(value)}`
      : value),
  },
  {
    id: 'unitsMeasure',
    label: 'Units of Measure',
    minWidth: 50,
    type: 'number',
  },
];

export const getFormattedRow = (data, itemTypeList, unitsOfMeasure) => {
  if (data && itemTypeList) {
    const formattedData = [...data];
    formattedData.forEach((element) => {
      itemTypeList.forEach((type) => {
        if (type.url === element.item_type) {
          element.item_type_value = type.name;
        }
      });
      if (unitsOfMeasure) {
        unitsOfMeasure.forEach((unit) => {
          if (unit.url === element.unit_of_measure) {
            element.unitsMeasure = unit.name;
          }
        });
      }
    });

    return _.orderBy(formattedData, ['create_date'], ['asc']);
  }
  return data;
};
