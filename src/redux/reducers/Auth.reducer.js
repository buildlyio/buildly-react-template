import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    UPDATE_USER,
    UPDATE_USER_FAIL,
    UPDATE_USER_SUCCESS,
    GET_USER,
    GET_USER_FAIL,
    GET_USER_SUCCESS
} from '../actions/Auth.actions';

const initialState = {
  loading: false,
  loaded: false,

  user: null,
  error: null
}

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.user
      };

    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };

    case LOGOUT_SUCCESS:
      return {
        ...state,
      };

    case REGISTER:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.user
      };

    case REGISTER_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
      case UPDATE_USER:
          return {
              ...state,
              loading: true,
              loaded: false,
              error: null
          };

      case UPDATE_USER_SUCCESS:
          return {
              ...state,
              loading: false,
              loaded: true,
              user: action.user
          };

      case UPDATE_USER_FAIL:
          return {
              ...state,
              loading: false,
              loaded: true,
              error: action.error
          };

      case GET_USER:
          return {
              ...state,
              loading: true,
              loaded: false,
              error: null
          };

      case GET_USER_SUCCESS:
          return {
              ...state,
              loading: false,
              loaded: true,
              user: action.user
          };

      case GET_USER_FAIL:
          return {
              ...state,
              loading: false,
              loaded: true,
              error: action.error
          };
      
    default:
      return state
  }
}
