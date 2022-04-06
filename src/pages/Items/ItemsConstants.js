import _ from 'lodash';
import moment from 'moment-timezone';
import { numberWithCommas } from '../../utils/utilMethods';

export const itemColumns = [
  {
    name: 'name',
    label: 'Item Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'number_of_units',
    label: '# of Units',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'item_type_value',
    label: 'Item Type',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'value',
    label: 'Value',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? `$${numberWithCommas(value)}`
          : value
      ),
    },
  },
  {
    name: 'gross_weight',
    label: 'Gross Weight',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? `${numberWithCommas(value)}`
          : value
      ),
    },
  },
  {
    name: 'unitsMeasure',
    label: 'Units of Measure',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
];

export const getFormattedRow = (data, itemTypeList, unitsOfMeasure) => {
  if (data && itemTypeList) {
    let formattedData = [];
    _.forEach(data, (element) => {
      let editedData = element;
      _.forEach(itemTypeList, (type) => {
        if (type.url === element.item_type) {
          editedData = {
            ...editedData,
            item_type_value: type.name,
          };
        }
      });
      if (unitsOfMeasure) {
        _.forEach(unitsOfMeasure, (unit) => {
          if (unit.url === element.unit_of_measure) {
            editedData = {
              ...editedData,
              unitsMeasure: unit.name,
            };
          }
        });
      }
      formattedData = [...formattedData, editedData];
    });

    return _.orderBy(
      formattedData,
      (dataRow) => moment(dataRow.create_date),
      ['asc'],
    );
  }
  return data;
};
