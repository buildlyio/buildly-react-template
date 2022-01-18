import _ from 'lodash';
import moment from 'moment-timezone';

export const ReleaseEnv = ['Dev', 'Staging', 'Production'];

export const releaseColumns = [
  {
    name: 'description',
    label: 'Description',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value || '-',
    },
  },
  {
    name: 'product_name',
    label: 'Product',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value || '-',
    },
  },
  {
    name: 'environment',
    label: 'Environment',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value || '-',
    },
  },
  {
    name: 'edit_date',
    label: 'Last Edited At',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (value
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : '-'),
    },
  },
  {
    name: 'create_date',
    label: 'Created At',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (value
        ? moment(value).format('MMM DD YYYY, h:mm a')
        : '-'),
    },
  },
];

export const getReleasesData = (releases) => {
  let finalReleases = [];
  _.forEach(releases, (rel) => {
    if (rel) {
      const release = {
        ...rel,
        product_name: rel.release_product_relationship
          ? rel.release_product_relationship[0]?.name
          : '',
      };
      finalReleases = [...finalReleases, release];
    }
  });
  return finalReleases;
};
