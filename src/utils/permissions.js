export const hasGlobalAdminRights = (userData) => {
  const isGlobalAdmin = userData.core_groups.some(
    (group) => group.is_global && Object.keys(group.permissions).every(
      (permission) => group.permissions[permission] === true,
    ),
  );
  return isGlobalAdmin;
};

export const hasAdminRights = (userData) => {
  const isAdmin = userData.core_groups.some(
    (group) => !group.is_global && group.is_org_level && Object.keys(group.permissions).every(
      (permission) => group.permissions[permission] === true,
    ),
  );
  return isAdmin;
};
