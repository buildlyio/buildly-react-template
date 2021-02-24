import { routes } from "midgard/routes/routesConstants";

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
];

export const ADMIN_NAVIGATION_ITEMS = [
  {
    id: "user_management",
    name: "User Management",
    link: routes.USER_MANAGEMENT,
  },
  {
    id: "admin_panel",
    name: "Admin Panel",
    link: routes.ADMIN_PANEL,
  },
];
