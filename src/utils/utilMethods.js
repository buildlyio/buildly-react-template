import { environment } from '@environments/environment';

export const { MAP_API_KEY, MAP_API_URL, GEO_CODE_API } = environment;

export const numberWithCommas = (x) => {
  if (!x) return '';
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const searchFilter = (payload) => {
  const { searchItem, searchList, searchFields } = payload;
  const data = searchList.filter((item) => {
    const itemKeys = Object.keys(item);
    let foundItem = '';
    itemKeys.forEach((key) => {
      if (
        searchFields.includes(key)
        && item[key]
        && item[key].toString().includes(searchItem)
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
    userData.core_groups.forEach((group) => {
      if (
        group.is_global
        && Object.keys(group.permissions).every(
          (permission) => group.permissions[permission] === true,
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
    userData.core_groups.forEach((group) => {
      if (
        group.is_org_level
        && Object.keys(group.permissions).every(
          (permission) => group.permissions[permission] === true,
        )
        && !group.is_global
      ) {
        isAdmin = true;
      }
    });
  }
  return isAdmin;
};

export const setOptionsData = (options, fieldName) => {
  const result = null;
  const optionKeys = Object.keys(options);
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
  _class,
) => {
  switch (_class) {
    case 'temperature':
      if (sourceUnit === 'fahrenheit' && destinationUnit === 'celsius') {
        return (((value - 32) * 5) / 9).toFixed(2);
      }
      if (sourceUnit === 'celsius' && destinationUnit === 'fahrenheit') {
        return ((value * 9) / 5 + 32).toFixed(2);
      }
      return null;

    case 'distance':
      if (sourceUnit === 'km' && destinationUnit === 'miles') {
        return (value * 0.6214).toFixed(2);
      }
      if (sourceUnit === 'miles' && destinationUnit === 'km') {
        return (value / 0.6214).toFixed(2);
      }
      return null;

    default:
      return null;
  }
};
