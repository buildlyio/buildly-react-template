import _ from 'lodash';

export const custodianColumns = [
  {
    name: 'name',
    label: 'Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'location',
    label: 'Location',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'custodian_glns',
    label: 'GLN',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value || '-',
    },
  },
];

export const getUniqueContactInfo = (rowItem, contactInfo) => {
  let obj = '';
  _.forEach(contactInfo, (info) => {
    if (rowItem.contact_data[0] === info.url) {
      obj = info;
    }
  });
  return obj;
};

export const getCustodianFormattedRow = (data, contactInfo, custodyData) => {
  if (data && data.length && contactInfo && contactInfo.length) {
    let customizedRow = [];
    _.forEach(data, (rowItem) => {
      const contactInfoItem = getUniqueContactInfo(rowItem, contactInfo);
      const location = `${
        contactInfoItem.address1
        && `${contactInfoItem.address1},`
      } ${
        contactInfoItem.address2
        && `${contactInfoItem.address2},`
      } ${
        contactInfoItem.city
        && `${contactInfoItem.city},`
      } ${
        contactInfoItem.state
        && `${contactInfoItem.state},`
      } ${
        contactInfoItem.country
        && `${contactInfoItem.country},`
      } ${
        contactInfoItem.postal_code
        && `${contactInfoItem.postal_code}`
      }`;
      const editedData = { ...rowItem, location };
      customizedRow = [...customizedRow, editedData];
    });

    return _.orderBy(
      customizedRow,
      ['name'],
      ['asc'],
    );
  }
  return data;
};
