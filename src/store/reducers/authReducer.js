import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS
} from '../actions/actionTypes';

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
      }

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.user
      }

    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      }

    case LOGOUT_SUCCESS:
      return {
        ...state,
      }

    default:
      return state
  }
}
