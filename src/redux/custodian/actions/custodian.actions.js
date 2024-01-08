export const GET_CUSTODY = 'CUSTODIAN/GET_CUSTODY';
export const GET_CUSTODY_SUCCESS = 'CUSTODIAN/GET_CUSTODY_SUCCESS';
export const GET_CUSTODY_FAILURE = 'CUSTODIAN/GET_CUSTODY_FAILURE';

export const getCustody = (shipmentIds) => ({
  type: GET_CUSTODY,
  shipmentIds,
});
