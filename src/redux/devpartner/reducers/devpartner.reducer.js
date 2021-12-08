import {
  GET_DEVTEAMS,
  GET_DEVTEAMS_SUCCESS,
  GET_DEVTEAMS_FAILURE,
  ADD_DEVTEAM,
  ADD_DEVTEAM_SUCCESS,
  ADD_DEVTEAM_FAILURE,
  UPDATE_DEVTEAM,
  UPDATE_DEVTEAM_SUCCESS,
  UPDATE_DEVTEAM_FAILURE,
  DELETE_DEVTEAM,
  DELETE_DEVTEAM_SUCCESS,
  DELETE_DEVTEAM_FAILURE,
  GET_TIMESHEETS,
  GET_TIMESHEETS_SUCCESS,
  GET_TIMESHEETS_FAILURE,
  ADD_TIMESHEET,
  ADD_TIMESHEET_SUCCESS,
  ADD_TIMESHEET_FAILURE,
  UPDATE_TIMESHEET,
  UPDATE_TIMESHEET_SUCCESS,
  UPDATE_TIMESHEET_FAILURE,
  DELETE_TIMESHEET,
  DELETE_TIMESHEET_SUCCESS,
  DELETE_TIMESHEET_FAILURE,
  GET_TIMESHEET_HOURS,
  GET_TIMESHEET_HOURS_SUCCESS,
  GET_TIMESHEET_HOURS_FAILURE,
  ADD_TIMESHEET_HOUR,
  ADD_TIMESHEET_HOUR_SUCCESS,
  ADD_TIMESHEET_HOUR_FAILURE,
  UPDATE_TIMESHEET_HOUR,
  UPDATE_TIMESHEET_HOUR_SUCCESS,
  UPDATE_TIMESHEET_HOUR_FAILURE,
  DELETE_TIMESHEET_HOUR,
  DELETE_TIMESHEET_HOUR_SUCCESS,
  DELETE_TIMESHEET_HOUR_FAILURE,
} from '../actions/devpartner.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  devTeam: null,
  issue: null,
  timesheet: null,
  timesheet_hour: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DEVTEAMS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_DEVTEAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        devTeam: action.data,
      };

    case GET_DEVTEAMS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_DEVTEAM:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_DEVTEAM_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        devTeam: action.data,
      };

    case ADD_DEVTEAM_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_DEVTEAM:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_DEVTEAM_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        devTeam: action.data,
      };

    case UPDATE_DEVTEAM_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_DEVTEAM:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_DEVTEAM_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        devTeam: action.data,
      };

    case DELETE_DEVTEAM_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_TIMESHEETS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_TIMESHEETS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timesheet: action.data,
      };

    case GET_TIMESHEETS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_TIMESHEET:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_TIMESHEET_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timesheet: action.data,
      };

    case ADD_TIMESHEET_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_TIMESHEET:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_TIMESHEET_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timesheet: action.data,
      };

    case UPDATE_TIMESHEET_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_TIMESHEET:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_TIMESHEET_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timesheet: action.data,
      };

    case DELETE_TIMESHEET_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_TIMESHEET_HOURS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_TIMESHEET_HOURS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timesheet_hour: action.data,
      };

    case GET_TIMESHEET_HOURS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_TIMESHEET_HOUR:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_TIMESHEET_HOUR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timesheet_hour: action.data,
      };

    case ADD_TIMESHEET_HOUR_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_TIMESHEET_HOUR:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_TIMESHEET_HOUR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timesheet_hour: action.data,
      };

    case UPDATE_TIMESHEET_HOUR_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_TIMESHEET_HOUR:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_TIMESHEET_HOUR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timesheet_hour: action.data,
      };

    case DELETE_TIMESHEET_HOUR_FAILURE:
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
