import moment from "moment";
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

export const getFormattedRow = (data, contactInfo, custodyData) => {
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
    });
  }

  return customizedRow;
};
