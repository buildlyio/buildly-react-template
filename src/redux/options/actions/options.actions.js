import { environment } from '@environments/environment';
import { httpService } from '@modules/http/http.service';

// Options Actions Types
export const GET_CUSTODIAN_OPTIONS = 'OPTIONS/GET_CUSTODIAN_OPTIONS';
export const GET_CUSTODIAN_OPTIONS_SUCCESS = 'OPTIONS/GET_CUSTODIAN_OPTIONS_SUCCESS';
export const GET_CUSTODIAN_OPTIONS_FAILURE = 'OPTIONS/GET_CUSTODIAN_OPTIONS_FAILURE';

export const GET_CONTACT_OPTIONS = 'OPTIONS/GET_CONTACT_OPTIONS';
export const GET_CONTACT_OPTIONS_SUCCESS = 'OPTIONS/GET_CONTACT_OPTIONS_SUCCESS';
export const GET_CONTACT_OPTIONS_FAILURE = 'OPTIONS/GET_CONTACT_OPTIONS_FAILURE';

export const GET_ITEM_OPTIONS = 'OPTIONS/GET_ITEM_OPTIONS';
export const GET_ITEM_OPTIONS_SUCCESS = 'OPTIONS/GET_ITEM_OPTIONS_SUCCESS';
export const GET_ITEM_OPTIONS_FAILURE = 'OPTIONS/GET_ITEM_OPTIONS_FAILURE';

export const GET_PRODUCTS_OPTIONS = 'OPTIONS/GET_PRODUCTS_OPTIONS';
export const GET_PRODUCTS_OPTIONS_SUCCESS = 'OPTIONS/GET_PRODUCTS_OPTIONS_SUCCESS';
export const GET_PRODUCTS_OPTIONS_FAILURE = 'OPTIONS/GET_PRODUCTS_OPTIONS_FAILURE';

// Custodian Options call
export const getCustodianOptions = () => (dispatch) => {
  dispatch({ type: GET_CUSTODIAN_OPTIONS });
  httpService
    .makeOptionsRequest(
      'options',
      `${environment.API_URL}custodian/custodian/`,
      true,
    )
    .then((response) => response.json())
    .then((data) => {
      dispatch({ type: GET_CUSTODIAN_OPTIONS_SUCCESS, data });
    })
    .catch((error) => {
      dispatch({ type: GET_CUSTODIAN_OPTIONS_FAILURE, error });
    });
};

// Contact Options call
export const getContactOptions = () => (dispatch) => {
  dispatch({ type: GET_CONTACT_OPTIONS });
  httpService
    .makeOptionsRequest(
      'options',
      `${environment.API_URL}custodian/contact/`,
      true,
    )
    .then((response) => response.json())
    .then((data) => {
      dispatch({ type: GET_CONTACT_OPTIONS_SUCCESS, data });
    })
    .catch((error) => {
      dispatch({ type: GET_CONTACT_OPTIONS_FAILURE, error });
    });
};

// Items Options call
export const getItemsOptions = () => (dispatch) => {
  dispatch({ type: GET_ITEM_OPTIONS });
  httpService
    .makeOptionsRequest(
      'options',
      `${environment.API_URL}shipment/item/`,
      true,
    )
    .then((response) => response.json())
    .then((data) => {
      dispatch({ type: GET_ITEM_OPTIONS_SUCCESS, data });
    })
    .catch((error) => {
      dispatch({ type: GET_ITEM_OPTIONS_FAILURE, error });
    });
};

// Products Options call
export const getProductsOptions = () => (dispatch) => {
  dispatch({ type: GET_PRODUCTS_OPTIONS });
  httpService
    .makeOptionsRequest(
      'options',
      `${environment.API_URL}shipment/product/`,
      true,
    )
    .then((response) => response.json())
    .then((data) => {
      dispatch({ type: GET_PRODUCTS_OPTIONS_SUCCESS, data });
    })
    .catch((error) => {
      dispatch({ type: GET_PRODUCTS_OPTIONS_FAILURE, error });
    });
};
