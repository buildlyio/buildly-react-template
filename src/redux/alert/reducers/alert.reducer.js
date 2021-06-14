import {
  SHOW_ALERT,
  HIDE_ALERT,
} from '../actions/alert.actions';

const initialState = {
  data: {},
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ALERT:
      return {
        ...state,
        data: action.data,
      };

    case HIDE_ALERT:
      return {
        ...state,
        data: null,
      };

    default:
      return state;
  }
};
