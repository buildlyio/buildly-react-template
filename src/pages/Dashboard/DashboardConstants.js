import _ from 'lodash';
import { numberWithCommas } from '../../utils/utilMethods';
import { getFormattedCustodyRows } from '../../pages/Shipment/ShipmentConstants';

export const DASHBOARD_MAP_TOOLTIP = 'Start and end locations of custodians which have current custody of the shipments that are currently enroute.';

export const DASHBOARD_RECALL_TOOLTIP = 'Shipments which are either recalled or have violations such as temperature, humidity and delay';

export const DASHBOARD_DELAY_TOOLTIP = 'Shipments which are delayed';

export const recallColumns = [
  {
    name: 'name',
    label: 'Shipment Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'itemNo',
    label: 'Affected Items',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'custodian_name',
    label: 'Current Custodians',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
];

export const delayColumns = [
  {
    name: 'name',
    label: 'Shipment Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'delay',
    label: 'Delay(hrs)',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'itemNo',
    label: 'Items',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'risk',
    label: 'Revenue Risk',
    options: {
      sort: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? `$${numberWithCommas(value)}`
          : value
      ),
    },
  },
  {
    name: 'custodian',
    label: 'Current Custodians',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
];

export const getFormattedShipmentRow = (
  shipmentData,
  custodianData,
  itemData,
  custodyData,
  aggregateReportData,
) => {
  let shipmentList = [];
  let custodyRows = [];
  if (
    custodyData
    && custodianData
    && custodyData.length
    && custodianData.length
  ) {
    custodyRows = getFormattedCustodyRows(custodyData, custodianData);
  }

  _.forEach(shipmentData, (shipment) => {
    const editedShipment = shipment;
    let itemName = '';
    let custodyInfo = [];
    let custodianName = '';
    let aggregateReportInfo = [];

    if (custodyRows.length > 0) {
      _.forEach(custodyRows, (custody) => {
        if (
          custody.shipment_id === shipment.shipment_uuid
          && custody.has_current_custody
        ) {
          custodianName = custodianName
            ? `${custodianName}, ${custody.custodian_data.name}`
            : custody.custodian_data.name;
          custodyInfo = [...custodyInfo, custody];
        }
      });
    }
    editedShipment.custodian_name = custodianName;
    editedShipment.custody_info = custodyInfo;

    if (
      aggregateReportData
      && aggregateReportData.length > 0
    ) {
      _.forEach(aggregateReportData, (report) => {
        if (report.shipment_id === shipment.partner_shipment_id) {
          aggregateReportInfo = [
            ...aggregateReportInfo,
            report,
          ];
        }
      });
    }

    editedShipment.sensor_report = aggregateReportInfo;

    if (
      itemData
      && shipment.items
      && shipment.items.length
    ) {
      _.forEach(itemData, (item) => {
        if (_.indexOf(shipment.items, item.url) !== -1) {
          itemName = `${itemName + item.name}, `;
          editedShipment.itemNo = itemName;
        }
      });
    }

    shipmentList = [...shipmentList, editedShipment];
  });
  return shipmentList;
};
