export const CLEAR_DATA = "IMPORT-EXPORT/CLEAR_DATA";

export const ADD_FROM_FILE = "IMPORT-EXPORT/ADD_FROM_FILE";
export const ADD_FROM_FILE_SUCCESS = "IMPORT-EXPORT/ADD_FROM_FILE_SUCCESS";
export const ADD_FROM_FILE_FAILURE = "IMPORT-EXPORT/ADD_FROM_FILE_FAILURE";

export const GET_API_RESPONSE = "IMPORT-EXPORT/GET_API_RESPONSE";
export const GET_API_RESPONSE_SUCCESS = "IMPORT-EXPORT/GET_API_RESPONSE_SUCCESS";
export const GET_API_RESPONSE_FAILURE = "IMPORT-EXPORT/GET_API_RESPONSE_FAILURE";

export const GET_EXPORT_DATA = "IMPORT-EXPORT/GET_EXPORT_DATA";
export const GET_EXPORT_DATA_SUCCESS = "IMPORT-EXPORT/GET_EXPORT_DATA_SUCCESS";
export const GET_EXPORT_DATA_FAILURE = "IMPORT-EXPORT/GET_EXPORT_DATA_FAILURE";

export const ADD_API_SETUP = "IMPORT-EXPORT/ADD_API_SETUP";
export const ADD_API_SETUP_SUCCESS = "IMPORT-EXPORT/ADD_API_SETUP_SUCCESS";
export const ADD_API_SETUP_FAILURE = "IMPORT-EXPORT/ADD_API_SETUP_FAILURE";

export const clearData = () => ({
  type: CLEAR_DATA,
});

 export const addFromFile = (model, formData) => ({
  type: ADD_FROM_FILE,
  model,
  formData,
});

/**
 *Add API Setup
 * @param {String} url
 * @param {String} header
 */
export const getApiResponse = (url, header) => ({
  type: GET_API_RESPONSE,
  url,
  header,
});

/**
 *Add API Setup
 * @param {String} model
 * @param {String} fileType
 */
export const getExportData = (model, fileType) => ({
  type: GET_EXPORT_DATA,
  model,
  fileType,
});

/**
 *Add API Setup
 * @param {String} url
 * @param {String} key_name
 * @param {String} key_placement
 * @param {String} key_value
 * @param {String} values_to_pick_response_from
 * @param {String} table_name
 * @param {Object} mapping
 * @param {Object} platform_name
 */
export const addApiSetup = (
  url,
  key_name,
  key_placement,
  key_value,
  values_to_pick_response_from,
  table_name,
  mapping,
  platform_name,
) => ({
  type: ADD_API_SETUP,
  payload: {
    url,
    key_name,
    key_placement,
    key_value,
    values_to_pick_response_from,
    table_name,
    mapping,
    platform_name,
  },
});