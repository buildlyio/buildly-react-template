// Milestone Actions
export const GET_REPOSITORIES = 'MILESTONE/GET_REPOSITORIES';
export const GET_REPOSITORIES_SUCCESS = 'MILESTONE/GET_REPOSITORIES_SUCCESS';
export const GET_REPOSITORIES_FAIL = 'MILESTONE/GET_REPOSITORIES_FAIL';

export const GET_MILESTONES = 'MILESTONE/GET_MILESTONES';
export const GET_MILESTONES_SUCCESS = 'MILESTONE/GET_MILESTONES_SUCCESS';
export const GET_MILESTONES_FAIL = 'MILESTONE/GET_MILESTONES_FAIL';

export const CLEAR_MILESTONES = 'MILESTONE/CLEAR_MILESTONES';
export const CLEAR_MILESTONES_SUCCESS = 'MILESTONE/CLEAR_MILESTONES_SUCCESS';
export const CLEAR_MILESTONES_FAIL = 'MILESTONE/CLEAR_MILESTONES_FAIL';

export const CLEAR_MILESTONES_HEADINGS = 'MILESTONE/CLEAR_MILESTONES_HEADINGS';
export const CLEAR_MILESTONES_HEADINGS_SUCCESS = 'MILESTONE/CLEAR_MILESTONES_HEADINGS_SUCCESS';
export const CLEAR_MILESTONES_HEADINGS_FAIL = 'MILESTONE/CLEAR_MILESTONES_HEADINGS_FAIL';

export const CREATE_MILESTONE = 'MILESTONE/CREATE_MILESTONE';
export const CREATE_MILESTONE_SUCCESS = 'MILESTONE/CREATE_MILESTONE_SUCCESS';
export const CREATE_MILESTONE_FAIL = 'MILESTONE/CREATE_MILESTONE_FAIL';

export const UPDATE_MILESTONE = 'MILESTONE/UPDATE_MILESTONE';
export const UPDATE_MILESTONE_SUCCESS = 'MILESTONE/UPDATE_MILESTONE_SUCCESS';
export const UPDATE_MILESTONE_FAIL = 'MILESTONE/UPDATE_MILESTONE_FAIL';

export const DELETE_MILESTONE = 'MILESTONE/DELETE_MILESTONE';
export const DELETE_MILESTONE_SUCCESS = 'MILESTONE/DELETE_MILESTONE_SUCCESS';
export const DELETE_MILESTONE_FAIL = 'MILESTONE/DELETE_MILESTONE_FAIL';

/**
 * Get repositories data
 */
export const getRepositories = (data) => ({ type: GET_REPOSITORIES, data });

/**
 * Get milestone data of a particular repository
 */
export const getMilestones = (data) => ({ type: GET_MILESTONES, data });

/**
 * Clear milestone data
 */
export const clearMilestones = () => ({ type: CLEAR_MILESTONES });

/**
 * Clear milestone headings data
 */
export const clearMilestonesHeadings = () => ({ type: CLEAR_MILESTONES_HEADINGS });

/**
 * Create Milestone
 */
export const createMilestone = (data) => ({ type: CREATE_MILESTONE, data });

/**
 * Delete Milestone
 */
export const deleteMilestone = (data) => ({ type: DELETE_MILESTONE, data });

/**
 * Edit Milestone
 */
export const updateMilestone = (data) => ({ type: UPDATE_MILESTONE, data });