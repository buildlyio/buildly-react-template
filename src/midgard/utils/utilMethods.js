export const MAP_API_KEY = "AIzaSyBcFCjQsHImeUy8jJQLW37ucWUKKmJwLd0";
export const MAP_API_URL =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyBcFCjQsHImeUy8jJQLW37ucWUKKmJwLd0&v=3.exp&libraries=geometry,drawing,places";
export const GEO_CODE_API = "AIzaSyDw-lNn69CSWKBGz97HeVuJQKIhiVLcFyE";

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
      if (group.is_global) {
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
      if (group.is_org_level && group.name.toLowerCase().includes("admin") && !group.is_global) {
        isAdmin = true;
      }
    });
  }
  return isAdmin;
}

export const setOptionsData = (options, fieldName) => {
  let result = null;
  let optionKeys = Object.keys(options);
  if (optionKeys.includes(fieldName)) {
    return options[fieldName];
  }
  // optionKeys.forEach((key) => {
  //   console.log("not found", key);
  //   let nestedObjKeys = Object.keys(options[key]);
  //   nestedObjKeys.forEach((nestedObj) => {
  //     if (typeof options[key][nestedObj] === "object") {
  //       result = setOptionsData(options[key][nestedObj], fieldName);
  //       console.log("nested", options[key][nestedObj]);
  //     }
  //   });
  // });
  return result;
};
