export const LOAD_DATA_COREGROUP = 'LOAD_DATA_COREGROUP';
export const LOAD_DATA_COREGROUP_SUCCESS = 'LOAD_DATA_COREGROUP_SUCCESS';
export const LOAD_DATA_COREGROUP_FAIL = 'LOAD_DATA_COREGROUP_FAIL';

export const CREATE_COREGROUP = 'CREATE_COREGROUP';
export const CREATE_COREGROUP_SUCCESS = 'CREATE_COREGROUP_SUCCESS';
export const CREATE_COREGROUP_FAIL = 'CREATE_COREGROUP_FAIL';

export const UPDATE_COREGROUP = 'UPDATE_COREGROUP';
export const UPDATE_COREGROUP_SUCCESS = 'UPDATE_COREGROUP_SUCCESS';
export const UPDATE_COREGROUP_FAIL = 'UPDATE_COREGROUP_FAIL';

export const DELETE_COREGROUP = 'DELETE_COREGROUP';
export const DELETE_COREGROUP_SUCCESS = 'DELETE_COREGROUP_SUCCESS';
export const DELETE_COREGROUP_FAIL = 'DELETE_COREGROUP_FAIL';
/**
 * Get core groups action
 * @param {{username, password}} credentials
 */
export const getCoreGroups = () => ({ type: LOAD_DATA_COREGROUP });

/**
 * create core groups action
 * @param {{ first_name, last_name}} data
 */
export const createCoreGroups = (data) => ({ type: CREATE_COREGROUP, data });

/**
 * update core groups action
 * @param {{ first_name, last_name}} data
 */
export const updateCoreGroups = (data) => ({ type: UPDATE_COREGROUP, data });

/**
 * delete core groups action
 * @param {{ first_name, last_name}} data
 */
export const deleteCoreGroups = (data) => ({ type: DELETE_COREGROUP, data });