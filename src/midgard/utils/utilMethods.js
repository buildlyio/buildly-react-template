import { environment } from "environments/environment";

export const MAP_API_KEY = environment.MAP_API_KEY;
export const MAP_API_URL = environment.MAP_API_URL;
export const GEO_CODE_API = environment.GEO_CODE_API;

export function numberWithCommas(x) {
  if (!x) return "";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const compareSort = (propName) => {
  return function (a, b) {
    if (isNaN(parseFloat(a[propName]))) {
      if (
        a[propName] &&
        b[propName] &&
        a[propName].toUpperCase() < b[propName].toUpperCase()
      )
        return -1;
      if (
        a[propName] &&
        b[propName] &&
        a[propName].toUpperCase() > b[propName].toUpperCase()
      )
        return 1;
      return 0;
    } else {
      if (
        a[propName] &&
        b[propName] &&
        parseFloat(a[propName]) < parseFloat(b[propName])
      )
        return -1;
      if (
        a[propName] &&
        b[propName] &&
        parseFloat(a[propName]) > parseFloat(b[propName])
      )
        return 1;
      return 0;
    }
  };
};

export const searchFilter = (payload) => {
  let { searchItem, searchList, searchFields } = payload;
  let data = searchList.filter((item) => {
    let itemKeys = Object.keys(item);
    let foundItem = "";
    itemKeys.forEach((key) => {
      if (
        searchFields.includes(key) &&
        item[key] &&
        item[key].toString().includes(searchItem)
      ) {
        foundItem = { ...item };
      }
    });
    return foundItem && foundItem.id === item.id;
  });
  return data;
};

export const checkForGlobalAdmin = (userData) => {
  let isGlobalAdmin = false;
  if (userData && userData.core_groups) {
    userData.core_groups.map((group) => {
      if (
        group.is_global &&
        Object.keys(group.permissions).every(
          (permission) => group.permissions[permission] === true
        )
      ) {
        isGlobalAdmin = true;
      }
    });
  }
  return isGlobalAdmin;
};

export const checkForAdmin = (userData) => {
  let isAdmin = false;
  if (userData && userData.core_groups) {
    userData.core_groups.map((group) => {
      if (
        group.is_org_level &&
        Object.keys(group.permissions).every(
          (permission) => group.permissions[permission] === true
        ) &&
        !group.is_global
      ) {
        isAdmin = true;
      }
    });
  }
  return isAdmin;
};

export const setOptionsData = (options, fieldName) => {
  let result = null;
  let optionKeys = Object.keys(options);
  if (optionKeys.includes(fieldName)) {
    return options[fieldName];
  }
  return result;
};

/**
 * Used to convert value measured from one unit to other
 * @param {String} sourceUnit
 * @param {Number} value
 * @param {String} destinationUnit
 * @param {String} _class
 */
export const convertUnitsOfMeasure = (
  sourceUnit,
  value,
  destinationUnit,
  _class
) => {
  switch (_class) {
    case "temperature":
      if (sourceUnit === "fahrenheit" && destinationUnit === "celsius")
        value = ((value - 32) * 5) / 9;
      else if (sourceUnit === "celsius" && destinationUnit === "fahrenheit")
        value = (value * 9) / 5 + 32;
      return value.toFixed(2);
    case "distance":
      if (sourceUnit === "km" && destinationUnit === "miles")
        value = value * 0.6214;
      else if (sourceUnit == "miles" && destinationUnit === "km")
        value = value / 0.6214;
      return value.toFixed(2);
  }
};

export const getLocalDateTime = (value) => {
  const displayDate = new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const displayTime = new Date(value).toLocaleTimeString();
  return displayDate + " " + displayTime;
};
