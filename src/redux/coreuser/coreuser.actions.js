export const LOAD_DATA_COREUSER = 'LOAD_DATA_COREUSER';
export const LOAD_DATA_COREUSER_COMMIT = 'LOAD_DATA_COREUSER_COMMIT';
export const LOAD_DATA_COREUSER_FAIL = 'LOAD_DATA_COREUSER_FAIL';

export const CREATE_COREUSER = 'CREATE_COREUSER';
export const CREATE_COREUSER_COMMIT = 'CREATE_COREUSER_COMMIT';
export const CREATE_COREUSER_FAIL = 'CREATE_COREUSER_FAIL';

export const UPDATE_COREUSER = 'UPDATE_COREUSER';
export const UPDATE_COREUSER_COMMIT = 'UPDATE_COREUSER_COMMIT';
export const UPDATE_COREUSER_FAIL = 'UPDATE_COREUSER_FAIL';

export const DELETE_COREUSER = 'DELETE_COREUSER';
export const DELETE_COREUSER_COMMIT = 'DELETE_COREUSER_COMMIT';
export const DELETE_COREUSER_FAIL = 'DELETE_COREUSER_FAIL';

/**
 * Load Core User
 */
export const loadCoreuserData = () => ({
  type: LOAD_DATA_COREUSER,
});

/**
 * Load Core User data commit
 * @param {Object} data
 */
export const loadCoreuserDataCommit = (data) => ({
  type: LOAD_DATA_COREUSER_COMMIT,
  data,
});

/**
 * Load Core User data fail
 * @param {String} error
 */
export const loadCoreuserDataFail = (error) => ({
  type: LOAD_DATA_COREUSER_FAIL,
  error,
});

/**
 * Create Core User
 * @param {Object} data
 */
export const createCoreUser = (data) => ({
  type: CREATE_COREUSER,
  data,
});

/**
 * Create Core User commit
 * @param {Object} data
 */
export const createCoreUserCommit = (data) => ({
  type: CREATE_COREUSER_COMMIT,
  data,
});

/**
 * Create Core User fail
 * @param {String} error
 */
export const createCoreUserFail = (error) => ({
  type: CREATE_COREUSER_FAIL,
  error,
});

/**
 * Update Core User
 * @param {Object} data
 */
export const updateCoreUser = (data) => ({
  type: UPDATE_COREUSER,
  data,
});

/**
 * Update Core User commit
 * @param {Object} data
 */
export const updateCoreUserCommit = (data) => ({
  type: UPDATE_COREUSER_COMMIT,
  data,
});

/**
 * Update Core User fail
 * @param {String} error
 */
export const updateCoreUserFail = (error) => ({
  type: UPDATE_COREUSER_FAIL,
  error,
});

/**
 * Delete Core User
 * @param {Object} data
 */
export const deleteCoreUser = (data) => ({
  type: DELETE_COREUSER,
  data,
});

/**
 * Delete Core User commit
 * @param {Object} data
 */
export const deleteCoreUserCommit = (data) => ({
  type: DELETE_COREUSER_COMMIT,
  data,
});

/**
 * Delete Core User fail
 * @param {String} error
 */
export const deleteCoreUserFail = (error) => ({
  type: DELETE_COREUSER_FAIL,
  error,
});
