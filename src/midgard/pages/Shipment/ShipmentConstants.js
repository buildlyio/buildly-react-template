import React from "react";
import { numberWithCommas } from "../../utils/utilMethods";
import moment from "moment";
import { Typography, List, ListItem } from "@material-ui/core";
import { TempIcon, HumidIcon, DelayIcon } from "../../components/Icons/Icons";

export const SHIPMENT_COLUMNS = [
  { id: "id", width: 150, maxWidth: 150 },
  {
    id: "estimated_time_of_arrival",
    width: 150,
    maxWidth: 150,
    minWidth: 150,
    format: (value) =>
      value && value !== "-" ? moment(value).format("MM/DD/yyyy") : value,
  },
  { id: "name", width: 150, maxWidth: 150, minWidth: 150 },
  { id: "status", width: 100, maxWidth: 100, minWidth: 100 },
  {
    id: "shipment_flag",
    width: 100,
    maxWidth: 200,
    minWidth: 100,
    format: (value, row) => {
      if (row && row.flag_list && value && value !== "-") {
        return (
          <React.Fragment>
            {row.flag_list.map((obj, idx) => {
              if (obj.name.toLowerCase().includes("temp")) {
                return (
                  <TempIcon
                    color={
                      obj.type.toLowerCase() === "warning"
                        ? "#ff9800"
                        : "#f44336"
                    }
                  />
                );
              } else if (obj.name.toLowerCase().includes("humid")) {
                return (
                  <HumidIcon
                    color={
                      obj.type.toLowerCase() === "warning"
                        ? "#ff9800"
                        : "#f44336"
                    }
                  />
                );
              } else if (obj.name.toLowerCase().includes("delay")) {
                return (
                  <DelayIcon
                    color={
                      obj.type.toLowerCase() === "warning"
                        ? "#ff9800"
                        : "#f44336"
                    }
                  />
                );
              }
              // else if (obj.name.toLowerCase().includes("recall")) {
              //   return (
              //     <Recall
              //       color={
              //         obj.type.toLowerCase() === "warning"
              //           ? "#ff9800"
              //           : "#f44336"
              //       }
              //     />
              //   );
              // }
            })}
          </React.Fragment>
        );
      }
      return value;
    },
  },
  { id: "custodian_name", width: 200, maxWidth: 200, minWidth: 200 },
  {
    id: "value",
    width: 150,
    maxWidth: 150,
    minWidth: 150,
    format: (value) =>
      value && value !== "-" ? `$${numberWithCommas(value)}` : value,
  },
];

export const getFormattedRow = (
  shipmentData,
  custodianData,
  itemData,
  shipmentFlag,
  custodyData
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

    if (itemData && list.items && list.items.length) {
      itemData.forEach((item) => {
        if (list.items.indexOf(item.url) !== -1) {
          shipmentValue += item.value;
          list["value"] = shipmentValue;
        }
      });
    }
    if (shipmentFlag && shipmentFlag.length) {
      shipmentFlag &&
        shipmentFlag.forEach((flag) => {
          if (list.flags.indexOf(flag.url) !== -1 && flag.type !== "None") {
            list["shipment_flag"] = flag.name;
            list["flag_type"] = flag.type;
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
    id: "has_current_custody",
    label: "Current Custody",
    minWidth: 100,
    format: (value) => (value === true ? "YES" : "NO"),
  },
  {
    id: "first_custody",
    label: "First Custody",
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
      rowItem["location"] = `${
        contactInfoItem.address1 && `${contactInfoItem.address1},`
      }
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
  if (flag && flag.toLowerCase() === "humidity") {
    let url = "";
    if (flagType.toLowerCase() === "warning") {
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23ff9800" d="M5.636 6.636L12 .272l6.364 6.364a9 9 0 1 1-12.728 0z"/></svg>`;
    } else
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23f44336" d="M5.636 6.636L12 .272l6.364 6.364a9 9 0 1 1-12.728 0z"/></svg>`;
    return {
      url: url,
    };
  } else if (flag && flag.toLowerCase() === "temperature") {
    let url = "";
    if (flagType.toLowerCase() === "warning") {
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23ff9800" d="M8 5a4 4 0 1 1 8 0v5.255a7 7 0 1 1-8 0V5zm1.144 6.895a5 5 0 1 0 5.712 0L14 11.298V5a2 2 0 1 0-4 0v6.298l-.856.597zm1.856.231V5h2v7.126A4.002 4.002 0 0 1 12 20a4 4 0 0 1-1-7.874zM12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>`;
    } else
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23f44336" d="M8 5a4 4 0 1 1 8 0v5.255a7 7 0 1 1-8 0V5zm1.144 6.895a5 5 0 1 0 5.712 0L14 11.298V5a2 2 0 1 0-4 0v6.298l-.856.597zm1.856.231V5h2v7.126A4.002 4.002 0 0 1 12 20a4 4 0 0 1-1-7.874zM12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>`;
    return {
      url: url,
    };
  } else if (flag && flag.toLowerCase() === "delay") {
    let url = "";
    if (flagType.toLowerCase() === "warning") {
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23ff9800" d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm3.536 5.05L10.586 12 12 13.414l4.95-4.95-1.414-1.414z"/></svg>`;
    } else
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23f44336" d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm3.536 5.05L10.586 12 12 13.414l4.95-4.95-1.414-1.414z"/></svg>`;
    return {
      url: url,
    };
  } else if (flag && flag.toLowerCase() === "recall") {
    let url = "";
    if (flagType.toLowerCase() === "warning") {
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23ff9800" d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 9V8l-4 4 4 4v-3h4v-2h-4z"/></svg>`;
    } else
      url = `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="%23f44336" d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 9V8l-4 4 4 4v-3h4v-2h-4z"/></svg>`;
    return {
      url: url,
    };
  }
  return null;
};
