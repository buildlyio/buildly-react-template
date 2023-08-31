import _ from 'lodash';
import { getUser } from '../../../context/User.context';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_SUCCESS,
  GET_USER,
  GET_USER_FAIL,
  GET_USER_SUCCESS,
  INVITE,
  INVITE_FAIL,
  INVITE_SUCCESS,
  GET_ORGANIZATION,
  GET_ORGANIZATION_SUCCESS,
  GET_ORGANIZATION_FAILURE,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_CONFIRM,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAILURE,
  RESET_PASSWORD_CHECK,
  RESET_PASSWORD_CHECK_SUCCESS,
  RESET_PASSWORD_CHECK_FAILURE,
  UPDATE_ORGANIZATION,
  UPDATE_ORGANIZATION_SUCCESS,
  UPDATE_ORGANIZATION_FAILURE,
  LOAD_ALL_ORGS,
  LOAD_ALL_ORGS_SUCCESS,
  LOAD_ALL_ORGS_FAILURE,
  LOAD_ORG_NAMES,
  LOAD_ORG_NAMES_SUCCESS,
  LOAD_ORG_NAMES_FAILURE,
  GET_ORG_TYPES,
  GET_ORG_TYPES_SUCCESS,
  GET_ORG_TYPES_FAILURE,
  ADD_ORG_TYPE,
  ADD_ORG_TYPE_SUCCESS,
  ADD_ORG_TYPE_FAILURE,
  EDIT_ORG_TYPE,
  EDIT_ORG_TYPE_SUCCESS,
  EDIT_ORG_TYPE_FAILURE,
  DELETE_ORG_TYPE,
  DELETE_ORG_TYPE_SUCCESS,
  DELETE_ORG_TYPE_FAILURE,
} from '../actions/authuser.actions';

const initialState = {
  loading: false,
  loaded: false,
  data: getUser(),
  error: null,
  organizationData: null,
  allOrgs: null,
  orgNames: null,
  orgTypes: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.user,
      };

    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case REGISTER:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.user,
        error: null,
      };

    case REGISTER_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_USER:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.user,
      };

    case UPDATE_USER_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_USER:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.user,
      };

    case GET_USER_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case INVITE:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: null,
        error: null,
      };

    case INVITE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        data: action.user,
      };

    case INVITE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: null,
        error: action.error,
      };

    case GET_ORGANIZATION:
      return {
        ...state,
        loading: true,
        loaded: false,
        organizationData: null,
        error: null,
      };

    case GET_ORGANIZATION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        organizationData: (action.data && action.data.data) || null,
        error: null,
      };

    case GET_ORGANIZATION_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        organizationData: null,
        error: action.error,
      };

    case RESET_PASSWORD:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      };

    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case RESET_PASSWORD_CONFIRM:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case RESET_PASSWORD_CONFIRM_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      };

    case RESET_PASSWORD_CONFIRM_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case RESET_PASSWORD_CHECK:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case RESET_PASSWORD_CHECK_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        resetPasswordCheckData: action.data,
      };

    case RESET_PASSWORD_CHECK_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_ORGANIZATION:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_ORGANIZATION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.user,
        organizationData: (action.org && action.org.data) || null,
      };

    case UPDATE_ORGANIZATION_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case LOAD_ALL_ORGS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case LOAD_ALL_ORGS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        allOrgs: action.allOrgs,
      };

    case LOAD_ALL_ORGS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case LOAD_ORG_NAMES:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case LOAD_ORG_NAMES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        orgNames: action.orgNames,
      };

    case LOAD_ORG_NAMES_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_ORG_TYPES:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_ORG_TYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        orgTypes: action.orgTypes,
      };

    case GET_ORG_TYPES_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_ORG_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_ORG_TYPE_SUCCESS: {
      const types = state.orgTypes
        ? [...state.orgTypes, action.orgType]
        : [action.orgType];
      return {
        ...state,
        loading: false,
        loaded: true,
        orgTypes: types,
      };
    }

    case ADD_ORG_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_ORG_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_ORG_TYPE_SUCCESS: {
      let types = _.filter(state.orgTypes, (type) => (
        type.id !== action.orgType.id
      ));
      types = [...types, action.orgType];
      return {
        ...state,
        loading: false,
        loaded: true,
        orgTypes: types,
      };
    }

    case EDIT_ORG_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_ORG_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_ORG_TYPE_SUCCESS: {
      const types = _.filter(state.orgTypes, (type) => (
        type.id !== action.id
      ));
      return {
        ...state,
        loading: false,
        loaded: true,
        orgTypes: types,
      };
    }

    case DELETE_ORG_TYPE_FAILURE:
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
