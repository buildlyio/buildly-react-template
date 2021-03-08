export const CLEAR_DATA = "IMPORT-EXPORT/CLEAR_DATA";

export const GET_API_RESPONSE = "IMPORT-EXPORT/GET_API_RESPONSE";
export const GET_API_RESPONSE_SUCCESS = "IMPORT-EXPORT/GET_API_RESPONSE_SUCCESS";
export const GET_API_RESPONSE_FAILURE = "IMPORT-EXPORT/GET_API_RESPONSE_FAILURE";

export const GET_EXPORT_DATA = "IMPORT-EXPORT/GET_EXPORT_DATA";
export const GET_EXPORT_DATA_SUCCESS = "IMPORT-EXPORT/GET_EXPORT_DATA_SUCCESS";
export const GET_EXPORT_DATA_FAILURE = "IMPORT-EXPORT/GET_EXPORT_DATA_FAILURE";

export const clearData = () => ({
  type: CLEAR_DATA,
});

export const getApiResponse = (url, header) => ({
  type: GET_API_RESPONSE,
  url,
  header,
});

export const getExportData = (model, fileType) => ({
  type: GET_EXPORT_DATA,
  model,
  fileType,
});