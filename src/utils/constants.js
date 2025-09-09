/* eslint-disable no-nested-ternary */
import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';
import {
  SvgIcon, Tooltip, Typography, Grid,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  BatteryStdOutlined as BatteryIcon,
  BoltOutlined as ShockIcon,
  DeviceThermostatOutlined as TempIcon,
  LightModeOutlined as LightIcon,
  OpacityOutlined as HumidIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { extractCountry } from './utilMethods';
import { TIVE_GATEWAY_TIMES } from '@utils/mock';

/**
 * Formats a date/time value according to the given timezone and formats.
 *
 * @param {string} value - The date/time value to format.
 * @param {string} timezone - The timezone in which to format the time.
 * @param {string} dateFormat - The desired date format (e.g., 'YYYY-MM-DD').
 * @param {string} timeFormat - The desired time format (e.g., 'HH:mm:ss').
 * @returns {string} - The formatted date/time string or original value if invalid.
 */
const showValue = (value, timezone, dateFormat, timeFormat) => (
  value && value !== '-'
    ? moment(value).tz(timezone).format(`${dateFormat} ${timeFormat}`)
    : value
);

/**
 * Custom Tilt icon component rendered as an inline SVG.
 * Indicates device tilt or motion sensor events.
 *
 * @param {string} color - The color to apply to the SVG icon.
 * @returns {JSX.Element} - Rendered Tilt icon.
 */
export const TiltIcon = (color) => (
  <SvgIcon
    style={{ color }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      d="M7 5h14v14H5V5z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      transform="rotate(15, 12, 12)"
    />
  </SvgIcon>
);

/**
 * Custom Pressure icon rendered as inline SVG.
 * Represents pressure data or environmental sensor readings.
 *
 * @param {string} color - The color to apply to the icon.
 * @returns {JSX.Element} - Rendered Pressure icon.
 */
export const PressureIcon = (color) => (
  <SvgIcon
    style={{ color }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      d="M 12.007812 2.546875 C 5.386719 2.546875 0 7.621094 0 13.855469 C 0 16.527344 1.007812 19.117188 2.835938 21.15625 C 3.015625 21.355469 3.273438 21.472656 3.542969 21.472656 L 20.472656 21.472656 C 20.746094 21.472656 21.003906 21.355469 21.183594 21.15625 C 23.011719 19.117188 24.019531 16.527344 24.019531 13.855469 C 24.019531 7.621094 18.632812 2.546875 12.007812 2.546875 Z M 18.910156 16.0625 C 18.816406 16.015625 18.710938 15.988281 18.601562 15.988281 C 18.339844 15.988281 18.101562 16.136719 17.980469 16.375 C 17.898438 16.539062 17.886719 16.730469 17.945312 16.90625 C 18.003906 17.082031 18.128906 17.222656 18.292969 17.304688 L 20.769531 18.539062 C 20.574219 18.851562 20.363281 19.15625 20.132812 19.445312 L 20.039062 19.566406 L 3.980469 19.566406 L 3.886719 19.445312 C 3.632812 19.125 3.445312 18.855469 3.25 18.539062 L 5.726562 17.304688 C 5.890625 17.222656 6.015625 17.082031 6.074219 16.90625 C 6.132812 16.730469 6.121094 16.539062 6.039062 16.375 C 5.917969 16.136719 5.679688 15.988281 5.414062 15.988281 C 5.308594 15.988281 5.203125 16.015625 5.105469 16.0625 L 2.613281 17.304688 C 2.152344 16.210938 1.90625 15.035156 1.90625 13.855469 C 1.90625 13.421875 1.9375 12.996094 2 12.578125 L 4.40625 12.945312 C 4.441406 12.949219 4.476562 12.953125 4.511719 12.953125 C 4.851562 12.953125 5.148438 12.699219 5.199219 12.363281 C 5.253906 11.984375 4.996094 11.628906 4.617188 11.574219 L 2.3125 11.222656 C 2.804688 9.652344 3.726562 8.25 4.949219 7.136719 L 6.617188 8.851562 C 6.75 8.984375 6.925781 9.0625 7.117188 9.0625 C 7.296875 9.0625 7.46875 8.992188 7.597656 8.863281 C 7.734375 8.734375 7.808594 8.5625 7.808594 8.375 C 7.8125 8.191406 7.742188 8.015625 7.613281 7.882812 L 6.046875 6.273438 C 7.542969 5.25 9.351562 4.601562 11.316406 4.476562 L 11.316406 6.828125 C 11.316406 7.210938 11.625 7.523438 12.007812 7.523438 C 12.390625 7.523438 12.703125 7.210938 12.703125 6.828125 L 12.703125 4.476562 C 14.664062 4.601562 16.476562 5.25 17.972656 6.273438 L 16.40625 7.882812 C 16.277344 8.015625 16.207031 8.191406 16.210938 8.375 C 16.210938 8.5625 16.285156 8.734375 16.417969 8.863281 C 16.550781 8.992188 16.722656 9.0625 16.902344 9.0625 C 17.09375 9.0625 17.269531 8.988281 17.402344 8.851562 L 19.066406 7.136719 C 20.292969 8.25 21.214844 9.652344 21.707031 11.222656 L 19.402344 11.574219 C 19.023438 11.628906 18.761719 11.984375 18.820312 12.363281 C 18.871094 12.699219 19.167969 12.953125 19.503906 12.953125 C 19.539062 12.953125 19.578125 12.949219 19.609375 12.945312 L 22.019531 12.578125 C 22.078125 12.996094 22.113281 13.421875 22.113281 13.855469 C 22.113281 15.035156 21.867188 16.210938 21.402344 17.304688 Z M 18.910156 16.0625 "
    />
    <path
      d="M 12.40625 13.554688 L 10.226562 8.71875 C 10.179688 8.613281 10.0625 8.554688 9.945312 8.582031 C 9.8125 8.613281 9.734375 8.746094 9.765625 8.878906 L 11.007812 14.03125 C 10.699219 14.398438 10.589844 14.914062 10.753906 15.398438 C 11.007812 16.140625 11.816406 16.535156 12.558594 16.28125 C 13.300781 16.027344 13.695312 15.222656 13.441406 14.480469 C 13.277344 13.992188 12.871094 13.65625 12.40625 13.554688 Z M 12.40625 13.554688 "
    />
  </SvgIcon>
);

/**
 * Custom "Flight Safe" icon component indicating safe for air travel.
 * Typically shown when tracking devices are within safety limits for aviation.
 *
 * @returns {JSX.Element} - Rendered green airplane icon.
 */
export const FlightSafeIcon = () => (
  <SvgIcon
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      d="M15.02 0.437234L10.9633 4.49396L1.81133 2.61164C1.49977 2.48183 1.11898 2.66573 0.96753 2.77391L0.221096 3.52035C-0.246239 3.88383 0.134552 4.19106 0.383365 4.29924L7.78284 8.16125L4.34273 12.2829L1.9736 11.6987C1.68801 11.5689 1.42189 11.7528 1.32453 11.861L0.902623 12.2829C0.513177 12.6464 0.870169 12.9536 1.09735 13.0618L3.01212 14.0029L2.16832 15.009C2.1164 15.7619 2.77413 15.7554 3.10949 15.6581L3.92083 14.9116L4.99181 17.1185C5.17355 17.3262 5.45698 17.205 5.57598 17.1185L5.99788 16.6642C6.30943 16.4824 6.27914 16.0692 6.22505 15.8853L5.80315 13.5486L9.11344 10.79V8.64805C9.06152 7.81724 10.0654 7.63117 10.5739 7.64198C12.3653 7.53813 13.5596 6.58183 14.3385 6.05175L15.8314 4.59132L17.162 3.26072C17.6921 2.76309 18.5056 1.52768 17.519 0.567049C16.5324 -0.393584 15.4419 0.0802418 15.02 0.437234Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.89229 8.45329C10.7577 8.45329 12.904 8.14173 14.5656 6.89551C15.1174 7.41477 16.8114 8.45329 19.1741 8.45329V12.0557C19.1957 13.581 18.3043 17.0341 14.5656 18.6438C13.5379 18.1678 11.2748 16.6381 10.444 14.3274C10.0762 13.0726 9.45091 10.1409 9.89229 8.45329ZM16.4155 10.5953L13.8516 13.1267L12.878 12.153C12.6617 12.0016 12.1835 11.7636 12.0018 12.0232C11.82 12.2829 11.9261 12.629 12.0018 12.7697L13.6245 14.3599C13.6514 14.3868 13.6785 14.4082 13.7057 14.4248C13.8881 14.5368 14.0684 14.4353 14.1437 14.3599L17.1619 11.3417C17.2809 11.2119 17.4475 10.8809 17.1619 10.5953C16.8763 10.3097 16.5453 10.4763 16.4155 10.5953Z"
      fill="#8AE983"
    />
  </SvgIcon>
);

/**
 * Custom "Flight Unsafe" icon component indicating unsafe for air travel.
 * Displayed when a device violates airline safety conditions.
 *
 * @returns {JSX.Element} - Rendered warning airplane icon.
 */
export const FlightUnsafeIcon = () => (
  <SvgIcon
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      d="M14.9835 0.442921L10.9367 4.55242L1.80693 2.64561C1.49613 2.51411 1.11626 2.70041 0.965177 2.80999L0.220558 3.56614C-0.245641 3.93435 0.134225 4.24558 0.382433 4.35516L7.76392 8.2674L4.33217 12.4427L1.9688 11.8509C1.68391 11.7194 1.41843 11.9057 1.32131 12.0153L0.900428 12.4427C0.511929 12.8109 0.868053 13.1221 1.09468 13.2317L3.0048 14.1851L2.16305 15.2042C2.11125 15.967 2.76738 15.9604 3.10193 15.8618L3.9113 15.1056L4.97967 17.3412C5.16097 17.5516 5.44371 17.4288 5.56242 17.3412L5.98329 16.8809C6.29409 16.6968 6.26388 16.2782 6.20992 16.0919L5.78904 13.7248L9.09128 10.9304V8.76054C9.03948 7.91892 10.0409 7.73043 10.5482 7.74139C12.3353 7.63618 13.5266 6.66744 14.3036 6.13047L15.7929 4.65105L17.1203 3.30313C17.6491 2.79903 18.4606 1.54755 17.4764 0.574425C16.4922 -0.398704 15.4044 0.0812856 14.9835 0.442921Z"
      fill="black"
    />
    <path
      d="M14.5722 6.73889C12.9146 8.00133 10.7736 8.31694 9.91023 8.31694C9.46993 10.0265 10.0937 12.9963 10.4606 14.2675C11.2894 16.6083 13.547 18.1578 14.5722 18.64C18.3018 17.0093 19.191 13.5113 19.1695 11.9662V8.31694C16.8126 8.31694 15.1226 7.26491 14.5722 6.73889Z"
      fill="#D05162"
    />
    <path
      d="M11.7109 9.91016L16.9809 14.4688M17.176 9.91016L11.7109 14.4688"
      stroke="white"
      strokeLinecap="round"
    />
  </SvgIcon>
);

/**
 * Returns column configuration for a generic entity with name, creation date, and last edited date.
 *
 * @param {string} timezone - The user's timezone for formatting dates.
 * @param {string} dateFormat - Preferred display format for date.
 * @param {string} timeFormat - Preferred display format for time.
 * @returns {Array<Object>} Array of column definitions for use in a data table.
 */
export const getColumns = (timezone, dateFormat, timeFormat, t) => ([
  {
    name: 'name',
    label: t('generic.name'),
    options: {
      sort: true, // Enable sorting
      sortThirdClickReset: true, // Third click on column header removes sort
      filter: true, // Enable column filtering
    },
  },
  {
    name: 'create_date',
    label: t('generic.createdAt'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat), // Format date using user settings
    },
  },
  {
    name: 'edit_date',
    label: t('generic.lastEditedAt'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat), // Format date using user settings
    },
  },
]);

/**
 * Returns column configuration for tracker type entities with non-translatable name.
 *
 * @param {string} timezone - The user's timezone for formatting dates.
 * @param {string} dateFormat - Preferred display format for date.
 * @param {string} timeFormat - Preferred display format for time.
 * @returns {Array<Object>} Array of column definitions for tracker type table.
 */
export const getTrackerTypeColumns = (timezone, dateFormat, timeFormat, t) => ([
  {
    name: 'name',
    label: t('generic.name'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      setCellProps: () => ({
        className: 'notranslate', // Prevents automatic translation for this column
      }),
    },
  },
  {
    name: 'create_date',
    label: t('generic.createdAt'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat),
    },
  },
  {
    name: 'edit_date',
    label: t('generic.lastEditedAt'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat),
    },
  },
]);

/**
 * Returns column configuration for product-related data.
 *
 * @param {string} timezone - The user's timezone for formatting dates.
 * @param {string} uomw - Unit of Measure to display.
 * @param {string} dateFormat - Preferred display format for date.
 * @param {string} timeFormat - Preferred display format for time.
 * @returns {Array<Object>} Array of column definitions for product table.
 */
export const getProductColumns = (timezone, uomw, dateFormat, timeFormat, t) => ([
  {
    name: 'name',
    label: t('generic.name'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'description',
    label: t('product.description'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'value',
    label: t('product.value'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => _.round(_.toNumber(value), 2), // Convert to number and round to 2 decimals
    },
  },
  {
    name: 'gross_weight',
    label: t('product.grossWeight'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => _.round(_.toNumber(value), 2), // Convert to number and round to 2 decimals
    },
  },
  {
    name: 'name',
    label: t('product.unitOfMeasure'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: () => t(`orgSettings.unit.${uomw}`), // Always show passed-in unit of measure value
    },
  },
  {
    name: 'create_date',
    label: t('generic.createdAt'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat),
    },
  },
  {
    name: 'edit_date',
    label: t('generic.lastEditedAt'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat),
    },
  },
]);

/**
 * Returns column configuration for mapping custodians to organizations.
 * @param {Array} allOrgs - List of all organizations for lookup.
 * @returns {Array} Column definitions for the data table.
 */
export const getMappingOrg = (allOrgs, t) => ([
  {
    name: 'name',
    label: t('mappingOrg.custodianName'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'custody_org_uuid',
    label: t('mappingOrg.mappedOrganization'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      setCellProps: () => ({
        className: 'notranslate', // Prevents translation of cell content
      }),
      // Custom render: displays the mapped org's name based on UUID
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

/**
 * Returns columns for displaying consortium information with formatted dates.
 */
export const getConsortiumColumns = (timezone, dateFormat, timeFormat, t) => ([
  {
    name: 'name',
    label: t('consortium.name'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'create_date',
    label: t('consortium.createdAt'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Format the date using timezone and format strings
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format(`${dateFormat} ${timeFormat}`)
          : value
      ),
    },
  },
  {
    name: 'edit_date',
    label: t('consortium.lastEditedAt'),
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

/**
 * Column definitions for the custodians data table.
 */
export const custodianColumns = (t) => [
  {
    name: 'name',
    label: t('custodianColumns.name'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'abbrevation',
    label: t('custodianColumns.abbrevation'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'type',
    label: t('custodianColumns.type'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'location',
    label: t('custodianColumns.location'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Applies custom styling for long content
      setCellProps: () => ({
        style: { maxWidth: '300px', wordWrap: 'break-word' },
      }),
    },
  },
  {
    name: 'custodian_glns',
    label: t('custodianColumns.gln'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value || '-', // Shows "-" if no value is present
    },
  },
];

/**
 * Retrieves a matching contact info object from a list based on custodian's contact data.
 */
export const getUniqueContactInfo = (rowItem, contactInfo) => {
  let obj = '';
  _.forEach(contactInfo, (info) => {
    if (_.isEqual(rowItem.contact_data[0], info.url)) {
      obj = info;
    }
  });
  return obj;
};

/**
 * Formats custodian rows by merging location and type data from reference lists.
 */
export const getCustodianFormattedRow = (data, contactInfo, type = []) => {
  if (data && data.length && contactInfo && contactInfo.length) {
    let customizedRow = [];
    _.forEach(data, (rowItem) => {
      const contactInfoItem = getUniqueContactInfo(rowItem, contactInfo);
      // Construct full location string from parts
      const location = `${contactInfoItem.address1
        && `${contactInfoItem.address1},`} ${contactInfoItem.address2
        && `${contactInfoItem.address2},`} ${contactInfoItem.city
        && `${contactInfoItem.city},`} ${contactInfoItem.state
        && `${contactInfoItem.state},`} ${contactInfoItem.country
        && `${contactInfoItem.country},`} ${contactInfoItem.postal_code
        && `${contactInfoItem.postal_code}`}`;
      let editedData = { ...rowItem, location };
      // Map type name from URL
      const custType = _.find(type, { url: rowItem.custodian_type });
      if (custType) {
        editedData = { ...editedData, type: custType.name };
      }
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

/**
 * Formats custody data rows by adding load ID and resolving custodian names.
 */
export const getFormattedCustodyRows = (custodyData, custodianData) => {
  let customizedRows = [];
  let counter = 2;
  if (custodyData && custodianData) {
    const custodyLength = custodyData.length;
    _.forEach(custodyData, (custody) => {
      const editedCustody = { ...custody };
      // Assign load_id if not already present
      if (!custody.load_id) {
        if (custody.first_custody) {
          editedCustody.load_id = 1;
        } else if (custody.last_custody) {
          editedCustody.load_id = custodyLength;
        } else {
          editedCustody.load_id = counter;
          counter += 1;
        }
      }

      // Find and append custodian name/data
      _.forEach(custodianData, (custodian) => {
        if (_.isEqual(custody.custodian[0], custodian.url)) {
          editedCustody.custodian_name = custodian.name;
          editedCustody.custodian_data = custodian;
        }
      });

      customizedRows = [...customizedRows, editedCustody];
    });
  }

  return _.orderBy(
    customizedRows,
    ['custodian_name'],
    ['asc'],
  );
};

/**
 * Returns column definitions for displaying item data, with optional currency unit.
 */
export const itemColumns = (currUnit, t) => ([
  {
    name: 'name',
    label: t('itemColumns.itemName'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'number_of_units',
    label: t('itemColumns.numberOfUnits'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'item_type_value',
    label: t('itemColumns.itemType'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'value',
    label: t('itemColumns.value'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Append currency unit to value
      customBodyRender: (value) => (
        value && value !== '-'
          ? `${value} ${currUnit}`
          : value
      ),
    },
  },
  {
    name: 'gross_weight',
    label: t('itemColumns.grossWeight'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? `${_.round(_.toNumber(value), 2)}`
          : value
      ),
    },
  },
  {
    name: 'unitMeasure',
    label: t('itemColumns.unitOfMeasure'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (t(`orgSettings.unit.${value}`)),
    },
  },
]);

/**
 * Formats a list of shipment items by enriching them with additional display data
 * like item type name and unit of measure (if weight-based).
 *
 * @param {Array} data - Raw item data.
 * @param {Array} itemTypeList - List of item types with metadata (name, URL).
 * @param {Array} unitOfMeasure - Units of measure data.
 * @returns {Array} Formatted and sorted item data.
 */
export const getItemFormattedRow = (data, itemTypeList, unitOfMeasure) => {
  if (data && itemTypeList) {
    let formattedData = [];
    // Find the unit of measure for weight, if available.
    const uomw = _.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'weight'))) || '';
    const uom = uomw ? uomw.unit_of_measure : '';

    // For each item, enhance it with readable type name and unit.
    _.forEach(data, (element) => {
      let editedData = element;
      _.forEach(itemTypeList, (type) => {
        if (_.isEqual(type.url, element.item_type)) {
          editedData = {
            ...editedData,
            item_type_value: type.name,
            unitMeasure: uom,
          };
        }
      });
      formattedData = [...formattedData, editedData];
    });

    // Sort the formatted data by creation date in ascending order.
    return _.orderBy(
      formattedData,
      (dataRow) => moment(dataRow.create_date),
      ['asc'],
    );
  }
  return data;
};

/**
 * Table column definitions for the shipment overview table.
 */
export const SHIPMENT_OVERVIEW_COLUMNS = [
  { name: 'name', label: 'Shipment Name' },
  { name: 'status', label: 'Shipment Status' },
  { name: 'estimated_time_of_departure', label: 'Estimated Pickup Time' },
  { name: 'actual_time_of_departure', label: 'Actual Pickup Time' },
  { name: 'estimated_time_of_arrival', label: 'Estimated Arrival Time' },
  { name: 'actual_time_of_arrival', label: 'Actual Arrival Time' },
  { name: 'had_alert', label: 'Had Alerts(s)' },
  { name: 'tracker', label: 'Tracker' },
  { name: 'custodian_name', label: 'Custodian Name' },
  { name: 'custody_info', label: 'Custody Details (Current)' },
];

/**
 * Returns a corresponding icon wrapped in a tooltip for the given sensor item.
 *
 * @param {Object} item - Sensor data (id, color, title).
 * @param {Function} t - Translation function (optional).
 * @returns {JSX.Element|null} Sensor icon component.
 */
export const getIcon = (item, t) => {
  const { id, color, title } = item;

  const label = _.lowerCase(title) || id;
  const tooltip = t ? t(label) : label;

  const iconProps = { style: { fill: color, width: '24px', height: '24px' } };

  switch (id) {
    case 'temperature':
    case 'probe':
      return (
        <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
          <TempIcon {...iconProps} />
        </Tooltip>
      );

    case 'light':
      return (
        <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
          <LightIcon {...iconProps} />
        </Tooltip>
      );

    case 'shock':
      return (
        <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
          <ShockIcon {...iconProps} />
        </Tooltip>
      );

    case 'tilt':
      return (
        <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
          <TiltIcon {...iconProps} />
        </Tooltip>
      );

    case 'humidity':
      return (
        <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
          <HumidIcon {...iconProps} />
        </Tooltip>
      );

    case 'battery':
      return (
        <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
          <BatteryIcon {...iconProps} />
        </Tooltip>
      );

    case 'pressure':
      return (
        <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
          <PressureIcon {...iconProps} />
        </Tooltip>
      );

    case 'time':
      return (
        <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
          <AccessTimeIcon style={{ fill: color }} />
        </Tooltip>
      );

    default:
      return null;
  }
};

/**
 * Returns a sensor icon and its count in parentheses.
 *
 * @param {Object} item - Sensor data (id, color, title, count).
 * @param {Function} t - Translation function (optional).
 * @returns {JSX.Element|null} Sensor icon with count.
 */
export const getIconWithCount = (item, t) => {
  const {
    id, color, title, count,
  } = item;

  const label = _.lowerCase(title) || id;
  const tooltip = t ? t(label) : label;

  const iconProps = { style: { fill: color } };

  switch (id) {
    case 'temperature':
    case 'probe':
      return (
        <>
          <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
            <TempIcon {...iconProps} />
          </Tooltip>
          {`(${count})`}
        </>
      );

    case 'light':
      return (
        <>
          <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
            <LightIcon {...iconProps} />
          </Tooltip>
          {`(${count})`}
        </>
      );

    case 'shock':
      return (
        <>
          <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
            <ShockIcon {...iconProps} />
          </Tooltip>
          {`(${count})`}
        </>
      );

    case 'tilt':
      return (
        <>
          <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
            <TiltIcon {...iconProps} />
          </Tooltip>
          {`(${count})`}
        </>
      );

    case 'humidity':
      return (
        <>
          <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
            <HumidIcon {...iconProps} />
          </Tooltip>
          {`(${count})`}
        </>
      );

    case 'battery':
      return (
        <>
          <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
            <BatteryIcon {...iconProps} />
          </Tooltip>
          {`(${count})`}
        </>
      );

    case 'pressure':
      return (
        <>
          <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
            <PressureIcon {...iconProps} />
          </Tooltip>
          {`(${count})`}
        </>
      );

    case 'time':
      return (
        <>
          <Tooltip title={<span className="notranslate">{tooltip}</span>} placement="right">
            <AccessTimeIcon {...iconProps} />
          </Tooltip>
          {`(${count})`}
        </>
      );

    default:
      return null;
  }
};

/**
 * Enriches raw shipment data with related custodian, contact, and tracker info.
 *
 * @param {Array} shipmentData - List of shipments.
 * @param {Array} custodianData - List of custodians.
 * @param {Array} custodyData - List of custody records.
 * @param {Array} contactData - List of contacts related to custodians.
 * @param {Array} gatewayData - Gateway tracker metadata.
 * @returns {Array} Enriched and sorted shipment list.
 */
export const getShipmentOverview = (
  shipmentData,
  custodianData,
  custodyData,
  contactData,
  gatewayData,
) => {
  let shipmentList = [];
  let custodyRows = [];
  // Prepare custody row data if custody and custodian info exists.
  if (
    custodyData
    && custodianData
    && custodyData.length
    && custodianData.length
  ) {
    custodyRows = getFormattedCustodyRows(custodyData, custodianData);
  }

  _.forEach(shipmentData, (shipment) => {
    const editedShipment = { ...shipment };
    let custodyInfo = [];
    let custodianName = '';
    let contactInfo = [];

    // Match custody info with this shipment.
    if (custodyRows.length > 0) {
      _.forEach(custodyRows, (custody) => {
        const editedCustody = { ...custody };
        if (_.isEqual(custody.shipment_id, shipment.shipment_uuid) && custody.custodian_data) {
          // Aggregate custodian names.
          custodianName = custodianName
            ? `${custodianName}, ${custody.custodian_data.name}`
            : custody.custodian_data.name;
          // Get contact info for the custodian.
          _.forEach(contactData, (contact) => {
            const editedContact = { ...contact };
            if (_.isEqual(custody.custodian_data.contact_data[0], contact.url)) {
              editedContact.name = [
                contact.first_name,
                contact.middle_name,
                contact.last_name,
              ].join(' ');
              editedContact.address = [
                contact.address1,
                contact.address2,
                contact.city,
                contact.postal_code,
                contact.state,
                contact.country,
              ].join('\n');
              contactInfo = [...contactInfo, editedContact];
            }
          });
          // Mark custody type for display.
          if (custody.has_current_custody) {
            editedCustody.custody_type = 'Current';
          } else if (custody.first_custody) {
            editedCustody.custody_type = 'First';
          } else if (custody.last_custody) {
            editedCustody.custody_type = 'Last';
          } else {
            editedCustody.custody_type = 'NA';
          }
          custodyInfo = [...custodyInfo, editedCustody];
        }
      });
    }
    // Attach the enriched fields.
    editedShipment.custodian_name = custodianName;
    editedShipment.custody_info = custodyInfo;
    editedShipment.contact_info = contactInfo;

    // Determine shipment type based on status.
    switch (_.lowerCase(shipment.status)) {
      case 'planned':
      case 'en route':
      case 'arrived':
        editedShipment.type = 'Active';
        break;

      case 'completed':
        editedShipment.type = 'Completed';
        break;

      case 'cancelled':
        editedShipment.type = 'Cancelled';
        break;

      case 'damaged':
        editedShipment.type = 'Damaged';
        break;

      case 'battery depleted':
        editedShipment.type = 'Battery Depleted';
        break;

      default:
        break;
    }

    // Match the shipment to tracker devices by IMEI.
    if (!_.isEmpty(gatewayData)) {
      const gateways = _.filter(gatewayData, (gateway) => (
        _.includes(editedShipment.gateway_imei, _.toString(gateway.imei_number))
      ));
      editedShipment.tracker = (!_.isEmpty(gateways) && _.toString(_.join(_.uniq(_.map(gateways, 'name')), ', '))) || 'N/A';
    }

    shipmentList = [...shipmentList, editedShipment];
  });

  // Sort shipments by pickup time and creation date (descending).
  return _.orderBy(
    shipmentList,
    (shipment) => moment(shipment.estimated_time_of_departure)
      && moment(shipment.create_date),
    ['desc'],
  );
};

/**
 * Processes sensor reports and alerts to generate map markers and time-series graph data.
 * It applies business logic for evaluating alerts, thresholds, and visual states (like color coding).
 *
 * @param {Array} sensorReports - List of raw sensor report data.
 * @param {Array} alerts - List of alerts associated with sensor reports.
 * @param {String} timezone - Timezone used to format dates.
 * @param {Array} unitOfMeasure - Measurement units for temperature, date, time, etc.
 * @param {String} maxColor - Color used for max excursions.
 * @param {String} minColor - Color used for min excursions.
 * @param {Object} selectedShipment - Shipment object including thresholds and suppression settings.
 *
 * @returns {{
*   sensorReportInfo: Array,     // Full processed reports for display.
*   markersToSet: Array,         // Map marker objects with sensor data.
*   graphs: Object               // Chart data for each sensor type.
* }}
*/
export const processReportsAndMarkers = (
  sensorReports, alerts, timezone, unitOfMeasure, maxColor, minColor, selectedShipment,
) => {
  // Initialize containers for results and graph data per sensor type
  let sensorReportInfo = [];
  let temperatureData = [];
  let lightData = [];
  let shockData = [];
  let tiltData = [];
  let humidityData = [];
  let batteryData = [];
  let pressureData = [];
  let probeData = [];
  let markersToSet = [];
  // Extract unit formats
  const dateFormat = _.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'date'))).unit_of_measure;
  const timeFormat = _.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'time'))).unit_of_measure;
  const tempMeasure = _.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))).unit_of_measure;
  // Sort thresholds over time (to determine which were active during report time)
  const minExcursionTempArray = _.orderBy(selectedShipment.min_excursion_temp, 'set_at');
  const maxExcursionTempArray = _.orderBy(selectedShipment.max_excursion_temp, 'set_at');
  const minExcursionHumArray = _.orderBy(selectedShipment.min_excursion_humidity, 'set_at');
  const maxExcursionHumArray = _.orderBy(selectedShipment.max_excursion_humidity, 'set_at');
  const maxShockArray = _.orderBy(selectedShipment.shock_threshold, 'set_at');
  const maxLightArray = _.orderBy(selectedShipment.light_threshold, 'set_at');

  // Process each report
  if (!_.isEmpty(sensorReports)) {
    _.forEach(sensorReports, (report) => {
      try {
        const { report_entry } = report;
        let marker = {};
        let color = 'green'; // Default color (no alert)
        let allAlerts = [];
        // Convert timestamp using timezone and selected formats
        const date = moment(report.activation_date).tz(timezone).format(dateFormat);
        const time = moment(report.activation_date).tz(timezone).format(timeFormat);
        const dateTime = moment(report.activation_date).tz(timezone).format(`${dateFormat} ${timeFormat}`);

        // Choose temperature value based on unit
        const temperature = _.isEqual(_.toLower(tempMeasure), 'fahrenheit')
          ? report_entry.report_temp_fah
          : report_entry.report_temp_cel
            ? _.round(report_entry.report_temp_cel, 2)
            : report_entry.report_temp_cel;
        const probe = _.isEqual(_.toLower(tempMeasure), 'fahrenheit')
          ? report_entry.report_probe_fah
          : report_entry.report_probe_cel
            ? _.round(report_entry.report_probe_cel, 2)
            : report_entry.report_probe_cel;

        // Set final thresholds based on when the report was generated
        let finalMinTempValue = minExcursionTempArray[0].value;
        let finalMaxTempValue = maxExcursionTempArray[0].value;
        let finalMinHumValue = minExcursionHumArray[0].value;
        let finalMaxHumValue = maxExcursionHumArray[0].value;
        let finalShockValue = maxShockArray[0].value;
        let finalLightValue = maxLightArray[0].value;

        // Evaluate if different threshold values were in effect at the report time
        if (_.size(minExcursionTempArray) > 1) {
          _.forEach(minExcursionTempArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(minExcursionTempArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalMinTempValue = _.nth(minExcursionTempArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalMinTempValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(minExcursionTempArray))
              ) {
                finalMinTempValue = data.value;
              }
            }
          });
        }

        if (_.size(maxExcursionTempArray) > 1) {
          _.forEach(maxExcursionTempArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(maxExcursionTempArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalMaxTempValue = _.nth(maxExcursionTempArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalMaxTempValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(maxExcursionTempArray))
              ) {
                finalMaxTempValue = data.value;
              }
            }
          });
        }

        if (_.size(minExcursionHumArray) > 1) {
          _.forEach(minExcursionHumArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(minExcursionHumArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalMinHumValue = _.nth(minExcursionHumArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalMinHumValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(minExcursionHumArray))
              ) {
                finalMinHumValue = data.value;
              }
            }
          });
        }

        if (_.size(maxExcursionHumArray) > 1) {
          _.forEach(maxExcursionHumArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(maxExcursionHumArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalMaxHumValue = _.nth(maxExcursionHumArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalMaxHumValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(maxExcursionHumArray))
              ) {
                finalMaxHumValue = data.value;
              }
            }
          });
        }

        if (_.size(maxShockArray) > 1) {
          _.forEach(maxShockArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(maxShockArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalShockValue = _.nth(maxShockArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalShockValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(maxShockArray))
              ) {
                finalShockValue = data.value;
              }
            }
          });
        }

        if (_.size(maxLightArray) > 1) {
          _.forEach(maxLightArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(maxLightArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalLightValue = _.nth(maxLightArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalLightValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(maxLightArray))
              ) {
                finalLightValue = data.value;
              }
            }
          });
        }

        // Get all alerts up to the current report
        const preAlerts = _.orderBy(
          _.filter(alerts, (alert) => _.lte(_.toNumber(alert.report_id), report.id)),
          'create_date',
        );
        // Track recovered alerts and their types
        const recoveryAlerts = _.filter(preAlerts, (pa) => !!pa.recovered_alert_id);
        const recoveredIDs = _.uniq(_.map(recoveryAlerts, 'recovered_alert_id'));
        const recoveredTypeDateTime = _.map(recoveryAlerts, (ra) => (
          { parameter_type: ra.parameter_type, create_date: ra.create_date }
        ));
        // Filter active alerts (non-recovered)
        const alertsTillNow = _.filter(preAlerts, (alert) => {
          const found = _.find(recoveredTypeDateTime, (radt) => (
            _.isEqual(radt.parameter_type, alert.parameter_type)
            && !!_.gt(radt.create_date, alert.create_date)
          ));

          return !found && !alert.recovered_alert_id
            && !_.includes(recoveredIDs, _.toString(alert.id));
        });

        // Only keep latest alerts per parameter
        let uniqueAlerts = [];
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'temperature' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'temperature' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'humidity' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'humidity' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'shock' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'shock' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'light' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'light' })];
        }
        uniqueAlerts = _.orderBy(uniqueAlerts, 'create_date');

        // Check if the current report is a recovery
        const exactAlertID = _.filter(preAlerts, { report_id: _.toString(report.id) });
        _.forEach(exactAlertID, (alert) => {
          if (alert.recovered_alert_id) {
            _.remove(uniqueAlerts, { parameter_type: alert.parameter_type });
            allAlerts = [...allAlerts, { id: alert.parameter_type, color, title: `${_.capitalize(alert.parameter_type)} Excursion Recovered` }];
          }
        });

        // Build alerts for this report and apply appropriate color
        _.forEach(uniqueAlerts, (alert) => {
          if (alert) {
            let alertColor = '';
            let title = '';
            const found = _.find(allAlerts, { id: alert.parameter_type });
            if (found) {
              _.remove(allAlerts, { id: alert.parameter_type });
            }

            switch (true) {
              case _.includes(_.toLower(alert.alert_type), 'max'):
              case _.includes(_.toLower(alert.alert_type), 'shock'):
              case _.includes(_.toLower(alert.alert_type), 'light'):
                color = maxColor;
                alertColor = maxColor;
                title = `Maximum ${_.capitalize(alert.parameter_type)} Excursion`;
                break;

              case _.includes(_.toLower(alert.alert_type), 'min'):
                if (color !== maxColor) {
                  color = minColor;
                }
                alertColor = minColor;
                title = `Minimum ${_.capitalize(alert.parameter_type)} Excursion`;
                break;

              default:
                break;
            }

            allAlerts = [...allAlerts, { id: alert.parameter_type, color: alertColor, title }];
          }
        });

        // Prepare the marker object if GPS data is valid
        if (report_entry.report_location !== null
          && report_entry.report_latitude !== null
          && report_entry.report_longitude !== null) {
          const latitude = report_entry.report_latitude
            || report_entry.report_location.latitude;
          const longitude = report_entry.report_longitude
            || report_entry.report_location.longitude;
          if (
            (latitude >= -90 && latitude <= 90)
            && (longitude >= -180 && longitude <= 180)
            && dateTime && date && time
          ) {
            marker = {
              lat: latitude,
              lng: longitude,
              location: report_entry.report_location,
              label: 'Clustered',
              temperature,
              light: report_entry.report_light,
              shock: report_entry.report_shock,
              tilt: report_entry.report_tilt,
              humidity: report_entry.report_humidity,
              battery: report_entry.report_battery,
              pressure: report_entry.report_pressure,
              probe,
              color,
              allAlerts,
              date,
              time,
              timestamp: dateTime,
            };

            markersToSet = [...markersToSet, marker];
          }
        } else {
          // Fallback marker if GPS is missing
          marker = {
            lat: '*',
            lng: '*',
            location: 'N/A',
            label: 'Clustered',
            temperature,
            light: report_entry.report_light,
            shock: report_entry.report_shock,
            tilt: report_entry.report_tilt,
            humidity: report_entry.report_humidity,
            battery: report_entry.report_battery,
            pressure: report_entry.report_pressure,
            probe,
            color,
            allAlerts,
            date,
            time,
            timestamp: dateTime,
          };
        }

        sensorReportInfo = [...sensorReportInfo, marker];
        // Add data to chart only if the timestamp doesn't exist
        const graphPoint = _.find(temperatureData, {
          x: dateTime,
        });

        if (!graphPoint) {
          temperatureData = [
            ...temperatureData,
            {
              x: dateTime,
              y: temperature,
              min: _.includes(selectedShipment.alerts_to_suppress, 'temperature') ? null : finalMinTempValue,
              max: _.includes(selectedShipment.alerts_to_suppress, 'temperature') ? null : finalMaxTempValue,
            },
          ];
          lightData = [
            ...lightData,
            {
              x: dateTime,
              y: report_entry.report_light,
              max: _.includes(selectedShipment.alerts_to_suppress, 'light') ? null : finalLightValue,
            },
          ];
          shockData = [
            ...shockData,
            {
              x: dateTime,
              y: report_entry.report_shock,
              max: _.includes(selectedShipment.alerts_to_suppress, 'shock') ? null : finalShockValue,
            },
          ];
          tiltData = [
            ...tiltData,
            {
              x: dateTime,
              y: (report_entry.report_tilt && report_entry.report_tilt.roll) || null,
              pitch: (report_entry.report_tilt && report_entry.report_tilt.pitch) || null,
            },
          ];
          humidityData = [
            ...humidityData,
            {
              x: dateTime,
              y: report_entry.report_humidity,
              min: _.includes(selectedShipment.alerts_to_suppress, 'humidity') ? null : finalMinHumValue,
              max: _.includes(selectedShipment.alerts_to_suppress, 'humidity') ? null : finalMaxHumValue,
            },
          ];
          batteryData = [
            ...batteryData,
            {
              x: dateTime,
              y: report_entry.report_battery,
            },
          ];
          pressureData = [
            ...pressureData,
            {
              x: dateTime,
              y: report_entry.report_pressure,
            },
          ];
          probeData = [
            ...probeData,
            {
              x: dateTime,
              y: probe,
            },
          ];
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e); // Catch malformed report data
      }
    });
  }

  return {
    sensorReportInfo,
    markersToSet: _.orderBy(
      markersToSet,
      (item) => moment(item.timestamp),
      ['desc'],
    ),
    graphs: {
      temperature: temperatureData,
      light: lightData,
      shock: shockData,
      tilt: tiltData,
      humidity: humidityData,
      battery: batteryData,
      pressure: pressureData,
      probe: probeData,
    },
  };
};

// Function to return the unit for temperature based on the provided unit of measure
export const tempUnit = (uomt) => {
  let unit = '';
  // Check if the unit of measure type exists
  if (uomt) {
    // If the unit of measure is Fahrenheit, set the unit to '°F'
    if (_.isEqual(_.toLower(uomt.unit_of_measure), 'fahrenheit')) {
      unit = '°F';
      // If the unit of measure is Celsius, set the unit to '°C'
    } else if (_.isEqual(_.toLower(uomt.unit_of_measure), 'celsius')) {
      unit = '°C';
    }
  }

  return unit; // Return the corresponding unit of measure
};

// Defines available report types with respective units of measure
export const REPORT_TYPES = (unitOfMeasure, enabledTilt) => {
  let cols = [
    { id: 'temperature', unit: tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature')))) },
    { id: 'humidity', unit: '%' },
    { id: 'shock', unit: 'G' },
    { id: 'light', unit: 'LUX' },
  ];
  if (enabledTilt) {
    cols = [...cols, { id: 'tilt', unit: '°' }];
  }
  cols = [...cols, { id: 'battery', unit: '%' }];
  return cols;
};

// Defines marker data types with their corresponding units
export const MARKER_DATA = (unitOfMeasure) => ([
  { id: 'temperature', unit: tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature')))) },
  { id: 'shock', unit: 'G' },
  { id: 'humidity', unit: '%' },
  { id: 'light', unit: 'LUX' },
]);

// Generates the sensor report columns with custom cell rendering logic for different data types
export const SENSOR_REPORT_COLUMNS = (unitOfMeasure, selectedShipment, enabled_tilt, t) => {
  // Helper function to determine cell styles based on the presence of null or undefined values
  const getCellStyle = (tableMeta) => ({
    fontWeight: (
      _.some(
        _.range(5, 8), (i) => _.isEqual(tableMeta.rowData[i], null)
          || _.isEqual(tableMeta.rowData[i], undefined),
      )
        ? '700' : '400'), // Set font weight to bold if the value is null or undefined
    fontStyle: (
      _.some(
        _.range(5, 8), (i) => _.isEqual(tableMeta.rowData[i], null)
          || _.isEqual(tableMeta.rowData[i], undefined),
      )
        ? 'italic' : 'normal'), // Set font style to italic if the value is null or undefined
  });

  // Return the columns configuration for sensor data in the report
  return ([
    {
      name: 'allAlerts',
      label: t('sensorReport.columns.alerts'),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        // Custom render function for the alerts column to display sensor icons
        customBodyRender: (value) => (
          !_.isEmpty(value)
            ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {_.map(value, (item, idx) => (
                  <div key={`sensor-icon-${idx}-${item.id}`}>
                    {getIcon(item, t || null)}
                    {' '}
                  </div>
                ))}
              </div>
            ) : ''
        ),
      },
    },
    {
      name: 'timestamp',
      label: t('sensorReport.columns.dateTime'),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        // Custom render function for the timestamp column
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {value}
          </div>
        ),
      },
    },
    {
      name: 'location',
      label: t('sensorReport.columns.location'),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellProps: () => ({
          style: { maxWidth: '300px', wordWrap: 'break-word' },
          className: 'reportingSensorLeftHeader',
        }),
        // Custom render function for the location column
        customBodyRender: (value) => (
          <div>
            {!_.isNil(value) && !_.isEqual(value, 'Error retrieving address')
              ? value : 'N/A'}
          </div>
        ),
      },
    },
    // Latitude column with custom rendering based on location
    {
      name: 'lat',
      label: t('sensorReport.columns.latitude'),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellProps: () => ({
          style: { maxWidth: '300px', wordWrap: 'break-word' },
          className: 'reportingSensorLeftHeader',
        }),
        customBodyRender: (value, tableMeta) => {
          const locationValue = tableMeta.rowData[tableMeta.columnIndex - 1];
          return (
            <div>
              {!_.isEqual(locationValue, 'N/A')
                ? !_.isNil(value) ? value : 'N/A'
                : 'N/A'}
            </div>
          );
        },
      },
    },
    // Longitude column with custom rendering based on location
    {
      name: 'lng',
      label: t('sensorReport.columns.longitude'),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellProps: () => ({
          style: { maxWidth: '300px', wordWrap: 'break-word' },
          className: 'reportingSensorLeftHeader',
        }),
        customBodyRender: (value, tableMeta) => {
          const locationValue = tableMeta.rowData[tableMeta.columnIndex - 2];
          return (
            <div>
              {!_.isEqual(locationValue, 'N/A')
                ? !_.isNil(value) ? value : 'N/A'
                : 'N/A'}
            </div>
          );
        },
      },
    },
    {
      name: 'temperature',
      label: t('sensorReport.columns.temperature', {
        unit: tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature')))),
      }),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {(!_.isNil(value) ? _.round(_.toNumber(value), 2) : '')}
          </div>
        ),
      },
    },
    {
      name: 'humidity',
      label: t('sensorReport.columns.humidity'),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {(!_.isNil(value) ? _.round(_.toNumber(value), 2) : '')}
          </div>
        ),
      },
    },
    {
      name: 'shock',
      label: t('sensorReport.columns.shock'),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {(!_.isNil(value) ? _.round(_.toNumber(value), 2) : '')}
          </div>
        ),
      },
    },
    {
      name: 'light',
      label: t('sensorReport.columns.light'),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {(!_.isNil(value) ? _.round(_.toNumber(value), 2) : '')}
          </div>
        ),
      },
    },
    // Tilt column is hidden by default
    {
      name: 'tilt',
      label: t('sensorReport.columns.tilt'),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        display: enabled_tilt,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {(!_.isEmpty(value)
              ? (
                <div>
                  <div>
                    X-axis:
                    {_.round(_.toNumber(value.roll), 2)}
                  </div>
                  <div>
                    Y-axis:
                    {_.round(_.toNumber(value.pitch), 2)}
                  </div>
                </div>
              )
              : ''
            )}
          </div>
        ),
      },
    },
    {
      name: 'battery',
      label: t('sensorReport.columns.batteryWithIntervals'),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => {
          const tTime = _.find(TIVE_GATEWAY_TIMES, { value: selectedShipment ? selectedShipment.transmission_time : '' });
          const mTime = _.find(TIVE_GATEWAY_TIMES, { value: selectedShipment ? selectedShipment.measurement_time : '' });
          return (
            <Grid container spacing={1}>
              <Grid item xs={4} style={{ alignContent: 'center', textAlign: 'center' }}>
                <div style={getCellStyle(tableMeta)}>
                  {(!_.isNil(value) ? _.round(_.toNumber(value), 2) : '')}
                </div>
              </Grid>
              {!_.isEqual(value, null) && !_.isEqual(value, undefined) && (
                <Grid item xs={8}>
                  <Typography variant="body1">
                    T:
                    {' '}
                    {tTime ? (t(`createShipment.intervalGuidance.${tTime.short_label}`)) : 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    M:
                    {' '}
                    {mTime ? (t(`createShipment.intervalGuidance.${mTime.short_label}`)) : 'N/A'}
                  </Typography>
                </Grid>
              )}
            </Grid>
          );
        },
      },
    },
    // Pressure and Probe columns are hidden by default
    {
      name: 'pressure',
      label: t('sensorReport.columns.pressure'),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        display: false,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value) => (!_.isNil(value) ? _.round(_.toNumber(value), 2) : ''),
      },
    },
    {
      name: 'probe',
      label: t('sensorReport.columns.probeTemperature', {
        unit: tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature')))),
      }),
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        display: false,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value) => (!_.isNil(value) ? _.round(_.toNumber(value), 2) : ''),
      },
    },
  ]);
};

// Function to generate columns for alerts report with custom body render for values
export const getAlertsReportColumns = (sensorReport, timezone, dateFormat, timeFormat, t) => ([
  {
    name: 'alertObj',
    label: t('alertsReport.columns.condition'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        !_.isEmpty(value)
          ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                {getIcon(value, t || null)}
                {' '}
              </div>
            </div>
          ) : ''
      ),
    },
  },
  {
    name: 'parameter_value',
    label: t('alertsReport.columns.value'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => {
        let formattedValue = '';
        if (value && _.includes(value, ' F/') && _.includes(value, ' C')) {
          const [val1, val2] = _.split(value, ' F/');
          const [temp, unit] = _.split(val2, ' ');
          formattedValue = `${val1} F/${_.round(_.toNumber(temp), 2)} ${unit}`;
        } else if (_.includes(value, 'G') || _.includes(value, 'LUX')) {
          formattedValue = `${_.toString(_.round(_.toNumber(value.split(' ')[0]), 2))} ${value.split(' ')[1]}`;
        } else {
          formattedValue = value || '-';
        }

        return formattedValue;
      },
    },
  },
  {
    name: 'create_date',
    label: t('alertsReport.columns.dateTimeStamp'),
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
    name: 'location',
    label: t('alertsReport.columns.location'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => <div>{value}</div>,
      setCellProps: () => ({ style: { maxWidth: '300px', wordWrap: 'break-word' } }),
    },
  },
  {
    name: 'latitude',
    label: t('alertsReport.columns.latitude'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value, tableMeta) => {
        const locationValue = tableMeta.rowData[tableMeta.columnIndex - 1];
        const displayValue = !_.isEqual(locationValue, 'N/A')
          ? (!_.isNil(value) ? value : 'N/A')
          : 'N/A';
        return <div>{displayValue}</div>;
      },
      setCellProps: () => ({ style: { maxWidth: '300px', wordWrap: 'break-word' } }),
    },
  },
  {
    name: 'longitude',
    label: t('alertsReport.columns.longitude'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value, tableMeta) => {
        const locationValue = tableMeta.rowData[tableMeta.columnIndex - 2];
        const displayValue = !_.isEqual(locationValue, 'N/A')
          ? (!_.isNil(value) ? value : 'N/A')
          : 'N/A';
        return <div>{displayValue}</div>;
      },
      setCellProps: () => ({ style: { maxWidth: '300px', wordWrap: 'break-word' } }),
    },
  },
]);

// Column definitions for rendering gateway data in a table.
// Accepts timezone, dateFormat, and MUI theme to customize rendering of date/time and styles.
export const gatewayColumns = (timezone, dateFormat, theme, t) => ([
  {
    name: 'is_active',
    label: t('gateway.columns.power'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Custom renderer to visually display power status (ON/OFF) with colored indicators.
      customBodyRender: (value) => {
        const containerStyle = {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: value ? theme.palette.success.light : theme.palette.background.light,
          borderRadius: '50px',
          width: '50px',
        };
        const circleStyle = {
          height: '10px',
          width: '10px',
          borderRadius: '50%',
          backgroundColor: value ? theme.palette.success.main : theme.palette.background.dark,
          marginLeft: value ? '5px' : '0px',
          marginRight: value ? '0px' : '5px',
        };
        const textStyle = {
          fontSize: '12px',
        };
        // Return styled power indicator with label and circle
        return (
          <span style={containerStyle}>
            {value ? (
              <>
                <span style={textStyle}>{t('gateway.columns.on')}</span>
                <span style={circleStyle} />
              </>
            ) : (
              <>
                <span style={circleStyle} />
                <span style={textStyle}>{t('gateway.columns.off')}</span>
              </>
            )}
          </span>
        );
      },
    },
  },
  {
    name: 'name',
    label: t('gateway.columns.tracker_identifier'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'gateway_type_value',
    label: t('gateway.columns.type'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'last_known_battery_level',
    label: t('gateway.columns.battery'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      setCellProps: () => ({ style: { width: '50px' } }),
    },
  },
  {
    name: 'gateway_status',
    label: t('gateway.columns.status'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Custom renderer to display color-coded status with labels
      customBodyRender: (value) => {
        // Returns style config based on status value
        const getStatusStyles = (status) => {
          switch (status) {
            case 'available':
              return {
                backgroundColor: theme.palette.success.light,
                padding: '4px 8px',
                borderRadius: '6px',
              };
            case 'assigned':
              return {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.default,
                padding: '4px 8px',
                borderRadius: '6px',
              };
            case 'in-transit':
              return {
                backgroundColor: theme.palette.background.light7,
                padding: '4px 8px',
                borderRadius: '6px',
              };
            case 'unavailable':
              return {
                backgroundColor: theme.palette.background.light2,
                padding: '4px 8px',
                borderRadius: '6px',
              };
            default:
              return {};
          }
        };

        const styles = getStatusStyles(value);

        return (
          <span style={styles}>
            {value && value !== '-' ? _.capitalize(t(`gateway.${value}`)) : value}
          </span>
        );
      },
    },
  },
  {
    name: 'shipment',
    label: t('gateway.columns.shipments'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Converts array of shipment names to comma-separated string
      customBodyRender: (value) => (
        value && value !== '-' ? _.join(value, ', ') : value
      ),
      setCellProps: () => ({
        style: { maxWidth: '200px', wordWrap: 'break-word' },
      }),
    },
  },
  {
    name: 'custodian',
    label: t('gateway.columns.shipper'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Converts array of custodian names to comma-separated string
      customBodyRender: (value) => (
        value && value !== '-' ? _.join(value, ', ') : value
      ),
    },
  },
  {
    name: 'activation_date',
    label: t('gateway.columns.activation'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Formats date using moment-timezone and given format
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format(`${dateFormat}`)
          : value
      ),
    },
  },
  {
    name: 'calibration_certificate',
    label: t('gateway.columns.calibration_certificate'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      setCellProps: () => ({ style: { width: '50px' } }),
      // Renders a clickable icon to download the certificate PDF
      customBodyRender: (value) => {
        const onPress = () => {
          const link = document.createElement('a');
          link.href = value;
          link.target = '_blank';
          link.download = 'TrackerCertificateOfCollaboration.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
        return (value && (
          <LaunchIcon
            onClick={onPress}
            style={{
              fill: theme.palette.primary.main,
              width: '100%',
              margin: 'auto',
              cursor: 'pointer',
            }}
          />
        ));
      },
    },
  },
]);

// Returns minimal column definition for all devices view
export const allDevicesColumns = (t) => ([
  {
    name: 'name',
    label: t('adminTrackers.trackerIdentifier'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: '_organization',
    label: t('adminTrackers.organization'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'gateway_status',
    label: t('adminTrackers.trackerStatus'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => {
        const className = `adminTrackers${_.capitalize(value)}`;
        return <div className={className}>{value && value !== '-' ? _.capitalize(t(`gateway.${value}`)) : value}</div>;
      },
    },
  },
  {
    name: 'last_known_battery_level',
    label: t('adminTrackers.battery'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (!_.includes([null, undefined, 'None'], value) ? `${value}%` : 'N/A'),
    },
  },
  {
    name: '_type',
    label: t('adminTrackers.trackerType'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
]);

// Formats gateway row data by enriching it with readable values for type, shipment, and custodian
export const getGatewayFormattedRow = (data, gatewayTypeList, shipmentData, custodianData) => {
  if (
    data
    && gatewayTypeList
  ) {
    let formattedData = [];
    _.forEach(data, (element) => {
      if (!element) return;
      // Clone and initialize the current row
      let edited = { ...element, shipment: [], custodian: [] };
      // Replace gateway_type URL with a readable name
      _.forEach(gatewayTypeList, (type) => {
        if (_.isEqual(type.url, element.gateway_type)) {
          edited = {
            ...edited,
            gateway_type_value: type.name,
          };
        }
      });
      // Match shipment IDs to shipment names
      if (shipmentData && shipmentData.length) {
        _.forEach(shipmentData, (shipment) => {
          if (shipment.partner_shipment_id !== null && !_.isEmpty(element.shipment_ids)
            && element.shipment_ids.includes(shipment.partner_shipment_id.toString())
          ) {
            edited = {
              ...edited,
              shipment: [
                ...edited.shipment,
                shipment.name,
              ],
            };
          }
        });
      }
      // Match custodian UUID to custodian name
      if (custodianData && custodianData.length) {
        _.forEach(custodianData, (custodian) => {
          if (element.custodian_uuid
            && _.isEqual(element.custodian_uuid, custodian.custodian_uuid)
          ) {
            edited = {
              ...edited,
              custodian: [
                ...edited.custodian,
                custodian.name,
              ],
            };
          }
        });
      }
      // Set dash if no shipment/custodian match found
      if (_.isEqual(edited.shipment.length, 0)) {
        edited.shipment = '-';
      }
      if (_.isEqual(edited.custodian.length, 0)) {
        edited.custodian = '-';
      }
      // Add the formatted row to output
      formattedData = [...formattedData, edited];
    });

    // Sort by creation date ascending
    return _.orderBy(
      formattedData,
      (rowData) => moment(rowData.create_date),
      ['asc'],
    );
  }
  return data;
};

// Predefined gateway status values used for filtering and rendering
export const GATEWAY_STATUS = [
  { value: 'available', name: 'Available' },
  { value: 'unavailable', name: 'Unavailable' },
  { value: 'assigned', name: 'Assigned' },
  { value: 'in-transit', name: 'In-transit' },
];

// Define the shipment columns for display in a data table
export const shipmentColumns = (timezone, dateFormat, language, muiTheme, t) => ([
  {
    name: 'status',
    label: t('shipment.status'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (t(`createShipment.${value}`)),
    },
  },
  {
    name: 'estimated_time_of_departure',
    label: t('shipment.depart'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Render departure date in formatted style and apply red color if delayed
      customBodyRender: (value, tableMeta) => {
        const delayed = tableMeta.rowData[tableMeta.columnIndex + 7]; // 'delayed' column
        const status = tableMeta.rowData[tableMeta.columnIndex - 1]; // 'status' column
        return (
          value && value !== '-' ? (
            <span style={{ color: delayed && status === 'Planned' ? muiTheme.palette.error.main : 'inherit' }}>
              {moment(value).tz(timezone).format(`${dateFormat}`)}
            </span>
          ) : value
        );
      },
    },
  },
  {
    name: 'origin',
    label: t('shipment.origin'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'estimated_time_of_arrival',
    label: t('shipment.arrive'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Format arrival date based on timezone
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone)
            .format(`${dateFormat}`)
          : value
      ),
    },
  },
  {
    name: 'destination',
    label: t('shipment.destination'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'alerts',
    label: t('shipment.alerts'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Show icons for different alerts
      customBodyRender: (value) => (
        !_.isEmpty(value)
          ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: 50,
                flexWrap: 'wrap',
              }}
            >
              {_.map(value, (item, idx) => (
                <div key={`icon-${idx}-${item.id}`}>
                  {getIcon(item, t || null)}
                  {' '}
                </div>
              ))}
            </div>
          ) : ''
      ),
    },
  },
  {
    name: 'itemNames',
    label: t('shipment.items'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Show item names with line breaks and max width
      customBodyRender: (value) => (
        <Typography sx={{ whiteSpace: 'break-spaces', maxWidth: '400px' }}>
          {value}
        </Typography>
      ),
    },
  },
  {
    name: 'tracker',
    label: t('shipment.tracker'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'delayed',
    label: t('shipment.delayed'),
    // Hidden column used for delay logic
    options: {
      display: false,
    },
  },
]);

// Format and enrich shipment row data with custodian info, alerts, trackers, and more
export const getShipmentFormattedRow = (
  shipmentData,
  custodianData,
  custodyData,
  itemData,
  gatewayData,
  allAlerts,
  maxColor,
  minColor,
  sensorReports,
) => {
  let shipmentList = [];

  let custodyRows = [];

  // Format custody rows with custodian names and related shipment links
  if (!_.isEmpty(custodyData) && !_.isEmpty(custodianData)) {
    custodyRows = getFormattedCustodyRows(custodyData, custodianData);
  }

  _.forEach(shipmentData, (shipment) => {
    const editedShipment = { ...shipment };
    let firstCustody = null;
    let lastCustody = null;
    let origin = null;
    let destination = null;
    let carriers = [];

    if (!_.isEmpty(custodyRows)) {
      // From list of custodians attached to the shipment find the first custody for the shipment
      // First custody can be
      // 1. A custody whose first_custody is set to True
      // 2. The custody attached very first to the shipment
      const custodies = _.orderBy(_.filter(custodyRows, { shipment_id: editedShipment.shipment_uuid }), 'create_date', 'asc');

      [firstCustody] = _.filter(custodies, { first_custody: true });
      [lastCustody] = _.filter(custodies, { last_custody: true });

      // Assign origin and destination based on custody data
      origin = firstCustody ? firstCustody.custodian_name : 'N/A';
      destination = lastCustody ? lastCustody.custodian_name : 'N/A';
      carriers = _.map(_.orderBy(_.filter(custodies, { first_custody: false, last_custody: false }), 'load_id', 'asc'), 'custodian_name');
    }
    editedShipment.origin = origin;
    editedShipment.destination = destination;
    editedShipment.carriers = carriers;

    // Assign type based on shipment status
    switch (_.lowerCase(shipment.status)) {
      case 'planned':
      case 'en route':
      case 'arrived':
        editedShipment.type = 'Active';
        break;

      case 'completed':
        editedShipment.type = 'Completed';
        break;

      case 'cancelled':
        editedShipment.type = 'Cancelled';
        break;

      case 'damaged':
        editedShipment.type = 'Damaged';
        break;

      case 'battery depleted':
        editedShipment.type = 'Battery Depleted';
        break;

      default:
        break;
    }

    // Resolve item names from itemData
    if (!_.isEmpty(itemData)) {
      const items = _.filter(itemData, (item) => _.includes(editedShipment.items, item.url));
      editedShipment.itemNames = _.toString(_.join(_.map(items, 'name'), ', '));
    }

    // Match gateway info and battery level
    if (!_.isEmpty(gatewayData)) {
      const gateways = _.filter(gatewayData, (gateway) => (
        _.includes(editedShipment.gateway_imei, _.toString(gateway.imei_number))
      ));

      editedShipment.tracker = (!_.isEmpty(gateways) && _.toString(_.join(_.map(gateways, 'name'), ', '))) || 'N/A';
      editedShipment.battery_levels = (!_.isEmpty(gateways) && _.toString(_.join(_.map(gateways, (g) => _.toString(_.toInteger(g.last_known_battery_level) || 'N/A')), ', '))) || 'N/A';
    }

    // Format alerts if shipment had any
    if (editedShipment.had_alert) {
      const filteredAlerts = _.filter(allAlerts, (alert) => (
        _.isEqual(alert.shipment_id, editedShipment.partner_shipment_id)
        && !alert.recovered_alert_id
      ));
      let processedAlerts = [];

      _.forEach(filteredAlerts, (alert) => {
        let color = '';
        let title = '';
        // Determine alert type and styling
        if (_.includes(alert.alert_type, 'max') || _.includes(alert.alert_type, 'shock') || _.includes(alert.alert_type, 'light')) {
          color = maxColor;
          title = `Maximum ${_.capitalize(alert.parameter_type)} Excursion`;
        }
        if (_.includes(alert.alert_type, 'min')) {
          color = minColor;
          title = `Minimum ${_.capitalize(alert.parameter_type)} Excursion`;
        }

        const alertObj = { id: alert.parameter_type, color, title };
        // Avoid duplicates
        const objFound = !!(_.find(processedAlerts, alertObj));
        if (!objFound) {
          processedAlerts = [...processedAlerts, alertObj];
        }
      });
      editedShipment.alerts = processedAlerts;
    }

    // Attach recent sensor report markers and battery levels
    if (!_.isEmpty(sensorReports)) {
      const reports = _.take(
        _.orderBy(
          _.filter(sensorReports, { shipment_id: editedShipment.partner_shipment_id }),
          [
            (obj) => moment(obj.activation_date),
          ],
          ['desc'],
        ),
        10,
      );
      editedShipment.allMarkers = _.map(reports, (report) => ({
        lat: report.report_entry.report_latitude || '*',
        lng: report.report_entry.report_longitude || '*',
        country: extractCountry(report.report_entry.report_location || ''),
        shipment: editedShipment,
      }));

      // Use most recent report for battery info
      editedShipment.battery_levels = (!_.isEmpty(reports) && reports[0].report_entry?.report_battery) || editedShipment.battery_levels;
    }
    shipmentList = [...shipmentList, editedShipment];
  });
  // Order shipments by departure date and creation date, descending
  return _.orderBy(
    shipmentList,
    (shipment) => moment(shipment.estimated_time_of_departure)
      && moment(shipment.create_date),
    ['desc'],
  );
};

// Formats and enriches template rows for display in a table
export const getTemplateFormattedRow = (templates, custodianData, itemData) => {
  let templateList = [];

  // Iterate through each template to enrich it with additional details
  _.forEach(templates, (template) => {
    let editedTemplate = template;
    // Match origin and destination custodians from custodian data
    const originCustodian = _.find(custodianData, { url: template.origin_custodian });
    const destinationCustodian = _.find(custodianData, { url: template.destination_custodian });
    // Map each item URL in the template to full item object
    const templateItems = _.map(template.items, (item) => _.find(itemData, { url: item }));

    // Add readable custodian names to the template
    if (originCustodian) {
      editedTemplate = { ...editedTemplate, origin_name: originCustodian.name };
    }
    if (destinationCustodian) {
      editedTemplate = { ...editedTemplate, destination_name: destinationCustodian.name };
    }
    // Join item names into a single comma-separated string
    if (!_.isEmpty(templateItems)) {
      editedTemplate = { ...editedTemplate, item_name: _.toString(_.join(_.map(templateItems, 'name'), ', ')) };
    }

    // Append the enriched template to the list
    templateList = [...templateList, editedTemplate];
  });

  // Return the list ordered by creation date (most recent first)
  return _.orderBy(templateList, (tmp) => moment(tmp.create_date), ['desc']);
};

// Returns column definitions for the template data table
export const templateColumns = (timezone, dateFormat, t) => ([
  {
    name: 'create_date',
    label: t('template.created'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format(dateFormat)
          : value
      ),
    },
  },
  {
    name: 'origin_name',
    label: t('template.origin'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'destination_name',
    label: t('template.destination'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'item_name',
    label: t('template.items'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
]);

// Formats user data to include derived fields like full name and organization display name
export const getUserFormattedRows = (userData) => {
  const formattedData = _.map(userData, (ud) => ({
    ...ud,
    full_name: `${ud.first_name} ${ud.last_name}`,
    org_display_name: ud.organization.name,
  }));

  return _.orderBy(formattedData, 'id', 'desc'); // Sorted by newest user first
};

// Returns column definitions for the user table
export const userColumns = (t) => ([
  {
    name: 'full_name',
    label: t('users.fullName'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'username',
    label: t('users.userName'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'email',
    label: t('users.email'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'org_display_name',
    label: t('users.organization'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
]);

// Enriches group data with display name including organization name
export const getGroupsFormattedRow = (groups, orgs) => {
  const formattedData = _.map(groups, (g) => {
    const organizationName = _.find(orgs, { organization_uuid: g.organization })
      ? _.find(orgs, { organization_uuid: g.organization }).name
      : '';

    // For default group (id = 1), just use name; else append org name
    const displayPermissionName = _.isEqual(g.id, 1)
      ? g.name
      : (
        <span>
          {g.name}
          {' - '}
          <span className="notranslate">{organizationName}</span>
        </span>
      );

    return {
      ...g,
      display_permission_name: displayPermissionName,
    };
  });

  return _.orderBy(formattedData, 'display_permission_name', 'asc');
};

// Returns column definitions for alert notifications
export const getAlertNotificationsColumns = (timezone, dateFormat, timeFormat, t) => ([
  {
    name: 'alertObj',
    label: t('alertNotifications.columns.condition'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        !_.isEmpty(value)
          ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                {getIcon(value, t || null)}
                {' '}
              </div>
            </div>
          ) : ''
      ),
    },
  },
  {
    name: 'parameterValue',
    label: t('alertNotifications.columns.value'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      // Handles mixed unit values like "72 F/22.2 C"
      customBodyRender: (value) => {
        let formattedValue = '';
        if (value && _.includes(value, ' F/') && _.includes(value, ' C')) {
          const [val1, val2] = _.split(value, ' F/');
          const [temp, unit] = _.split(val2, ' ');
          formattedValue = `${val1} F/${_.round(_.toNumber(temp), 2)} ${unit}`;
        } else {
          formattedValue = value || '-';
        }

        return formattedValue;
      },
    },
  },
  {
    name: 'alert_time',
    label: t('alertNotifications.columns.dateTimeStamp'),
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
    name: 'location',
    label: t('alertNotifications.columns.location'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      setCellProps: () => ({ style: { maxWidth: '300px', wordWrap: 'break-word' } }),
    },
  },
]);

// Formats recipient address data into a readable address string
export const getFormattedRecipientAddresses = (recipientAddresses) => {
  const ra = _.map(recipientAddresses, (address) => ({
    ...address,
    formattedAddress: `${address.address1
      && `${address.address1},`} ${address.address2
      && `${address.address2},`} ${address.city
      && `${address.city},`} ${address.state
      && `${address.state},`} ${address.country
      && `${address.country},`} ${address.postal_code
      && `${address.postal_code}`}`,
  }));
  return ra;
};

// Returns column definitions for recipient address table
export const getRecipientAddressColumns = (timezone, dateFormat, timeFormat, t) => ([
  {
    name: 'name',
    label: t('generic.name'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      setCellProps: () => ({
        className: 'notranslate',
      }),
    },
  },
  {
    name: 'formattedAddress',
    label: t('recipientAddress.address'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      setCellProps: () => ({
        className: 'notranslate',
      }),
    },
  },
  {
    name: 'create_date',
    label: t('generic.createdAt'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat),
    },
  },
  {
    name: 'edit_date',
    label: t('generic.lastEditedAt'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat),
    },
  },
]);

// Returns column definitions for tracker order table
export const getTrackerOrderColumns = (timezone, dateFormat, timeFormat, t) => ([
  {
    name: 'order_date',
    label: t('trackerOrder.orderDate'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat),
    },
  },
  {
    name: 'order_quantity',
    label: t('trackerOrder.quantity'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => _.map(value, (v) => <div>{v}</div>),
    },
  },
  {
    name: 'order_type',
    label: t('trackerOrder.type'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => _.map(value, (v) => <div>{v}</div>),
      setCellProps: () => ({
        className: 'notranslate',
      }),
    },
  },
  {
    name: 'order_recipient',
    label: t('trackerOrder.recipient'),
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      setCellProps: () => ({
        className: 'notranslate',
      }),
    },
  },
]);
