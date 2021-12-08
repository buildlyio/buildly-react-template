export const GET_FEATURES = 'RELEASE/GET_FEATURES';
export const GET_FEATURES_SUCCESS = 'RELEASE/GET_FEATURES_SUCCESS';
export const GET_FEATURES_FAILURE = 'RELEASE/GET_FEATURES_FAILURE';

export const ADD_FEATURE = 'RELEASE/ADD_FEATURE';
export const ADD_FEATURE_SUCCESS = 'RELEASE/ADD_FEATURE_SUCCESS';
export const ADD_FEATURE_FAILURE = 'RELEASE/ADD_FEATURE_FAILURE';

export const UPDATE_FEATURE = 'RELEASE/UPDATE_FEATURE';
export const UPDATE_FEATURE_SUCCESS = 'RELEASE/UPDATE_FEATURE_SUCCESS';
export const UPDATE_FEATURE_FAILURE = 'RELEASE/UPDATE_FEATURE_FAILURE';

export const DELETE_FEATURE = 'RELEASE/DELETE_FEATURE';
export const DELETE_FEATURE_SUCCESS = 'RELEASE/DELETE_FEATURE_SUCCESS';
export const DELETE_FEATURE_FAILURE = 'RELEASE/DELETE_FEATURE_FAILURE';

export const GET_ISSUES = 'RELEASE/GET_ISSUES';
export const GET_ISSUES_SUCCESS = 'RELEASE/GET_ISSUES_SUCCESS';
export const GET_ISSUES_FAILURE = 'RELEASE/GET_ISSUES_FAILURE';

export const ADD_ISSUE = 'RELEASE/ADD_ISSUE';
export const ADD_ISSUE_SUCCESS = 'RELEASE/ADD_ISSUE_SUCCESS';
export const ADD_ISSUE_FAILURE = 'RELEASE/ADD_ISSUE_FAILURE';

export const UPDATE_ISSUE = 'RELEASE/UPDATE_ISSUE';
export const UPDATE_ISSUE_SUCCESS = 'RELEASE/UPDATE_ISSUE_SUCCESS';
export const UPDATE_ISSUE_FAILURE = 'RELEASE/UPDATE_ISSUE_FAILURE';

export const DELETE_ISSUE = 'RELEASE/DELETE_ISSUE';
export const DELETE_ISSUE_SUCCESS = 'RELEASE/DELETE_ISSUE_SUCCESS';
export const DELETE_ISSUE_FAILURE = 'RELEASE/DELETE_ISSUE_FAILURE';

export const GET_FEEDBACKS = 'RELEASE/GET_FEEDBACKS';
export const GET_FEEDBACKS_SUCCESS = 'RELEASE/GET_FEEDBACKS_SUCCESS';
export const GET_FEEDBACKS_FAILURE = 'RELEASE/GET_FEEDBACKS_FAILURE';

export const ADD_FEEDBACK = 'RELEASE/ADD_FEEDBACK';
export const ADD_FEEDBACK_SUCCESS = 'RELEASE/ADD_FEEDBACK_SUCCESS';
export const ADD_FEEDBACK_FAILURE = 'RELEASE/ADD_FEEDBACK_FAILURE';

export const UPDATE_FEEDBACK = 'RELEASE/UPDATE_FEEDBACK';
export const UPDATE_FEEDBACK_SUCCESS = 'RELEASE/UPDATE_FEEDBACK_SUCCESS';
export const UPDATE_FEEDBACK_FAILURE = 'RELEASE/UPDATE_FEEDBACK_FAILURE';

export const DELETE_FEEDBACK = 'RELEASE/DELETE_FEEDBACK';
export const DELETE_FEEDBACK_SUCCESS = 'RELEASE/DELETE_FEEDBACK_SUCCESS';
export const DELETE_FEEDBACK_FAILURE = 'RELEASE/DELETE_FEEDBACK_FAILURE';

export const GET_DECISIONS = 'RELEASE/GET_DECISIONS';
export const GET_DECISIONS_SUCCESS = 'RELEASE/GET_DECISIONS_SUCCESS';
export const GET_DECISIONS_FAILURE = 'RELEASE/GET_DECISIONS_FAILURE';

export const ADD_DECISION = 'RELEASE/ADD_DECISION';
export const ADD_DECISION_SUCCESS = 'RELEASE/ADD_DECISION_SUCCESS';
export const ADD_DECISION_FAILURE = 'RELEASE/ADD_DECISION_FAILURE';

export const UPDATE_DECISION = 'RELEASE/UPDATE_DECISION';
export const UPDATE_DECISION_SUCCESS = 'RELEASE/UPDATE_DECISION_SUCCESS';
export const UPDATE_DECISION_FAILURE = 'RELEASE/UPDATE_DECISION_FAILURE';

export const DELETE_DECISION = 'RELEASE/DELETE_DECISION';
export const DELETE_DECISION_SUCCESS = 'RELEASE/DELETE_DECISION_SUCCESS';
export const DELETE_DECISION_FAILURE = 'RELEASE/DELETE_DECISION_FAILURE';

export const GET_STATUSES = 'RELEASE/GET_STATUSES';
export const GET_STATUSES_SUCCESS = 'RELEASE/GET_STATUSES_SUCCESS';
export const GET_STATUSES_FAILURE = 'RELEASE/GET_STATUSES_FAILURE';

export const ADD_STATUS = 'RELEASE/ADD_STATUS';
export const ADD_STATUS_SUCCESS = 'RELEASE/ADD_STATUS_SUCCESS';
export const ADD_STATUS_FAILURE = 'RELEASE/ADD_STATUS_FAILURE';

export const UPDATE_STATUS = 'RELEASE/UPDATE_STATUS';
export const UPDATE_STATUS_SUCCESS = 'RELEASE/UPDATE_STATUS_SUCCESS';
export const UPDATE_STATUS_FAILURE = 'RELEASE/UPDATE_STATUS_FAILURE';

export const DELETE_STATUS = 'RELEASE/DELETE_STATUS';
export const DELETE_STATUS_SUCCESS = 'RELEASE/DELETE_STATUS_SUCCESS';
export const DELETE_STATUS_FAILURE = 'RELEASE/DELETE_STATUS_FAILURE';

/**
 * Get Features
 * @param {String} project_uuid
 */
export const getFeatures = (project_uuid) => ({ type: GET_FEATURES, project_uuid });

/**
   * Add Feature
   * @param {Object} payload
   * @param {Object} history
   * @param {String} redirectTo
   */
export const addFeature = (payload, history, redirectTo) => ({
  type: ADD_FEATURE,
  payload,
  history,
  redirectTo,
});

/**
     * Update Feature
     * @param {Object} payload
     * @param {Object} history
     * @param {String} redirectTo
     */
export const updateFeature = (payload, history, redirectTo) => ({
  type: UPDATE_FEATURE,
  payload,
  history,
  redirectTo,
});

/**
     * Delete Feature
     * @param {Number} feature_uuid

     */
export const deleteFeature = (
  feature_uuid,
) => ({
  type: DELETE_FEATURE,
  feature_uuid,
});

/**
 * Get Issues
 * @param {String} project_uuid
 */
export const getIssues = (project_uuid) => ({ type: GET_ISSUES, project_uuid });

/**
   * Add Issue
   * @param {Object} payload
   * @param {Object} history
   * @param {String} redirectTo
   */
export const addIssue = (payload, history, redirectTo) => ({
  type: ADD_ISSUE,
  payload,
  history,
  redirectTo,
});

/**
     * Update Issue
     * @param {Object} payload
     * @param {Object} history
     * @param {String} redirectTo
     */
export const updateIssue = (payload, history, redirectTo) => ({
  type: UPDATE_ISSUE,
  payload,
  history,
  redirectTo,
});

/**
     * Delete Issue
     * @param {Number} issue_uuid

     */
export const deleteIssue = (
  issue_uuid,
) => ({
  type: DELETE_ISSUE,
  issue_uuid,
});

/**
 * Get Feedbacks
 * @param {String} project_uuid
 */
export const getFeedbacks = (project_uuid, issue_uuid, feature_uuid) => ({
  type: GET_FEEDBACKS, project_uuid, issue_uuid, feature_uuid,
});

/**
   * Add Feedback
   * @param {Object} payload
   * @param {Object} history
   * @param {String} redirectTo
   */
export const addFeedback = (payload, history, redirectTo) => ({
  type: ADD_FEEDBACK,
  payload,
  history,
  redirectTo,
});

/**
     * Update Feedback
     * @param {Object} payload
     * @param {Object} history
     * @param {String} redirectTo
     */
export const updateFeedback = (payload, history, redirectTo) => ({
  type: UPDATE_FEEDBACK,
  payload,
  history,
  redirectTo,
});

/**
     * Delete Feedback
     * @param {Number} feedback_uuid

     */
export const deleteFeedback = (
  feedback_uuid,
) => ({
  type: DELETE_FEEDBACK,
  feedback_uuid,
});

/**
 * Get Decisions
 * @param {String} project_uuid
 * @param {String} issue_uuid
 * @param {String} feature_uuid
 */
export const getDecisions = (project_uuid, issue_uuid, feature_uuid) => ({
  type: GET_DECISIONS, project_uuid, issue_uuid, feature_uuid,
});

/**
   * Add Decision
   * @param {Object} payload
   * @param {Object} history
   * @param {String} redirectTo
   */
export const addDecision = (payload, history, redirectTo) => ({
  type: ADD_DECISION,
  payload,
  history,
  redirectTo,
});

/**
     * Update Decision
     * @param {Object} payload
     * @param {Object} history
     * @param {String} redirectTo
     */
export const updateDecision = (payload, history, redirectTo) => ({
  type: UPDATE_DECISION,
  payload,
  history,
  redirectTo,
});

/**
     * Delete Decision
     * @param {Number} decision_uuid

     */
export const deleteDecision = (
  decision_uuid,
) => ({
  type: DELETE_DECISION,
  decision_uuid,
});

/**
 * Get Statuses
 * @param {String} project_uuid
 */
export const getStatuses = (project_uuid, issue_uuid, feature_uuid) => ({
  type: GET_STATUSES, project_uuid, issue_uuid, feature_uuid,
});

/**
   * Add Status
   * @param {Object} payload
   * @param {Object} history
   * @param {String} redirectTo
   */
export const addStatus = (payload, history, redirectTo) => ({
  type: ADD_STATUS,
  payload,
  history,
  redirectTo,
});

/**
     * Update Status
     * @param {Object} payload
     * @param {Object} history
     * @param {String} redirectTo
     */
export const updateStatus = (payload, history, redirectTo) => ({
  type: UPDATE_STATUS,
  payload,
  history,
  redirectTo,
});

/**
     * Delete Status
     * @param {Number} status_uuid

     */
export const deleteStatus = (
  status_uuid,
) => ({
  type: DELETE_STATUS,
  status_uuid,
});
