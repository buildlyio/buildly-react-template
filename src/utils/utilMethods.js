export const numberWithCommas = (x) => {
  if (!x) return '';
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
        && !group.is_global
        && Object.keys(group.permissions).every(
          (permission) => group.permissions[permission] === true,
        )
      ) {
        isAdmin = true;
      }
    });
  }
  return isAdmin;
};

export const setOptionsData = (options, fieldName) => {
  let result = null;
  const optionKeys = Object.keys(options);
  if (optionKeys.includes(fieldName)) {
    result = options[fieldName];
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
  let returnValue = null;
  switch (_class) {
    case 'temperature':
      if (
        sourceUnit === 'fahrenheit'
        && destinationUnit === 'celsius'
      ) {
        returnValue = (((value - 32) * 5) / 9).toFixed(2);
      }
      if (
        sourceUnit === 'celsius'
        && destinationUnit === 'fahrenheit'
      ) {
        returnValue = ((value * 9) / 5 + 32).toFixed(2);
      }
      break;

    case 'distance':
      if (
        sourceUnit === 'km'
        && destinationUnit === 'miles'
      ) {
        returnValue = (value * 0.6214).toFixed(2);
      }
      if (
        sourceUnit === 'miles'
        && destinationUnit === 'km'
      ) {
        returnValue = (value / 0.6214).toFixed(2);
      }
      break;

    default:
      break;
  }
  return returnValue;
};
