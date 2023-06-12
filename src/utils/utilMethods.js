import _ from 'lodash';

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

export const uomDistanceUpdate = (currentUom, radius) => {
  let convertedRadius = 0;
  switch (true) {
    case _.toLower(currentUom) === 'kilometers':
      convertedRadius = radius / 0.62137;
      break;

    case _.toLower(currentUom) === 'miles':
      convertedRadius = radius * 0.62137;
      break;

    default:
      convertedRadius = radius;
      break;
  }

  return convertedRadius;
};
