// Dev/Partner Action types
export const GET_DEVTEAMS = 'DEV_PARTNER/GET_DEVTEAMS';
export const GET_DEVTEAMS_SUCCESS = 'DEV_PARTNER/GET_DEVTEAMS_SUCCESS';
export const GET_DEVTEAMS_FAILURE = 'DEV_PARTNER/GET_DEVTEAMS_FAILURE';

export const ADD_DEVTEAM = 'DEV_PARTNER/ADD_DEVTEAM';
export const ADD_DEVTEAM_SUCCESS = 'DEV_PARTNER/ADD_DEVTEAM_SUCCESS';
export const ADD_DEVTEAM_FAILURE = 'DEV_PARTNER/ADD_DEVTEAM_FAILURE';

export const UPDATE_DEVTEAM = 'DEV_PARTNER/UPDATE_DEVTEAM';
export const UPDATE_DEVTEAM_SUCCESS = 'DEV_PARTNER/UPDATE_DEVTEAM_SUCCESS';
export const UPDATE_DEVTEAM_FAILURE = 'DEV_PARTNER/UPDATE_DEVTEAM_FAILURE';

export const DELETE_DEVTEAM = 'DEV_PARTNER/DELETE_DEVTEAM';
export const DELETE_DEVTEAM_SUCCESS = 'DEV_PARTNER/DELETE_DEVTEAM_SUCCESS';
export const DELETE_DEVTEAM_FAILURE = 'DEV_PARTNER/DELETE_DEVTEAM_FAILURE';

export const GET_TIMESHEETS = 'DEV_PARTNER/GET_TIMESHEETS';
export const GET_TIMESHEETS_SUCCESS = 'DEV_PARTNER/GET_TIMESHEETS_SUCCESS';
export const GET_TIMESHEETS_FAILURE = 'DEV_PARTNER/GET_TIMESHEETS_FAILURE';

export const ADD_TIMESHEET = 'DEV_PARTNER/ADD_TIMESHEET';
export const ADD_TIMESHEET_SUCCESS = 'DEV_PARTNER/ADD_TIMESHEET_SUCCESS';
export const ADD_TIMESHEET_FAILURE = 'DEV_PARTNER/ADD_TIMESHEET_FAILURE';

export const UPDATE_TIMESHEET = 'DEV_PARTNER/UPDATE_TIMESHEET';
export const UPDATE_TIMESHEET_SUCCESS = 'DEV_PARTNER/UPDATE_TIMESHEET_SUCCESS';
export const UPDATE_TIMESHEET_FAILURE = 'DEV_PARTNER/UPDATE_TIMESHEET_FAILURE';

export const DELETE_TIMESHEET = 'DEV_PARTNER/DELETE_TIMESHEET';
export const DELETE_TIMESHEET_SUCCESS = 'DEV_PARTNER/DELETE_TIMESHEET_SUCCESS';
export const DELETE_TIMESHEET_FAILURE = 'DEV_PARTNER/DELETE_TIMESHEET_FAILURE';

export const GET_TIMESHEET_HOURS = 'DEV_PARTNER/GET_TIMESHEET_HOURS';
export const GET_TIMESHEET_HOURS_SUCCESS = 'DEV_PARTNER/GET_TIMESHEET_HOURS_SUCCESS';
export const GET_TIMESHEET_HOURS_FAILURE = 'DEV_PARTNER/GET_TIMESHEET_HOURS_FAILURE';

export const ADD_TIMESHEET_HOUR = 'DEV_PARTNER/ADD_TIMESHEET_HOUR';
export const ADD_TIMESHEET_HOUR_SUCCESS = 'DEV_PARTNER/ADD_TIMESHEET_HOUR_SUCCESS';
export const ADD_TIMESHEET_HOUR_FAILURE = 'DEV_PARTNER/ADD_TIMESHEET_HOUR_FAILURE';

export const UPDATE_TIMESHEET_HOUR = 'DEV_PARTNER/UPDATE_TIMESHEET_HOUR';
export const UPDATE_TIMESHEET_HOUR_SUCCESS = 'DEV_PARTNER/UPDATE_TIMESHEET_HOUR_SUCCESS';
export const UPDATE_TIMESHEET_HOUR_FAILURE = 'DEV_PARTNER/UPDATE_TIMESHEET_HOUR_FAILURE';

export const DELETE_TIMESHEET_HOUR = 'DEV_PARTNER/DELETE_TIMESHEET_HOUR';
export const DELETE_TIMESHEET_HOUR_SUCCESS = 'DEV_PARTNER/DELETE_TIMESHEET_HOUR_SUCCESS';
export const DELETE_TIMESHEET_HOUR_FAILURE = 'DEV_PARTNER/DELETE_TIMESHEET_HOUR_FAILURE';

/**
 * Get Dev Teams
 * @param {String} organization_uuid
 * @param {String} dev_team_uuid
 */
export const getDevTeams = (organization_uuid, dev_team_uuid) => (
  { type: GET_DEVTEAMS, organization_uuid, dev_team_uuid });

/**
 * Add Dev Team
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const addDevTeam = (payload, history, redirectTo) => ({
  type: ADD_DEVTEAM,
  payload,
  history,
  redirectTo,
});

/**
   * Update Dev Team
   * @param {Object} payload
   * @param {Object} history
   * @param {String} redirectTo
   */
export const updateDevTeam = (payload, history, redirectTo) => ({
  type: UPDATE_DEVTEAM,
  payload,
  history,
  redirectTo,
});
  /**
   * Delete Dev Team
   * @param {Number} dev_team_uuid
   */
export const deleteDevTeam = (
  dev_team_uuid,
) => ({
  type: DELETE_DEVTEAM,
  dev_team_uuid,
});

/**
 * Get Timesheets
 * @param {String} project_uuid
 */
export const getTimesheets = (project_uuid) => ({ type: GET_TIMESHEETS, project_uuid });

/**
   * Add Timesheet
   * @param {Object} payload
   * @param {Object} history
   * @param {String} redirectTo
   */
export const addTimesheet = (payload, history, redirectTo) => ({
  type: ADD_TIMESHEET,
  payload,
  history,
  redirectTo,
});

/**
     * Update Timesheet
     * @param {Object} payload
     * @param {Object} history
     * @param {String} redirectTo
     */
export const updateTimesheet = (payload, history, redirectTo) => ({
  type: UPDATE_TIMESHEET,
  payload,
  history,
  redirectTo,
});
/**
     * Delete Timesheet
     * @param {Number} timesheet_uuid

     */
export const deleteTimesheet = (
  timesheet_uuid,
) => ({
  type: DELETE_TIMESHEET,
  timesheet_uuid,
});

/**
 * Get Timesheet hours
 * @param {String} timesheet_uuid
 */
export const getTimesheet_hours = (timesheet_uuid) => ({
  type: GET_TIMESHEET_HOURS, timesheet_uuid,
});

/**
    * Add Timesheet_hour
    * @param {Object} payload
    * @param {Object} history
    * @param {String} redirectTo
    */
export const addTimesheet_hour = (payload, history, redirectTo) => ({
  type: ADD_TIMESHEET_HOUR,
  payload,
  history,
  redirectTo,
});

/**
      * Update Timesheet_hour
      * @param {Object} payload
      * @param {Object} history
      * @param {String} redirectTo
      */
export const updateTimesheet_hour = (payload, history, redirectTo) => ({
  type: UPDATE_TIMESHEET_HOUR,
  payload,
  history,
  redirectTo,
});
  /**
      * Delete Timesheet_hour
      * @param {Number} timesheet_hour_uuid

      */
export const deleteTimesheet_hour = (
  timesheet_hour_uuid,
) => ({
  type: DELETE_TIMESHEET_HOUR,
  timesheet_hour_uuid,
});
