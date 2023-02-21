import {
  SHOW_ALERT,
  HIDE_ALERT,
  SOCKET,
} from '../actions/alert.actions';

const initialState = {
  data: {},
  socket: null,
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

    case SOCKET:
      return {
        ...state,
        socket: action.socket,
      };

    default:
      return state;
  }
};
