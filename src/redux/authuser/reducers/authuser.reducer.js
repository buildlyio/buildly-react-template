import _ from 'lodash';
import { getUser } from '../../../context/User.context';
import {
  UPDATE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_SUCCESS,
  INVITE,
  INVITE_FAIL,
  INVITE_SUCCESS,
} from '../actions/authuser.actions';

const initialState = {
  loading: false,
  loaded: false,
  data: getUser(),
  error: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
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

    default:
      return state;
  }
};
