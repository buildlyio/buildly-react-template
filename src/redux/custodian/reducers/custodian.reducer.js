import _ from 'lodash';
import {
  GET_CUSTODY,
  GET_CUSTODY_SUCCESS,
  GET_CUSTODY_FAILURE,
} from '../actions/custodian.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  custodyData: [],
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTODY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_CUSTODY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_CUSTODY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodyData: action.data,
      };

    default:
      return state;
  }
};
