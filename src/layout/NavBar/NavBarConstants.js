import { routes } from '../../routes/routesConstants';

export const NAVIGATION_ITEMS = [
  {
    id: 'shipment',
    name: 'Shipments',
    link: routes.SHIPMENT,
  },
  {
    id: 'items',
    name: 'Items',
    link: routes.ITEMS,
  },
  {
    id: 'custodians',
    name: 'Custodians',
    link: routes.CUSTODIANS,
  },
  {
    id: 'sensors',
    name: 'Gateway & Sensors',
    link: routes.SENSORS_GATEWAY,
  },
  {
    id: 'reporting',
    name: 'Reporting',
    link: routes.REPORTING,
  },
];
