import React from "react";
import { numberWithCommas } from "../../utils/utilMethods";
import moment from "moment";
import { Typography } from "@material-ui/core";

export const SHIPMENT_COLUMNS = [
  { id: "id", width: 150, maxWidth: 150 },
  {
    id: "estimated_time_of_arrival",
    width: 150,
    maxWidth: 150,
    minWidth: 100,
    format: (value) => value && moment(value).format("yyyy/MM/DD"),
  },
  { id: "name", width: 150, maxWidth: 150, minWidth: 100 },
  { id: "custodian_name", width: 150, maxWidth: 150, minWidth: 100 },
  {
    id: "value",
    width: 150,
    maxWidth: 150,
    minWidth: 100,
    format: (value) => (value ? `$${numberWithCommas(value)}` : "-"),
  },
  { id: "status", width: 100, maxWidth: 150, minWidth: 100 },
  {
    id: "shipment_flag",
    width: 100,
    maxWidth: 150,
    minWidth: 100,

    format: (value, row) => {
      if (row) {
        return (
          <Typography
            variant="body1"
            color={row.flag_type === "Warning" ? "primary" : "error"}
          >
            {value}
          </Typography>
        );
      }
      return value;
    },
  },
];

export const getFormattedRow = (
  shipmentData,
  custodianData,
  itemData,
  shipmentFlag
) => {
  let shipmentList = [...shipmentData];
  shipmentList.forEach((list) => {
    let shipmentValue = 0;
    let custodianNames = "";
    if (custodianData && list.custodian_ids.length) {
      custodianData.forEach((custodian) => {
        if (list.custodian_ids.indexOf(custodian.custodian_uuid) !== -1) {
          custodianNames = custodianNames + custodian.name + ", ";
          list["custodian_name"] = custodianNames;
        }
      });
    }
    if (itemData && list.item_ids.length) {
      itemData.forEach((item) => {
        if (list.item_ids.indexOf(item.item_uuid) !== -1) {
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
          }
        });
    }
  });
  return shipmentList;
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
    format: (value) => value && moment(value).format("yyyy/MM/DD"),
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
