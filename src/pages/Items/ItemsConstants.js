import _ from 'lodash';
import moment from 'moment-timezone';
import { numberWithCommas } from '../../utils/utilMethods';

export const itemColumns = (currUnit) => ([
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
          ? `${numberWithCommas(value)} ${currUnit}`
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
    name: 'unitMeasure',
    label: 'Unit of Measure',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
]);

export const getItemFormattedRow = (data, itemTypeList, unitOfMeasure) => {
  if (data && itemTypeList) {
    let formattedData = [];
    const uomw = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'weight')) || '';
    const uom = uomw ? uomw.unit_of_measure : '';

    _.forEach(data, (element) => {
      let editedData = element;
      _.forEach(itemTypeList, (type) => {
        if (type.url === element.item_type) {
          editedData = {
            ...editedData,
            item_type_value: type.name,
            unitMeasure: uom,
          };
        }
      });
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
