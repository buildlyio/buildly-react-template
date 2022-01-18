import _ from 'lodash';
import {
  ALL_DEV_TEAMS,
  ALL_DEV_TEAMS_SUCCESS,
  ALL_DEV_TEAMS_FAILURE,
  ALL_TIMESHEET_HOURS,
  ALL_TIMESHEET_HOURS_SUCCESS,
  ALL_TIMESHEET_HOURS_FAILURE,
  ALL_TIMESHEETS,
  ALL_TIMESHEETS_SUCCESS,
  ALL_TIMESHEETS_FAILURE,
  GET_DEV_TEAM,
  GET_DEV_TEAM_SUCCESS,
  GET_DEV_TEAM_FAILURE,
  GET_TIMESHEET_HOUR,
  GET_TIMESHEET_HOUR_SUCCESS,
  GET_TIMESHEET_HOUR_FAILURE,
  GET_TIMESHEET,
  GET_TIMESHEET_SUCCESS,
  GET_TIMESHEET_FAILURE,
  CREATE_DEV_TEAM,
  CREATE_DEV_TEAM_SUCCESS,
  CREATE_DEV_TEAM_FAILURE,
  CREATE_TIMESHEET_HOUR,
  CREATE_TIMESHEET_HOUR_SUCCESS,
  CREATE_TIMESHEET_HOUR_FAILURE,
  CREATE_TIMESHEET,
  CREATE_TIMESHEET_SUCCESS,
  CREATE_TIMESHEET_FAILURE,
  UPDATE_DEV_TEAM,
  UPDATE_DEV_TEAM_SUCCESS,
  UPDATE_DEV_TEAM_FAILURE,
  UPDATE_TIMESHEET_HOUR,
  UPDATE_TIMESHEET_HOUR_SUCCESS,
  UPDATE_TIMESHEET_HOUR_FAILURE,
  UPDATE_TIMESHEET,
  UPDATE_TIMESHEET_SUCCESS,
  UPDATE_TIMESHEET_FAILURE,
  DELETE_DEV_TEAM,
  DELETE_DEV_TEAM_SUCCESS,
  DELETE_DEV_TEAM_FAILURE,
  DELETE_TIMESHEET_HOUR,
  DELETE_TIMESHEET_HOUR_SUCCESS,
  DELETE_TIMESHEET_HOUR_FAILURE,
  DELETE_TIMESHEET,
  DELETE_TIMESHEET_SUCCESS,
  DELETE_TIMESHEET_FAILURE,
} from '../actions/devpartner.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  devTeams: [],
  timesheetHours: [],
  timesheets: [],
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case ALL_DEV_TEAMS:
    case ALL_TIMESHEET_HOURS:
    case ALL_TIMESHEETS:
    case GET_DEV_TEAM:
    case GET_TIMESHEET_HOUR:
    case GET_TIMESHEET:
    case CREATE_DEV_TEAM:
    case CREATE_TIMESHEET_HOUR:
    case CREATE_TIMESHEET:
    case UPDATE_DEV_TEAM:
    case UPDATE_TIMESHEET_HOUR:
    case UPDATE_TIMESHEET:
    case DELETE_DEV_TEAM:
    case DELETE_TIMESHEET_HOUR:
    case DELETE_TIMESHEET:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ALL_DEV_TEAMS_FAILURE:
    case ALL_TIMESHEET_HOURS_FAILURE:
    case ALL_TIMESHEETS_FAILURE:
    case GET_DEV_TEAM_FAILURE:
    case GET_TIMESHEET_HOUR_FAILURE:
    case GET_TIMESHEET_FAILURE:
    case CREATE_DEV_TEAM_FAILURE:
    case CREATE_TIMESHEET_HOUR_FAILURE:
    case CREATE_TIMESHEET_FAILURE:
    case UPDATE_DEV_TEAM_FAILURE:
    case UPDATE_TIMESHEET_HOUR_FAILURE:
    case UPDATE_TIMESHEET_FAILURE:
    case DELETE_DEV_TEAM_FAILURE:
    case DELETE_TIMESHEET_HOUR_FAILURE:
    case DELETE_TIMESHEET_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ALL_DEV_TEAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        devTeams: action.data,
      };

    case GET_DEV_TEAM_SUCCESS:
    case CREATE_DEV_TEAM_SUCCESS:
    case UPDATE_DEV_TEAM_SUCCESS: {
      const found = _.find(
        state.devTeams,
        { devteam_uuid: action.data.devteam_uuid },
      );
      const teams = found
        ? _.map(state.devTeams, (team) => (
          team.devteam_uuid === action.data.devteam_uuid
            ? action.data
            : team
        ))
        : [...state.devTeams, action.data];

      return {
        ...state,
        loading: false,
        loaded: true,
        devTeams: teams,
      };
    }

    case DELETE_DEV_TEAM_SUCCESS: {
      const { devTeams } = state;
      _.remove(devTeams, { devteam_uuid: action.devteam_uuid });

      return {
        ...state,
        loading: false,
        loaded: true,
        devTeams,
      };
    }

    case ALL_TIMESHEET_HOURS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timesheetHours: action.data,
      };

    case GET_TIMESHEET_HOUR_SUCCESS:
    case CREATE_TIMESHEET_HOUR_SUCCESS:
    case UPDATE_TIMESHEET_HOUR_SUCCESS: {
      const found = _.find(
        state.timesheetHours,
        { timesheethour_uuid: action.data.timesheethour_uuid },
      );
      const hours = found
        ? _.map(state.timesheetHours, (hour) => (
          hour.timesheethour_uuid === action.data.timesheethour_uuid
            ? action.data
            : hour
        ))
        : [...state.timesheetHours, action.data];

      return {
        ...state,
        loading: false,
        loaded: true,
        timesheetHours: hours,
      };
    }

    case DELETE_TIMESHEET_HOUR_SUCCESS: {
      const { timesheetHours } = state;
      _.remove(
        timesheetHours,
        { timesheethour_uuid: action.timesheethour_uuid },
      );

      return {
        ...state,
        loading: false,
        loaded: true,
        timesheetHours,
      };
    }

    case ALL_TIMESHEETS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timesheets: action.data,
      };

    case GET_TIMESHEET_SUCCESS:
    case CREATE_TIMESHEET_SUCCESS:
    case UPDATE_TIMESHEET_SUCCESS: {
      const found = _.find(
        state.timesheets,
        { timesheet_uuid: action.data.timesheet_uuid },
      );
      const sheets = found
        ? _.map(state.timesheets, (sheet) => (
          sheet.timesheet_uuid === action.data.timesheet_uuid
            ? action.data
            : sheet
        ))
        : [...state.timesheets, action.data];

      return {
        ...state,
        loading: false,
        loaded: true,
        timesheets: sheets,
      };
    }

    case DELETE_TIMESHEET_SUCCESS: {
      const { timesheets } = state;
      _.remove(timesheets, { timesheet_uuid: action.timesheet_uuid });

      return {
        ...state,
        loading: false,
        loaded: true,
        timesheets,
      };
    }

    default:
      return state;
  }
};
