export const LOAD_DATA_COREGROUP = 'LOAD_DATA_COREGROUP';
export const LOAD_DATA_COREGROUP_COMMIT = 'LOAD_DATA_COREGROUP_COMMIT';
export const LOAD_DATA_COREGROUP_FAIL = 'LOAD_DATA_COREGROUP_FAIL';

export const CREATE_COREGROUP = 'CREATE_COREGROUP';
export const CREATE_COREGROUP_COMMIT = 'CREATE_COREGROUP_COMMIT';
export const CREATE_COREGROUP_FAIL = 'CREATE_COREGROUP_FAIL';

export const UPDATE_COREGROUP = 'UPDATE_COREGROUP';
export const UPDATE_COREGROUP_COMMIT = 'UPDATE_COREGROUP_COMMIT';
export const UPDATE_COREGROUP_FAIL = 'UPDATE_COREGROUP_FAIL';

export const DELETE_COREGROUP = 'DELETE_COREGROUP';
export const DELETE_COREGROUP_COMMIT = 'DELETE_COREGROUP_COMMIT';
export const DELETE_COREGROUP_FAIL = 'DELETE_COREGROUP_FAIL';

/**
 * Get core group list
 */
export const getCoregroups = () => ({
  type: LOAD_DATA_COREGROUP,
});

/**
 * create core group
 * @param {{name}} data
 */
export const createCoregroups = (data) => ({
  type: CREATE_COREGROUP,
  data,
});

/**
 * update core group
 * @param {{name}} data
 */
export const updateCoregroups = (data) => ({
  type: UPDATE_COREGROUP,
  data,
});

/**
 * delete core group
 * @param {{id}} data
 */
export const deleteCoregroups = (data) => ({
  type: DELETE_COREGROUP,
  data,
});
