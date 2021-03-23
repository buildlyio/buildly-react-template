import React from "react";
import { numberWithCommas } from "../../utils/utilMethods";
import moment from "moment";
import {
  TempIcon,
  HumidIcon,
  DelayIcon,
  RecallIcon,
} from "../../components/Icons/Icons";
import _ from "lodash";

export const MAP_TOOLTIP =
  "Locations of the shipment from starting point till current time";

export const SHIPMENT_DATA_TABLE_TOOLTIP =
  "Click on a shipment to view it on the map";

export const SHIPMENT_SENSOR_REPORT_TOOLTIP =
  "Shipment Sensor Report till current time";

export const SHIPMENT_DATA_TABLE_COLUMNS = [
  {
    name: "name",
    label: "Shipment Name",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "estimated_time_of_arrival",
    label: "Estimated Arrival Date",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-"
        ? moment(value).format("MM/DD/yyyy")
        : value
    },
  },
  {
    name: "estimated_time_of_departure",
    label: "Estimated Departure Date",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-"
        ? moment(value).format("MM/DD/yyyy")
        : value
    },
  },
  {
    name: "status",
    label: "Shipment Status",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "shipment_flag",
    label: "Shipment Flags",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => {
        if (value && value.length) {
          return (
            <React.Fragment>
              {value.map((flag, index) => {
                if (flag.toLowerCase().includes("temp")) {
                  return (
                    <TempIcon
                      key={`iconTemp${index}`}
                      color={
                        flag.toLowerCase().includes("warning")
                          ? "#ff9800"
                          : "#f44336"
                      }
                    />
                  );
                } else if (flag.toLowerCase().includes("humid")) {
                  return (
                    <HumidIcon
                      key={`iconHumid${index}`}
                      color={
                        flag.toLowerCase().includes("warning")
                          ? "#ff9800"
                          : "#f44336"
                      }
                    />
                  );
                } else if (flag.toLowerCase().includes("delay")) {
                  return (
                    <DelayIcon
                      key={`iconDelay${index}`}
                      color={
                        flag.toLowerCase().includes("warning")
                          ? "#ff9800"
                          : "#f44336"
                      }
                    />
                  );
                } else if (flag.toLowerCase().includes("recall")) {
                  return (
                    <RecallIcon
                      key={`iconRecall${index}`}
                      color={
                        flag.toLowerCase().includes("warning")
                          ? "#ff9800"
                          : "#f44336"
                      }
                    />
                  );
                }
              })}
            </React.Fragment>
          );
        }
        return value.toString();
      }
    },
  },
  {
    name: "custodian_name",
    label: "Custodian Name",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "value",
    label: "Value",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value && value !== "-"
        ? `$${numberWithCommas(value)}`
        : value
    },
  },
];

export const SHIPMENT_SENSOR_COLUMNS = [
  {
    name: "alert_status",
    label: "Alert Status",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: "timestamp",
    label: "Tag Captured Timestamp (UTC)",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => {
        const displayDate = new Date(value).toLocaleDateString('en-US',
          { year: 'numeric', month: 'short', day: 'numeric' });
        const displayTime = new Date(value).toLocaleTimeString();
        return (`${displayDate} ${displayTime}`);
      }
    },
  },
  {
    name: "lat",
    label: "Location (Latitude)",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => Number(value).toFixed(5)
    },
  },
  {
    name: "lng",
    label: "Location (Longitude)",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => Number(value).toFixed(5)
    },
  },
  {
    name: "light",
    label: "Light (lux)",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => Number(value).toFixed(2)
    },
  },
  {
    name: "humidity",
    label: "Humidity (%)",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => Number(value).toFixed(2)
    },
  },
  {
    name: "temperature",
    label: "Temperature (\u00b0F)",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => Number(value).toFixed(2)
    },
  },
  {
    name: "shock",
    label: "Shock (mg)",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => Number(value).toFixed(2)
    },
  },
  {
    name: "tilt",
    label: "Tilt (deg)",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => Number(value).toFixed(2)
    },
  },
  {
    name: "battery",
    label: "Battery (%)",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => Number(value).toFixed(2)
    },
  },
  {
    name: "pressure",
    label: "Pressure (Pa)",
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => Number(value).toFixed(2)
    },
  },
];

export const getFormattedRow = (
  shipmentData,
  custodianData,
  itemData,
  shipmentFlag,
  custodyData,
  aggregateReportData,
) => {
  let shipmentList = [...shipmentData];

  let custodyRows = [];
  if (
    custodyData &&
    custodyData.length &&
    custodianData &&
    custodianData.length
  ) {
    custodyRows = getFormattedCustodyRows(custodyData, custodianData);
  }

  shipmentList.forEach((list) => {
    let shipmentValue = 0;
    let custodyInfo = [];
    let flag_list = [];
    let custodianName = "";
    let aggregateReportInfo = [];

    if (custodyRows.length > 0) {
      custodyRows.forEach((custody) => {
        if (custody.shipment_id === list.shipment_uuid) {
          custodianName = custodianName + custody.custodian_data.name + ",";
          custodyInfo.push(custody);
        }
      });
    }
    list["custodian_name"] = custodianName;
    list["custody_info"] = custodyInfo;
    if (list.status.toLowerCase() === "planned" || list.status.toLowerCase() === "enroute")
      list["type"] = "Active";
    else if (list.status.toLowerCase() === "completed" || list.status.toLowerCase() === "cancelled")
      list["type"] = "Completed";

    if (aggregateReportData && aggregateReportData.length > 0) {
      aggregateReportData.forEach((report) => {
        if (report.shipment_id === list.partner_shipment_id &&
          report.report_entries.length > 0) {
          aggregateReportInfo.push(report);
        }
      });
    }

    list["sensor_report"] = aggregateReportInfo;

    if (itemData && list.items && list.items.length) {
      itemData.forEach((item) => {
        if (list.items.indexOf(item.url) !== -1) {
          shipmentValue += item.value;
          list["value"] = shipmentValue;
        }
      });
    }
    list["shipment_flag"] = [];
    if (shipmentFlag && shipmentFlag.length) {
      shipmentFlag &&
        shipmentFlag.forEach((flag) => {
          if (list.flags.indexOf(flag.url) !== -1 && flag.type !== "None") {
            list.shipment_flag = [...list.shipment_flag, flag.name];
            list[`${flag.name.toLowerCase()}_flag`] = true;
            flag_list.push(flag);
          }
        });
    }
    list["flag_list"] = flag_list;
  });
  let sortedList = shipmentList.sort((a, b) => {
    return moment.utc(a.create_date).diff(moment.utc(b.create_date));
  });
  return sortedList;
};

export const custodianColumns = [
  { id: "id", label: "Custodian ID", minWidth: 150 },
  { id: "name", label: "Name", minWidth: 150 },
  {
    id: "location",
    label: "Location",
    minWidth: 180,
  },
  {
    id: "custodian_glns",
    label: "GLN",
    minWidth: 170,
  },
  {
    id: "start_of_custody",
    label: "Start Of Custody",
    minWidth: 170,
    format: (value) =>
      value && value !== "-" ? moment(value).format("MM/DD/yyyy") : value,
  },
];

export const custodyColumns = [
  { id: "custodian_name", label: "Custodian Name", minWidth: 150 },
  {
    id: "start_of_custody",
    label: "Start of Custody",
    format: (value) =>
      value && value !== "-" ? moment(value).format("MM/DD/yyyy") : value,
    minWidth: 180,
  },
  {
    id: "end_of_custody",
    label: "End of Custody",
    format: (value) =>
      value && value !== "-" ? moment(value).format("MM/DD/yyyy") : value,
    minWidth: 180,
  },
  {
    id: "start_of_custody_location",
    label: "Start Location",
    minWidth: 150,
    maxWidth: 150,
  },
  {
    id: "end_of_custody_location",
    label: "End Location",
    minWidth: 150,
    maxWidth: 150,
  },
  {
    id: "first_custody",
    label: "First Custody",
    minWidth: 100,
    format: (value) => (value === true ? "YES" : "NO"),
  },
  {
    id: "has_current_custody",
    label: "Current Custody",
    minWidth: 100,
    format: (value) => (value === true ? "YES" : "NO"),
  },
  {
    id: "last_custody",
    label: "Last Custody",
    minWidth: 100,
    format: (value) => (value === true ? "YES" : "NO"),
  },
];

export const getUniqueContactInfo = (rowItem, contactInfo) => {
  let obj = "";
  contactInfo.forEach((info) => {
    if (rowItem.contact_data[0] === info.url) {
      obj = info;
    }
  });
  return obj;
};

export const getFormattedCustodianRow = (data, contactInfo, custodyData) => {
  let customizedRow = [...data];
  if (data && data.length && contactInfo && contactInfo.length) {
    customizedRow.forEach((rowItem) => {
      let contactInfoItem = getUniqueContactInfo(rowItem, contactInfo);
      rowItem["location"] = `${contactInfoItem.address1 && `${contactInfoItem.address1},`}
            ${contactInfoItem.address2 && `${contactInfoItem.address2},`}
            ${contactInfoItem.city && `${contactInfoItem.city},`}
            ${contactInfoItem.state && `${contactInfoItem.state},`}
            ${contactInfoItem.country && `${contactInfoItem.country},`}
            ${contactInfoItem.postal_code && `${contactInfoItem.postal_code}`}`;

      if (custodyData) {
        custodyData.forEach((custody) => {
          if (custody.custodian.indexOf(rowItem.url) !== -1) {
            rowItem["start_of_custody"] = custody.start_of_custody;
          }
        });
      }
    });
  }

  let sortedList = customizedRow.sort((a, b) => {
    return moment.utc(a.start_of_custody).diff(moment.utc(b.start_of_custody));
  });

  return sortedList;
};

export const getFormattedCustodyRows = (
  custodyData,
  custodianData,
  shipmentFormData
) => {
  let customizedRows = [...custodyData];
  if (customizedRows && custodianData) {
    customizedRows.forEach((custody) => {
      custodianData.forEach((custodian) => {
        if (custody.custodian[0] === custodian.url) {
          custody["custodian_name"] = custodian.name;
          custody["custodian_data"] = custodian;
        }
      });
    });
  }
  let sortedList = customizedRows.sort((a, b) => {
    return moment.utc(a.start_of_custody).diff(moment.utc(b.start_of_custody));
  });

  return sortedList;
};

export const svgIcon = (flagType, flag) => {
  if (flag && flag.toLowerCase().includes("humidity")) {
    let url = "";
    if (flagType.toLowerCase().includes("warning")) {
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23ff9800" d="M5.636 6.636L12 .272l6.364 6.364a9 9 0 1 1-12.728 0z"/></svg>`;
    } else
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23f44336" d="M5.636 6.636L12 .272l6.364 6.364a9 9 0 1 1-12.728 0z"/></svg>`;
    return {
      url: url,
    };
  } else if (flag && flag.toLowerCase().includes("temperature")) {
    let url = "";
    if (flagType.toLowerCase().includes("warning")) {
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23ff9800" d="M8 5a4 4 0 1 1 8 0v5.255a7 7 0 1 1-8 0V5zm1.144 6.895a5 5 0 1 0 5.712 0L14 11.298V5a2 2 0 1 0-4 0v6.298l-.856.597zm1.856.231V5h2v7.126A4.002 4.002 0 0 1 12 20a4 4 0 0 1-1-7.874zM12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>`;
    } else
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23f44336" d="M8 5a4 4 0 1 1 8 0v5.255a7 7 0 1 1-8 0V5zm1.144 6.895a5 5 0 1 0 5.712 0L14 11.298V5a2 2 0 1 0-4 0v6.298l-.856.597zm1.856.231V5h2v7.126A4.002 4.002 0 0 1 12 20a4 4 0 0 1-1-7.874zM12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>`;
    return {
      url: url,
    };
  } else if (flag && flag.toLowerCase().includes("delay")) {
    let url = "";
    if (flagType.toLowerCase().includes("warning")) {
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23ff9800" d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm3.536 5.05L10.586 12 12 13.414l4.95-4.95-1.414-1.414z"/></svg>`;
    } else
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23f44336" d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm3.536 5.05L10.586 12 12 13.414l4.95-4.95-1.414-1.414z"/></svg>`;
    return {
      url: url,
    };
  } else if (flag && flag.toLowerCase().includes("recall")) {
    let url = "";
    if (flagType.toLowerCase().includes("warning")) {
      url = `data:image/svg+xml;utf-8,<svg width="24" height="24" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.6651 6.73244C13.0416 6.4071 12.3718 6.25121 11.7085 6.25121C12.0733 5.60732 12.2855 4.85498 12.2855 4.06198C12.2855 2.25908 11.2177 0.706955 9.69228 0.0359513C9.42035 -0.0860494 9.10862 0.117285 9.10862 0.422287C9.10862 0.578177 9.19484 0.727289 9.33412 0.801845C10.3422 1.31696 11.0188 2.39463 10.979 3.63497C10.9657 4.12298 10.833 4.57709 10.6142 4.98376C9.88461 4.40087 8.96934 4.0552 7.97448 4.0552C6.99288 4.0552 6.09088 4.39409 5.36794 4.96342C5.14244 4.53642 5.01643 4.04842 5.01643 3.53331C5.01643 2.34041 5.6863 1.31018 6.66126 0.808622C6.80054 0.734066 6.88677 0.591732 6.88677 0.429065C6.88677 0.124063 6.58168 -0.0792716 6.30975 0.0359513C4.7246 0.734067 3.63025 2.38108 3.71648 4.27887C3.74964 4.98376 3.94861 5.64121 4.2736 6.2241C4.26697 6.23088 4.26033 6.24443 4.26033 6.25121C3.54403 6.25799 2.81447 6.44777 2.15123 6.84088C0.61251 7.73555 -0.163482 9.45712 0.028858 11.1448C0.0620201 11.4498 0.39364 11.6192 0.652304 11.4634C0.784952 11.382 0.871174 11.2329 0.857909 11.077C0.791585 9.93157 1.3686 8.78611 2.43642 8.20322C2.84763 7.97955 3.28537 7.87111 3.72311 7.85078C3.69658 8.04055 3.68331 8.23711 3.68331 8.43367C3.68331 10.2705 4.79756 11.8497 6.36944 12.5004C6.11741 12.9138 5.76589 13.2663 5.32815 13.5306C4.32002 14.127 3.11293 14.0457 2.19765 13.4357C2.06501 13.3476 1.8992 13.3476 1.76655 13.4221C1.50788 13.5713 1.48799 13.944 1.72675 14.127C3.11293 15.1844 5.04959 15.3267 6.61484 14.3033C7.19849 13.9169 7.66276 13.4086 7.99438 12.8189C8.00101 12.8189 8.00101 12.8189 8.00764 12.8189C8.37243 13.4628 8.89639 14.0186 9.57289 14.4117C11.105 15.3132 12.9488 15.1437 14.2819 14.127C14.5207 13.944 14.5008 13.5713 14.2421 13.4154C14.1095 13.334 13.9436 13.3408 13.811 13.4289C12.8692 14.0593 11.6157 14.127 10.5876 13.4696C10.1897 13.212 9.86472 12.8731 9.63258 12.48C11.1846 11.8158 12.2789 10.2501 12.2789 8.43367C12.2789 8.23033 12.2656 8.03378 12.2391 7.844C12.7233 7.85755 13.2141 7.98633 13.6651 8.25067C14.6732 8.84711 15.2104 9.9519 15.1507 11.0702C15.1441 11.2261 15.2237 11.382 15.3563 11.4566C15.615 11.6057 15.94 11.443 15.9732 11.138C16.1655 9.39612 15.3166 7.6 13.6651 6.73244ZM9.83819 5.91232C9.33412 6.32577 8.69078 6.56977 8.00764 6.56977C7.29798 6.56977 6.64137 6.31899 6.12404 5.89199C6.64137 5.49887 7.27808 5.26843 7.96785 5.26843C8.67088 5.2752 9.32086 5.51243 9.83819 5.91232ZM4.87715 8.44044C4.87715 8.31167 4.88378 8.18289 4.90368 8.05411C5.52049 8.29133 6.06435 8.73867 6.41586 9.36223C6.77401 9.99257 6.88677 10.6975 6.78728 11.3617C5.65977 10.8805 4.87715 9.75534 4.87715 8.44044ZM9.21474 11.3414C9.12189 10.6839 9.22801 9.99934 9.57289 9.38256C9.91778 8.759 10.4484 8.31844 11.0519 8.06767C11.0652 8.18967 11.0718 8.31167 11.0718 8.44044C11.0718 9.73501 10.3091 10.8466 9.21474 11.3414Z" fill="%23ff9800"/></svg>`;
    } else
      url = `data:image/svg+xml;utf-8,<svg width="24" height="24" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.6651 6.73244C13.0416 6.4071 12.3718 6.25121 11.7085 6.25121C12.0733 5.60732 12.2855 4.85498 12.2855 4.06198C12.2855 2.25908 11.2177 0.706955 9.69228 0.0359513C9.42035 -0.0860494 9.10862 0.117285 9.10862 0.422287C9.10862 0.578177 9.19484 0.727289 9.33412 0.801845C10.3422 1.31696 11.0188 2.39463 10.979 3.63497C10.9657 4.12298 10.833 4.57709 10.6142 4.98376C9.88461 4.40087 8.96934 4.0552 7.97448 4.0552C6.99288 4.0552 6.09088 4.39409 5.36794 4.96342C5.14244 4.53642 5.01643 4.04842 5.01643 3.53331C5.01643 2.34041 5.6863 1.31018 6.66126 0.808622C6.80054 0.734066 6.88677 0.591732 6.88677 0.429065C6.88677 0.124063 6.58168 -0.0792716 6.30975 0.0359513C4.7246 0.734067 3.63025 2.38108 3.71648 4.27887C3.74964 4.98376 3.94861 5.64121 4.2736 6.2241C4.26697 6.23088 4.26033 6.24443 4.26033 6.25121C3.54403 6.25799 2.81447 6.44777 2.15123 6.84088C0.61251 7.73555 -0.163482 9.45712 0.028858 11.1448C0.0620201 11.4498 0.39364 11.6192 0.652304 11.4634C0.784952 11.382 0.871174 11.2329 0.857909 11.077C0.791585 9.93157 1.3686 8.78611 2.43642 8.20322C2.84763 7.97955 3.28537 7.87111 3.72311 7.85078C3.69658 8.04055 3.68331 8.23711 3.68331 8.43367C3.68331 10.2705 4.79756 11.8497 6.36944 12.5004C6.11741 12.9138 5.76589 13.2663 5.32815 13.5306C4.32002 14.127 3.11293 14.0457 2.19765 13.4357C2.06501 13.3476 1.8992 13.3476 1.76655 13.4221C1.50788 13.5713 1.48799 13.944 1.72675 14.127C3.11293 15.1844 5.04959 15.3267 6.61484 14.3033C7.19849 13.9169 7.66276 13.4086 7.99438 12.8189C8.00101 12.8189 8.00101 12.8189 8.00764 12.8189C8.37243 13.4628 8.89639 14.0186 9.57289 14.4117C11.105 15.3132 12.9488 15.1437 14.2819 14.127C14.5207 13.944 14.5008 13.5713 14.2421 13.4154C14.1095 13.334 13.9436 13.3408 13.811 13.4289C12.8692 14.0593 11.6157 14.127 10.5876 13.4696C10.1897 13.212 9.86472 12.8731 9.63258 12.48C11.1846 11.8158 12.2789 10.2501 12.2789 8.43367C12.2789 8.23033 12.2656 8.03378 12.2391 7.844C12.7233 7.85755 13.2141 7.98633 13.6651 8.25067C14.6732 8.84711 15.2104 9.9519 15.1507 11.0702C15.1441 11.2261 15.2237 11.382 15.3563 11.4566C15.615 11.6057 15.94 11.443 15.9732 11.138C16.1655 9.39612 15.3166 7.6 13.6651 6.73244ZM9.83819 5.91232C9.33412 6.32577 8.69078 6.56977 8.00764 6.56977C7.29798 6.56977 6.64137 6.31899 6.12404 5.89199C6.64137 5.49887 7.27808 5.26843 7.96785 5.26843C8.67088 5.2752 9.32086 5.51243 9.83819 5.91232ZM4.87715 8.44044C4.87715 8.31167 4.88378 8.18289 4.90368 8.05411C5.52049 8.29133 6.06435 8.73867 6.41586 9.36223C6.77401 9.99257 6.88677 10.6975 6.78728 11.3617C5.65977 10.8805 4.87715 9.75534 4.87715 8.44044ZM9.21474 11.3414C9.12189 10.6839 9.22801 9.99934 9.57289 9.38256C9.91778 8.759 10.4484 8.31844 11.0519 8.06767C11.0652 8.18967 11.0718 8.31167 11.0718 8.44044C11.0718 9.73501 10.3091 10.8466 9.21474 11.3414Z" fill="%23f44336"/></svg>`;
    return {
      url: url,
    };
  }
  return null;
};
