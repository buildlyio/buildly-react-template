// Decision Action types
export const SAVE_FEATURE_FORM_DATA = 'DECISION/SAVE_FEATURE_FORM_DATA';

export const ALL_DECISIONS = 'DECISION/ALL_DECISIONS';
export const ALL_DECISIONS_SUCCESS = 'DECISION/ALL_DECISIONS_SUCCESS';
export const ALL_DECISIONS_FAILURE = 'DECISION/ALL_DECISIONS_FAILURE';

export const GET_DECISION = 'DECISION/GET_DECISION';
export const GET_DECISION_SUCCESS = 'DECISION/GET_DECISION_SUCCESS';
export const GET_DECISION_FAILURE = 'DECISION/GET_DECISION_FAILURE';

export const CREATE_DECISION = 'DECISION/CREATE_DECISION';
export const CREATE_DECISION_SUCCESS = 'DECISION/CREATE_DECISION_SUCCESS';
export const CREATE_DECISION_FAILURE = 'DECISION/CREATE_DECISION_FAILURE';

export const UPDATE_DECISION = 'DECISION/UPDATE_DECISION';
export const UPDATE_DECISION_SUCCESS = 'DECISION/UPDATE_DECISION_SUCCESS';
export const UPDATE_DECISION_FAILURE = 'DECISION/UPDATE_DECISION_FAILURE';

export const DELETE_DECISION = 'DECISION/DELETE_DECISION';
export const DELETE_DECISION_SUCCESS = 'DECISION/DELETE_DECISION_SUCCESS';
export const DELETE_DECISION_FAILURE = 'DECISION/DELETE_DECISION_FAILURE';

export const ALL_FEATURES = 'DECISION/ALL_FEATURES';
export const ALL_FEATURES_SUCCESS = 'DECISION/ALL_FEATURES_SUCCESS';
export const ALL_FEATURES_FAILURE = 'DECISION/ALL_FEATURES_FAILURE';

export const GET_FEATURE = 'DECISION/GET_FEATURE';
export const GET_FEATURE_SUCCESS = 'DECISION/GET_FEATURE_SUCCESS';
export const GET_FEATURE_FAILURE = 'DECISION/GET_FEATURE_FAILURE';

export const CREATE_FEATURE = 'DECISION/CREATE_FEATURE';
export const CREATE_FEATURE_SUCCESS = 'DECISION/CREATE_FEATURE_SUCCESS';
export const CREATE_FEATURE_FAILURE = 'DECISION/CREATE_FEATURE_FAILURE';

export const UPDATE_FEATURE = 'DECISION/UPDATE_FEATURE';
export const UPDATE_FEATURE_SUCCESS = 'DECISION/UPDATE_FEATURE_SUCCESS';
export const UPDATE_FEATURE_FAILURE = 'DECISION/UPDATE_FEATURE_FAILURE';

export const DELETE_FEATURE = 'DECISION/DELETE_FEATURE';
export const DELETE_FEATURE_SUCCESS = 'DECISION/DELETE_FEATURE_SUCCESS';
export const DELETE_FEATURE_FAILURE = 'DECISION/DELETE_FEATURE_FAILURE';

export const ALL_FEEDBACKS = 'DECISION/ALL_FEEDBACKS';
export const ALL_FEEDBACKS_SUCCESS = 'DECISION/ALL_FEEDBACKS_SUCCESS';
export const ALL_FEEDBACKS_FAILURE = 'DECISION/ALL_FEEDBACKS_FAILURE';

export const GET_FEEDBACK = 'DECISION/GET_FEEDBACK';
export const GET_FEEDBACK_SUCCESS = 'DECISION/GET_FEEDBACK_SUCCESS';
export const GET_FEEDBACK_FAILURE = 'DECISION/GET_FEEDBACK_FAILURE';

export const CREATE_FEEDBACK = 'DECISION/CREATE_FEEDBACK';
export const CREATE_FEEDBACK_SUCCESS = 'DECISION/CREATE_FEEDBACK_SUCCESS';
export const CREATE_FEEDBACK_FAILURE = 'DECISION/CREATE_FEEDBACK_FAILURE';

export const UPDATE_FEEDBACK = 'DECISION/UPDATE_FEEDBACK';
export const UPDATE_FEEDBACK_SUCCESS = 'DECISION/UPDATE_FEEDBACK_SUCCESS';
export const UPDATE_FEEDBACK_FAILURE = 'DECISION/UPDATE_FEEDBACK_FAILURE';

export const DELETE_FEEDBACK = 'DECISION/DELETE_FEEDBACK';
export const DELETE_FEEDBACK_SUCCESS = 'DECISION/DELETE_FEEDBACK_SUCCESS';
export const DELETE_FEEDBACK_FAILURE = 'DECISION/DELETE_FEEDBACK_FAILURE';

export const ALL_ISSUES = 'DECISION/ALL_ISSUES';
export const ALL_ISSUES_SUCCESS = 'DECISION/ALL_ISSUES_SUCCESS';
export const ALL_ISSUES_FAILURE = 'DECISION/ALL_ISSUES_FAILURE';

export const GET_ISSUE = 'DECISION/GET_ISSUE';
export const GET_ISSUE_SUCCESS = 'DECISION/GET_ISSUE_SUCCESS';
export const GET_ISSUE_FAILURE = 'DECISION/GET_ISSUE_FAILURE';

export const CREATE_ISSUE = 'DECISION/CREATE_ISSUE';
export const CREATE_ISSUE_SUCCESS = 'DECISION/CREATE_ISSUE_SUCCESS';
export const CREATE_ISSUE_FAILURE = 'DECISION/CREATE_ISSUE_FAILURE';

export const UPDATE_ISSUE = 'DECISION/UPDATE_ISSUE';
export const UPDATE_ISSUE_SUCCESS = 'DECISION/UPDATE_ISSUE_SUCCESS';
export const UPDATE_ISSUE_FAILURE = 'DECISION/UPDATE_ISSUE_FAILURE';

export const DELETE_ISSUE = 'DECISION/DELETE_ISSUE';
export const DELETE_ISSUE_SUCCESS = 'DECISION/DELETE_ISSUE_SUCCESS';
export const DELETE_ISSUE_FAILURE = 'DECISION/DELETE_ISSUE_FAILURE';

export const ALL_STATUSES = 'DECISION/ALL_STATUSES';
export const ALL_STATUSES_SUCCESS = 'DECISION/ALL_STATUSES_SUCCESS';
export const ALL_STATUSES_FAILURE = 'DECISION/ALL_STATUSES_FAILURE';

export const GET_STATUS = 'DECISION/GET_STATUS';
export const GET_STATUS_SUCCESS = 'DECISION/GET_STATUS_SUCCESS';
export const GET_STATUS_FAILURE = 'DECISION/GET_STATUS_FAILURE';

export const CREATE_STATUS = 'DECISION/CREATE_STATUS';
export const CREATE_STATUS_SUCCESS = 'DECISION/CREATE_STATUS_SUCCESS';
export const CREATE_STATUS_FAILURE = 'DECISION/CREATE_STATUS_FAILURE';

export const UPDATE_STATUS = 'DECISION/UPDATE_STATUS';
export const UPDATE_STATUS_SUCCESS = 'DECISION/UPDATE_STATUS_SUCCESS';
export const UPDATE_STATUS_FAILURE = 'DECISION/UPDATE_STATUS_FAILURE';

export const DELETE_STATUS = 'DECISION/DELETE_STATUS';
export const DELETE_STATUS_SUCCESS = 'DECISION/DELETE_STATUS_SUCCESS';
export const DELETE_STATUS_FAILURE = 'DECISION/DELETE_STATUS_FAILURE';

export const IMPORT_TICKETS = 'DECISION/IMPORT_TICKETS';
export const IMPORT_TICKETS_SUCCESS = 'DECISION/IMPORT_TICKETS_SUCCESS';
export const IMPORT_TICKETS_FAILURE = 'DECISION/IMPORT_TICKETS_FAILURE';

/**
 * Save Feature Form Data
 * @param {Object} formData
 */
export const saveFeatureFormData = (formData) => ({
  type: SAVE_FEATURE_FORM_DATA,
  formData,
});

/**
 * Get all Decisions
 */
export const getAllDecisions = () => ({ type: ALL_DECISIONS });

/**
 * Get a Decision
 * @param {uuid} decision_uuid
 */
export const getDecision = (decision_uuid) => ({
  type: GET_DECISION,
  decision_uuid,
});

/**
 * Create a Decision
 * @param {Object} data
 */
export const createDecision = (data) => ({
  type: CREATE_DECISION,
  data,
});

/**
 * Update a Decision
 * @param {Object} data
 */
export const updateDecision = (data) => ({
  type: UPDATE_DECISION,
  data,
});

/**
 * Delete a Decision
 * @param {uuid} decision_uuid
 */
export const deleteDecision = (decision_uuid) => ({
  type: DELETE_DECISION,
  decision_uuid,
});

/**
 * Get all Features
 */
export const getAllFeatures = () => ({ type: ALL_FEATURES });

/**
 * Get a Feature
 * @param {uuid} feature_uuid
 */
export const getFeature = (feature_uuid) => ({
  type: GET_FEATURE,
  feature_uuid,
});

/**
 * Create a Feature
 * @param {Object} data
 */
export const createFeature = (data) => ({
  type: CREATE_FEATURE,
  data,
});

/**
 * Update a Feature
 * @param {Object} data
 */
export const updateFeature = (data) => ({
  type: UPDATE_FEATURE,
  data,
});

/**
 * Delete a Feature
 * @param {uuid} feature_uuid
 */
export const deleteFeature = (data) => ({
  type: DELETE_FEATURE,
  data,
});

/**
 * Get all Feedbacks
 */
export const getAllFeedbacks = () => ({ type: ALL_FEEDBACKS });

/**
 * Get a Feedback
 * @param {uuid} feedback_uuid
 */
export const getFeedback = (feedback_uuid) => ({
  type: GET_FEEDBACK,
  feedback_uuid,
});

/**
 * Create a Feedback
 * @param {Object} data
 */
export const createFeedback = (data) => ({
  type: CREATE_FEEDBACK,
  data,
});

/**
 * Update a Feedback
 * @param {Object} data
 */
export const updateFeedback = (data) => ({
  type: UPDATE_FEEDBACK,
  data,
});

/**
 * Delete a Feedback
 * @param {uuid} feedback_uuid
 */
export const deleteFeedback = (feedback_uuid) => ({
  type: DELETE_FEEDBACK,
  feedback_uuid,
});

/**
 * Get all Issues
 */
export const getAllIssues = () => ({ type: ALL_ISSUES });

/**
 * Get an Issue
 * @param {uuid} issue_uuid
 */
export const getIssue = (issue_uuid) => ({
  type: GET_ISSUE,
  issue_uuid,
});

/**
 * Create an Issue
 * @param {Object} data
 */
export const createIssue = (data) => ({
  type: CREATE_ISSUE,
  data,
});

/**
 * Update an Issue
 * @param {Object} data
 */
export const updateIssue = (data) => ({
  type: UPDATE_ISSUE,
  data,
});

/**
 * Delete an Issue
 * @param {uuid} issue_uuid
 */
export const deleteIssue = (data) => ({
  type: DELETE_ISSUE,
  data,
});

/**
 * Get all Statuses
 */
export const getAllStatuses = () => ({ type: ALL_STATUSES });

/**
 * Get a Status
 * @param {uuid} product_uuid
 */
export const getStatus = (product_uuid) => ({
  type: GET_STATUS,
  product_uuid,
});

/**
 * Create a Status
 * @param {Object} data
 */
export const createStatus = (data) => ({
  type: CREATE_STATUS,
  data,
});

/**
 * Update a Status
 * @param {Object} data
 */
export const updateStatus = (data) => ({
  type: UPDATE_STATUS,
  data,
});

/**
 * Delete a Status
 * @param {uuid} status_uuid
 */
export const deleteStatus = (status_uuid) => ({
  type: DELETE_STATUS,
  status_uuid,
});

/**
 * Import Tickets
 * @param {Object} data
 */
export const importTickets = (data) => ({
  type: IMPORT_TICKETS,
  data,
});
