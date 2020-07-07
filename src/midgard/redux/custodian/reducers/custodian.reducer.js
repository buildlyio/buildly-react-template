import {
  ADD_CUSTODIANS,
  ADD_CUSTODIANS_SUCCESS,
  ADD_CUSTODIANS_FAILURE,
  GET_CUSTODIANS,
  GET_CUSTODIANS_FAILURE,
  GET_CUSTODIANS_SUCCESS,
  EDIT_CUSTODIANS,
  EDIT_CUSTODIANS_SUCCESS,
  EDIT_CUSTODIANS_FAILURE,
  DELETE_CUSTODIANS,
  DELETE_CUSTODIANS_FAILURE,
  DELETE_CUSTODIANS_SUCCESS,
  SEARCH,
  SEARCH_SUCCESS,
  GET_CUSTODIAN_TYPE,
  GET_CUSTODIAN_TYPE_SUCCESS,
  GET_CUSTODIAN_TYPE_FAILURE,
  GET_CONTACT,
  GET_CONTACT_SUCCESS,
  GET_CONTACT_FAILURE,
  ADD_CUSTODY,
  ADD_CUSTODY_SUCCESS,
  ADD_CUSTODY_FAILURE,
  GET_CUSTODY,
  GET_CUSTODY_SUCCESS,
  GET_CUSTODY_FAILURE,
  EDIT_CUSTODY,
  EDIT_CUSTODY_SUCCESS,
  EDIT_CUSTODY_FAILURE,
} from "../actions/custodian.actions";

const initialState = {
  loading: false,
  loaded: false,
  custodianData: null,
  error: null,
  custodianTypeList: null,
  contactInfo: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_CUSTODIANS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData: action.data,
      };
    case GET_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case ADD_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case ADD_CUSTODIANS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData: action.data,
      };
    case ADD_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_CUSTODIANS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData: action.data,
        error: null,
      };

    case EDIT_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case DELETE_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case DELETE_CUSTODIANS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData: action.data,
      };
    case DELETE_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case SEARCH:
      return {
        ...state,
        error: null,
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        searchedData: action.data,
      };
    case GET_CUSTODIAN_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_CUSTODIAN_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianTypeList: action.data,
      };
    case GET_CUSTODIAN_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case GET_CONTACT:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        contactInfo: action.data,
      };
    case GET_CONTACT_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case GET_CUSTODY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_CUSTODY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodyData: action.data,
      };
    case GET_CUSTODY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case ADD_CUSTODY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case ADD_CUSTODY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodyData: action.data,
      };
    case ADD_CUSTODY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case EDIT_CUSTODY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case EDIT_CUSTODY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodyData: action.data,
      };
    case EDIT_CUSTODY_FAILURE:
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
