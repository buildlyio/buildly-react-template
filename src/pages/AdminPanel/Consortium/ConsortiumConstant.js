import moment from 'moment-timezone';
import _ from 'lodash';

export const MAPPING_TOOLTIP = 'Mapping Custodian to Organization(s)';

export const CONSORTIUM_TOOLTIP = 'Consortium(s) available in this Organization';

export const getMappingOrg = (allOrgs) => ([
  {
    name: 'name',
    label: 'Custodian Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'custody_org_uuid',
    label: 'Mapped Organization',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => {
        let returnValue = '-';
        if (value) {
          const org = _.find(allOrgs, { organization_uuid: value });
          if (org) {
            returnValue = org.name;
          }
        }
        return returnValue;
      },
    },
  },
]);

export const getConsortiumColumns = (timezone, dateFormat, timeFormat) => ([
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
          ? moment(value).tz(timezone).format(`${dateFormat} ${timeFormat}`)
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
          ? moment(value).tz(timezone).format(`${dateFormat} ${timeFormat}`)
          : value
      ),
    },
  },
]);
