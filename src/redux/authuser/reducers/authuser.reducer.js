import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  SEND_PASSWORD_RESET_LINK,
  SEND_PASSWORD_RESET_LINK_SUCCESS,
  SEND_PASSWORD_RESET_LINK_FAIL,
  VALIDATE_RESET_PASSWORD_TOKEN,
  VALIDATE_RESET_PASSWORD_TOKEN_SUCCESS,
  VALIDATE_RESET_PASSWORD_TOKEN_FAIL,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
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
  SOCIAL_LOGIN,
  SOCIAL_LOGIN_SUCCESS,
  SOCIAL_LOGIN_FAIL,
} from '@redux/authuser/actions/authuser.actions';

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
  organizationData: null,
  socialLogin: null,
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

    case SEND_PASSWORD_RESET_LINK:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case SEND_PASSWORD_RESET_LINK_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      };

    case SEND_PASSWORD_RESET_LINK_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case VALIDATE_RESET_PASSWORD_TOKEN:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case VALIDATE_RESET_PASSWORD_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      };

    case VALIDATE_RESET_PASSWORD_TOKEN_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
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

    case RESET_PASSWORD_FAIL:
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

    case SOCIAL_LOGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
        socialLogin: action.provider,
      };

    case SOCIAL_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.user,
      };

    case SOCIAL_LOGIN_FAIL:
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
