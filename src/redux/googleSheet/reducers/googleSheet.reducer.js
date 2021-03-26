import {
  ADD_DATA,
  ADD_DATA_SUCCESS,
  ADD_DATA_FAIL,
  CHECK_FILLED,
  CHECK_FILLED_SUCCESS,
  CHECK_FILLED_FAIL,
} from '@redux/googleSheet/actions/googleSheet.actions';

const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
  filled: false,
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
        filled: true,
        data: action.form,
      };

    case ADD_DATA_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case CHECK_FILLED:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case CHECK_FILLED_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        filled: action.filled,
      };

    case CHECK_FILLED_FAIL:
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
