import _ from 'lodash';
import {
  GET_ALL_CONSORTIUMS,
  GET_ALL_CONSORTIUMS_SUCCESS,
  GET_ALL_CONSORTIUMS_FAILURE,
  GET_ORG_CONSORTIUMS,
  GET_ORG_CONSORTIUMS_SUCCESS,
  GET_ORG_CONSORTIUMS_FAILURE,
  CREATE_CONSORTIUM,
  CREATE_CONSORTIUM_SUCCESS,
  CREATE_CONSORTIUM_FAILURE,
  EDIT_CONSORTIUM,
  EDIT_CONSORTIUM_SUCCESS,
  EDIT_CONSORTIUM_FAILURE,
  DELETE_CONSORTIUM,
  DELETE_CONSORTIUM_SUCCESS,
  DELETE_CONSORTIUM_FAILURE,
} from '../actions/consortium.actions';

const initialState = {
  loading: false,
  loaded: false,
  allConsortiums: null,
  orgConsortiums: null,
  error: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CONSORTIUMS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_ALL_CONSORTIUMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        allConsortiums: action.data,
      };

    case GET_ALL_CONSORTIUMS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_ORG_CONSORTIUMS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_ORG_CONSORTIUMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        orgConsortiums: action.data,
      };

    case GET_ORG_CONSORTIUMS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case CREATE_CONSORTIUM:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case CREATE_CONSORTIUM_SUCCESS: {
      const data = state.allConsortiums || [];
      return {
        ...state,
        loading: false,
        loaded: true,
        allConsortiums: [...data, action.data],
      };
    }

    case CREATE_CONSORTIUM_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_CONSORTIUM:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_CONSORTIUM_SUCCESS: {
      const edited = _.filter(state.allConsortiums, (data) => (
        data.id !== action.data.id
      ));
      return {
        ...state,
        loading: false,
        loaded: true,
        allConsortiums: [...edited, action.data],
      };
    }

    case EDIT_CONSORTIUM_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_CONSORTIUM:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_CONSORTIUM_SUCCESS: {
      const deleted = _.filter(state.allConsortiums, (data) => (
        data.consortium_uuid !== action.uuid
      ));
      return {
        ...state,
        loading: false,
        loaded: true,
        allConsortiums: deleted,
      };
    }

    case DELETE_CONSORTIUM_FAILURE:
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
