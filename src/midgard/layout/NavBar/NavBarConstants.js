import { routes } from "../../routes/routesConstants";

export const NAVIGATION_ITEMS = [
  {
    id: "dashboard",
    name: "Dashboard",
    link: routes.DASHBOARD,
  },
  {
    id: "shipment",
    name: "Shipments",
    link: routes.SHIPMENT,
  },
  {
    id: "items",
    name: "Items",
    link: routes.ITEMS,
  },
  {
    id: "custodians",
    name: "Custodians",
    link: routes.CUSTODIANS,
  },
  {
    id: "sensors",
    name: "Gateway & Sensors",
    link: routes.SENSORS_GATEWAY,
  },
  {
    id: "user_management",
    name: "User Management",
    link: routes.USER_MANAGEMENT,
  },
];
