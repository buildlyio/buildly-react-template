export const hasGlobalAdminRights = (userData) => {
  let isGlobalAdmin = userData.core_groups.some(
    (group) =>
      group.is_global &&
      Object.keys(group.permissions).every(
        (permission) => group.permissions[permission] === true
      )
  );
  return isGlobalAdmin;
};

export const hasAdminRights = (userData) => {
  let isAdmin = userData.core_groups.some(
    (group) =>
      !group.is_global &&
      group.is_org_level &&
      Object.keys(group.permissions).every(
        (permission) => group.permissions[permission] === true
      )
  );
  return isAdmin;
};
