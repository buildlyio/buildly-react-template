import _ from 'lodash';
import {
  GET_CONSORTIUMS,
  GET_CONSORTIUMS_SUCCESS,
  GET_CONSORTIUMS_FAILURE,
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
  data: null,
  error: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONSORTIUMS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_CONSORTIUMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.data,
      };

    case GET_CONSORTIUMS_FAILURE:
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
      const data = state.data || [];
      return {
        ...state,
        loading: false,
        loaded: true,
        data: [...data, action.data],
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
      const edited = _.filter(state.data, (data) => (
        data.id !== action.data.id
      ));
      return {
        ...state,
        loading: false,
        loaded: true,
        data: [...edited, action.data],
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
      const deleted = _.filter(state.data, (data) => (
        data.consortium_uuid !== action.uuid
      ));
      return {
        ...state,
        loading: false,
        loaded: true,
        data: deleted,
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
