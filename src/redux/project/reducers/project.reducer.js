import {
  GET_PRODUCTTEAMS,
  GET_PRODUCTTEAMS_SUCCESS,
  GET_PRODUCTTEAMS_FAILURE,
  ADD_PRODUCTTEAM,
  ADD_PRODUCTTEAM_SUCCESS,
  ADD_PRODUCTTEAM_FAILURE,
  UPDATE_PRODUCTTEAM,
  UPDATE_PRODUCTTEAM_SUCCESS,
  UPDATE_PRODUCTTEAM_FAILURE,
  DELETE_PRODUCTTEAM,
  DELETE_PRODUCTTEAM_SUCCESS,
  DELETE_PRODUCTTEAM_FAILURE,
  GET_PRODUCTS,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  ADD_PRODUCT,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAILURE,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  GET_THIRDPARTYTOOLS,
  GET_THIRDPARTYTOOLS_SUCCESS,
  GET_THIRDPARTYTOOLS_FAILURE,
  ADD_THIRDPARTYTOOL,
  ADD_THIRDPARTYTOOL_SUCCESS,
  ADD_THIRDPARTYTOOL_FAILURE,
  UPDATE_THIRDPARTYTOOL,
  UPDATE_THIRDPARTYTOOL_SUCCESS,
  UPDATE_THIRDPARTYTOOL_FAILURE,
  DELETE_THIRDPARTYTOOL,
  DELETE_THIRDPARTYTOOL_SUCCESS,
  DELETE_THIRDPARTYTOOL_FAILURE,
  GET_CREDENTIALS,
  GET_CREDENTIALS_SUCCESS,
  GET_CREDENTIALS_FAILURE,
  ADD_CREDENTIAL,
  ADD_CREDENTIAL_SUCCESS,
  ADD_CREDENTIAL_FAILURE,
  UPDATE_CREDENTIAL,
  UPDATE_CREDENTIAL_SUCCESS,
  UPDATE_CREDENTIAL_FAILURE,
  DELETE_CREDENTIAL,
  DELETE_CREDENTIAL_SUCCESS,
  DELETE_CREDENTIAL_FAILURE,
  GET_RELEASES,
  GET_RELEASES_SUCCESS,
  GET_RELEASES_FAILURE,
  ADD_RELEASE,
  ADD_RELEASE_SUCCESS,
  ADD_RELEASE_FAILURE,
  UPDATE_RELEASE,
  UPDATE_RELEASE_SUCCESS,
  UPDATE_RELEASE_FAILURE,
  DELETE_RELEASE,
  DELETE_RELEASE_SUCCESS,
  DELETE_RELEASE_FAILURE,
} from '../actions/project.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  productteam: null,
  product: null,
  thirdpartytool: null,
  credential: null,
  release: null,
  productFormData: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTTEAMS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_PRODUCTTEAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        productteam: action.data,
      };

    case GET_PRODUCTTEAMS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_PRODUCTTEAM:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_PRODUCTTEAM_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        productteam: action.data,
      };

    case ADD_PRODUCTTEAM_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_PRODUCTTEAM:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_PRODUCTTEAM_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        productteam: action.data,
      };

    case UPDATE_PRODUCTTEAM_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_PRODUCTTEAM:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_PRODUCTTEAM_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        productteam: action.data,
      };

    case DELETE_PRODUCTTEAM_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_PRODUCTS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        product: action.data,
      };

    case GET_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_PRODUCT:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        product: action.data,
      };

    case ADD_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_PRODUCT:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        product: action.data,
      };

    case UPDATE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_PRODUCT:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        product: action.data,
      };

    case DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_THIRDPARTYTOOLS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_THIRDPARTYTOOLS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        thirdpartytool: action.data,
      };

    case GET_THIRDPARTYTOOLS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_THIRDPARTYTOOL:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_THIRDPARTYTOOL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        thirdpartytool: action.data,
      };

    case ADD_THIRDPARTYTOOL_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_THIRDPARTYTOOL:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_THIRDPARTYTOOL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        thirdpartytool: action.data,
      };

    case UPDATE_THIRDPARTYTOOL_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_THIRDPARTYTOOL:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_THIRDPARTYTOOL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        thirdpartytool: action.data,
      };

    case DELETE_THIRDPARTYTOOL_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_CREDENTIALS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_CREDENTIALS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        credential: action.data,
      };

    case GET_CREDENTIALS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_CREDENTIAL:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_CREDENTIAL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        credential: action.data,
      };

    case ADD_CREDENTIAL_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_CREDENTIAL:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_CREDENTIAL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        credential: action.data,
      };

    case UPDATE_CREDENTIAL_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_CREDENTIAL:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_CREDENTIAL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        credential: action.data,
      };

    case DELETE_CREDENTIAL_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_RELEASES:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_RELEASES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        release: action.data,
      };

    case GET_RELEASES_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_RELEASE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_RELEASE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        release: action.data,
      };

    case ADD_RELEASE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_RELEASE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_RELEASE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        release: action.data,
      };

    case UPDATE_RELEASE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_RELEASE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_RELEASE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        release: action.data,
      };

    case DELETE_RELEASE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    default:
      return state;
  }
};
