import moment from 'moment-timezone';
import _ from 'lodash';

export const CONSORTIUM_TOOLTIP = 'Consortium(s) available in this Organization';

export const getColumns = (timezone) => ([
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
    name: 'create_date',
    label: 'Created At',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format('MMM DD YYYY, h:mm a')
          : value
      ),
    },
  },
  {
    name: 'edit_date',
    label: 'Last Edited At',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format('MMM DD YYYY, h:mm a')
          : value
      ),
    },
  },
]);
