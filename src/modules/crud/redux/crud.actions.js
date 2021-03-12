// CRUD Action Types
export const CRUD_LOAD_DATA = "CRUD_LOAD_DATA";
export const CRUD_LOAD_DATA_COMMIT = "CRUD_LOAD_DATA_COMMIT";
export const CRUD_LOAD_DATA_FAIL = "CRUD_LOAD_DATA_FAIL";

export const CRUD_CREATE = "CRUD_CREATE";
export const CRUD_CREATE_COMMIT = "CRUD_CREATE_COMMIT";
export const CRUD_CREATE_FAIL = "CRUD_CREATE_FAIL";

export const CRUD_UPDATE = "CRUD_UPDATE";
export const CRUD_UPDATE_COMMIT = "CRUD_UPDATE_COMMIT";
export const CRUD_UPDATE_FAIL = "CRUD_UPDATE_FAIL";

export const CRUD_DELETE = "CRUD_DELETE";
export const CRUD_DELETE_COMMIT = "CRUD_DELETE_COMMIT";
export const CRUD_DELETE_FAIL = "CRUD_DELETE_FAIL";

/**
 * function to call to load data.
 * @param {string} endpoint - endpoint to make the call
 * @param {string} idProp - id to get the data
 * @param {string} dataProp - field name where the data will be in response.
 */
export function crudLoadData(endpoint, idProp, dataProp) {
  return {
    type: CRUD_LOAD_DATA,
    endpoint,
    idProp,
    dataProp
  };
}

/**
 * function called in response to success of load data.
 * @param {string} endpoint - endpoint to make the call
 * @param {string} idProp - id to get the data
 * @param {string} dataProp - field name where the data will be in response.
 * @param {object} data - response object
 */
export function crudLoadDataCommit(data, endpoint, idProp, dataProp) {
  return {
    type: CRUD_LOAD_DATA_COMMIT,
    endpoint,
    idProp,
    dataProp,
    data
  };
}

/**
 * function to call in response of failure of load data.
 * @param {string} endpoint - endpoint to make the call
 * @param {object} error
 */
export function crudLoadDataFail(error, endpoint) {
  return {
    type: CRUD_LOAD_DATA_FAIL,
    endpoint,
    error
  };
}

/**
 * function to call to create data.
 * @param {string} endpoint - endpoint to make the call
 * @param {string} idProp - id to get the data
 * @param {string} dataProp - field name where the data will be in response.
 */
export function crudCreate(data, endpoint, idProp, dataProp) {
  return {
    type: CRUD_CREATE,
    endpoint,
    idProp,
    dataProp,
    data
  };
}

/**
 * function called in response to success of create data.
 * @param {string} endpoint - endpoint to make the call
 * @param {string} idProp - id type to get the data e.g id or uuid
 * @param {string} dataProp - field name where the data will be in response.
 * @param {object} data - response object
 */
export function crudCreateCommit(data, endpoint, idProp, dataProp) {
  return {
    type: CRUD_CREATE_COMMIT,
    endpoint,
    idProp,
    dataProp,
    data
  };
}

/**
 * function to call in response of failure of create data.
 * @param {string} endpoint - endpoint to make the call
 * @param {object} error
 */
export function crudCreateFail(error, endpoint ) {
  return {
    type: CRUD_CREATE_FAIL,
    endpoint,
    error
  };
}

/**
 * function to call to create data.
 * @param {object} data - data to update.
 * @param {string} endpoint - endpoint to make the call
 * @param {string} idProp - id type to get the data from object
 * @param {string} dataProp - field name where the data will be in response.
 */
export function crudUpdate(data, endpoint, idProp, dataProp) {
  return {
    type: CRUD_UPDATE,
    endpoint,
    idProp,
    dataProp,
    data
  };
}

/**
 * function called in response to success of create data.
 * @param {string} endpoint - endpoint to make the call
 * @param {string} idProp - id type to get the data
 * @param {string} dataProp - field name where the data will be in response.
 * @param {object} data - response object
 */
export function crudUpdateCommit(data, endpoint, idProp, dataProp) {
  return {
    type: CRUD_UPDATE_COMMIT,
    data,
    endpoint,
    idProp,
    dataProp,
  };
}

/**
 * function to call in response of failure of create data.
 * @param {string} endpoint - endpoint to make the call
 * @param {object} error
 */
export function crudUpdateFail(error, endpoint) {
  return {
    type: CRUD_UPDATE_FAIL,
    endpoint,
    error
  };
}

/**
 * function to call to create data.
 * @param {object} data - data to update.
 * @param {string} endpoint - endpoint to make the call
 * @param {string} idProp - id type to get the data from object
 * @param {string} dataProp - field name where the data will be in response.
 */
export function crudDelete(data, endpoint, idProp, dataProp) {
  return {
    type: CRUD_DELETE,
    data,
    endpoint,
    idProp,
    dataProp,
  };
}

/**
 * function called in response to success of create data.
 * @param {string} endpoint - endpoint to make the call
 * @param {string} idProp - id type to get the data
 * @param {string} dataProp - field name where the data will be in response.
 * @param {object} data - response object
 */
export function crudDeleteCommit(data, endpoint, idProp, dataProp) {
  return {
    type: CRUD_DELETE_COMMIT,
    data,
    endpoint,
    idProp,
    dataProp,
  };
}

/**
 * function to call in response of failure of create data.
 * @param {string} endpoint - endpoint to make the call
 * @param {object} error
 */
export function crudDeleteFail(error, endpoint) {
  return {
    type: CRUD_DELETE_FAIL,
    endpoint,
    error
  };
}
