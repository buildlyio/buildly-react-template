import {
  ADD_DATA,
  ADD_DATA_SUCCESS,
  ADD_DATA_FAIL,
} from '../actions/googleSheet.actions';

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_DATA:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.form,
      };

    case ADD_DATA_FAIL:
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
