// Dev Partner Action types
export const ALL_DEV_TEAMS = 'DEVPARTNER/ALL_DEV_TEAMS';
export const ALL_DEV_TEAMS_SUCCESS = 'DEVPARTNER/ALL_DEV_TEAMS_SUCCESS';
export const ALL_DEV_TEAMS_FAILURE = 'DEVPARTNER/ALL_DEV_TEAMS_FAILURE';

export const GET_DEV_TEAM = 'DEVPARTNER/GET_DEV_TEAM';
export const GET_DEV_TEAM_SUCCESS = 'DEVPARTNER/GET_DEV_TEAM_SUCCESS';
export const GET_DEV_TEAM_FAILURE = 'DEVPARTNER/GET_DEV_TEAM_FAILURE';

export const CREATE_DEV_TEAM = 'DEVPARTNER/CREATE_DEV_TEAM';
export const CREATE_DEV_TEAM_SUCCESS = 'DEVPARTNER/CREATE_DEV_TEAM_SUCCESS';
export const CREATE_DEV_TEAM_FAILURE = 'DEVPARTNER/CREATE_DEV_TEAM_FAILURE';

export const UPDATE_DEV_TEAM = 'DEVPARTNER/UPDATE_DEV_TEAM';
export const UPDATE_DEV_TEAM_SUCCESS = 'DEVPARTNER/UPDATE_DEV_TEAM_SUCCESS';
export const UPDATE_DEV_TEAM_FAILURE = 'DEVPARTNER/UPDATE_DEV_TEAM_FAILURE';

export const DELETE_DEV_TEAM = 'DEVPARTNER/DELETE_DEV_TEAM';
export const DELETE_DEV_TEAM_SUCCESS = 'DEVPARTNER/DELETE_DEV_TEAM_SUCCESS';
export const DELETE_DEV_TEAM_FAILURE = 'DEVPARTNER/DELETE_DEV_TEAM_FAILURE';

export const ALL_TIMESHEET_HOURS = 'DEVPARTNER/ALL_TIMESHEET_HOURS';
export const ALL_TIMESHEET_HOURS_SUCCESS = 'DEVPARTNER/ALL_TIMESHEET_HOURS_SUCCESS';
export const ALL_TIMESHEET_HOURS_FAILURE = 'DEVPARTNER/ALL_TIMESHEET_HOURS_FAILURE';

export const GET_TIMESHEET_HOUR = 'DEVPARTNER/GET_TIMESHEET_HOUR';
export const GET_TIMESHEET_HOUR_SUCCESS = 'DEVPARTNER/GET_TIMESHEET_HOUR_SUCCESS';
export const GET_TIMESHEET_HOUR_FAILURE = 'DEVPARTNER/GET_TIMESHEET_HOUR_FAILURE';

export const CREATE_TIMESHEET_HOUR = 'DEVPARTNER/CREATE_TIMESHEET_HOUR';
export const CREATE_TIMESHEET_HOUR_SUCCESS = 'DEVPARTNER/CREATE_TIMESHEET_HOUR_SUCCESS';
export const CREATE_TIMESHEET_HOUR_FAILURE = 'DEVPARTNER/CREATE_TIMESHEET_HOUR_FAILURE';

export const UPDATE_TIMESHEET_HOUR = 'DEVPARTNER/UPDATE_TIMESHEET_HOUR';
export const UPDATE_TIMESHEET_HOUR_SUCCESS = 'DEVPARTNER/UPDATE_TIMESHEET_HOUR_SUCCESS';
export const UPDATE_TIMESHEET_HOUR_FAILURE = 'DEVPARTNER/UPDATE_TIMESHEET_HOUR_FAILURE';

export const DELETE_TIMESHEET_HOUR = 'DEVPARTNER/DELETE_TIMESHEET_HOUR';
export const DELETE_TIMESHEET_HOUR_SUCCESS = 'DEVPARTNER/DELETE_TIMESHEET_HOUR_SUCCESS';
export const DELETE_TIMESHEET_HOUR_FAILURE = 'DEVPARTNER/DELETE_TIMESHEET_HOUR_FAILURE';

export const ALL_TIMESHEETS = 'DEVPARTNER/ALL_TIMESHEETS';
export const ALL_TIMESHEETS_SUCCESS = 'DEVPARTNER/ALL_TIMESHEETS_SUCCESS';
export const ALL_TIMESHEETS_FAILURE = 'DEVPARTNER/ALL_TIMESHEETS_FAILURE';

export const GET_TIMESHEET = 'DEVPARTNER/GET_TIMESHEET';
export const GET_TIMESHEET_SUCCESS = 'DEVPARTNER/GET_TIMESHEET_SUCCESS';
export const GET_TIMESHEET_FAILURE = 'DEVPARTNER/GET_TIMESHEET_FAILURE';

export const CREATE_TIMESHEET = 'DEVPARTNER/CREATE_TIMESHEET';
export const CREATE_TIMESHEET_SUCCESS = 'DEVPARTNER/CREATE_TIMESHEET_SUCCESS';
export const CREATE_TIMESHEET_FAILURE = 'DEVPARTNER/CREATE_TIMESHEET_FAILURE';

export const UPDATE_TIMESHEET = 'DEVPARTNER/UPDATE_TIMESHEET';
export const UPDATE_TIMESHEET_SUCCESS = 'DEVPARTNER/UPDATE_TIMESHEET_SUCCESS';
export const UPDATE_TIMESHEET_FAILURE = 'DEVPARTNER/UPDATE_TIMESHEET_FAILURE';

export const DELETE_TIMESHEET = 'DEVPARTNER/DELETE_TIMESHEET';
export const DELETE_TIMESHEET_SUCCESS = 'DEVPARTNER/DELETE_TIMESHEET_SUCCESS';
export const DELETE_TIMESHEET_FAILURE = 'DEVPARTNER/DELETE_TIMESHEET_FAILURE';

/**
 * Get all Dev Teams
 */
export const getAllDevTeams = () => ({ type: ALL_DEV_TEAMS });

/**
 * Get a Dev Team
 * @param {uuid} devteam_uuid
 */
export const getDevTeam = (devteam_uuid) => ({
  type: GET_DEV_TEAM,
  devteam_uuid,
});

/**
 * Create a Dev Team
 * @param {Object} data
 */
export const createDevTeam = (data) => ({
  type: CREATE_DEV_TEAM,
  data,
});

/**
 * Update a Dev Team
 * @param {Object} data
 */
export const updateDevTeam = (data) => ({
  type: UPDATE_DEV_TEAM,
  data,
});

/**
 * Delete a Dev Team
 * @param {uuid} devteam_uuid
 */
export const deleteDevTeam = (devteam_uuid) => ({
  type: DELETE_DEV_TEAM,
  devteam_uuid,
});

/**
 * Get all Timesheet Hours
 */
export const getAllTimesheetHours = () => ({ type: ALL_TIMESHEET_HOURS });

/**
 * Get a Timesheet Hour
 * @param {uuid} timesheethour_uuid
 */
export const getTimesheetHour = (timesheethour_uuid) => ({
  type: GET_TIMESHEET_HOUR,
  timesheethour_uuid,
});

/**
 * Create a Timesheet Hour
 * @param {Object} data
 */
export const createTimesheetHour = (data) => ({
  type: CREATE_TIMESHEET_HOUR,
  data,
});

/**
 * Update a Timesheet Hour
 * @param {Object} data
 */
export const updateTimesheetHour = (data) => ({
  type: UPDATE_TIMESHEET_HOUR,
  data,
});

/**
 * Delete a Timesheet Hour
 * @param {uuid} timesheethour_uuid
 */
export const deleteTimesheetHour = (timesheethour_uuid) => ({
  type: DELETE_TIMESHEET_HOUR,
  timesheethour_uuid,
});

/**
 * Get all Timesheets
 */
export const getAllTimesheets = () => ({ type: ALL_TIMESHEETS });

/**
 * Get a Timesheet
 * @param {uuid} timesheet_uuid
 */
export const getTimesheet = (timesheet_uuid) => ({
  type: GET_TIMESHEET,
  timesheet_uuid,
});

/**
 * Create a Timesheet
 * @param {Object} data
 */
export const createTimesheet = (data) => ({
  type: CREATE_TIMESHEET,
  data,
});

/**
 * Update a Timesheet
 * @param {Object} data
 */
export const updateTimesheet = (data) => ({
  type: UPDATE_TIMESHEET,
  data,
});

/**
 * Delete a Timesheet
 * @param {uuid} timesheet_uuid
 */
export const deleteTimesheet = (timesheet_uuid) => ({
  type: DELETE_TIMESHEET,
  timesheet_uuid,
});
