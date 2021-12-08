import {
  GET_FEATURES,
  GET_FEATURES_SUCCESS,
  GET_FEATURES_FAILURE,
  ADD_FEATURE,
  ADD_FEATURE_SUCCESS,
  ADD_FEATURE_FAILURE,
  UPDATE_FEATURE,
  UPDATE_FEATURE_SUCCESS,
  UPDATE_FEATURE_FAILURE,
  DELETE_FEATURE,
  DELETE_FEATURE_SUCCESS,
  DELETE_FEATURE_FAILURE,
  GET_ISSUES,
  GET_ISSUES_SUCCESS,
  GET_ISSUES_FAILURE,
  ADD_ISSUE,
  ADD_ISSUE_SUCCESS,
  ADD_ISSUE_FAILURE,
  UPDATE_ISSUE,
  UPDATE_ISSUE_SUCCESS,
  UPDATE_ISSUE_FAILURE,
  DELETE_ISSUE,
  DELETE_ISSUE_SUCCESS,
  DELETE_ISSUE_FAILURE,
  GET_FEEDBACKS,
  GET_FEEDBACKS_SUCCESS,
  GET_FEEDBACKS_FAILURE,
  ADD_FEEDBACK,
  ADD_FEEDBACK_SUCCESS,
  ADD_FEEDBACK_FAILURE,
  UPDATE_FEEDBACK,
  UPDATE_FEEDBACK_SUCCESS,
  UPDATE_FEEDBACK_FAILURE,
  DELETE_FEEDBACK,
  DELETE_FEEDBACK_SUCCESS,
  DELETE_FEEDBACK_FAILURE,
  GET_DECISIONS,
  GET_DECISIONS_SUCCESS,
  GET_DECISIONS_FAILURE,
  ADD_DECISION,
  ADD_DECISION_SUCCESS,
  ADD_DECISION_FAILURE,
  UPDATE_DECISION,
  UPDATE_DECISION_SUCCESS,
  UPDATE_DECISION_FAILURE,
  DELETE_DECISION,
  DELETE_DECISION_SUCCESS,
  DELETE_DECISION_FAILURE,
  GET_STATUSES,
  GET_STATUSES_SUCCESS,
  GET_STATUSES_FAILURE,
  ADD_STATUS,
  ADD_STATUS_SUCCESS,
  ADD_STATUS_FAILURE,
  UPDATE_STATUS,
  UPDATE_STATUS_SUCCESS,
  UPDATE_STATUS_FAILURE,
  DELETE_STATUS,
  DELETE_STATUS_SUCCESS,
  DELETE_STATUS_FAILURE,
} from '../actions/release.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  feature: null,
  issue: null,
  feedback: null,
  decision: null,
  status: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_FEATURES:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_FEATURES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        feature: action.data,
      };

    case GET_FEATURES_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_FEATURE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_FEATURE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        feature: action.data,
      };

    case ADD_FEATURE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_FEATURE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_FEATURE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        feature: action.data,
      };

    case UPDATE_FEATURE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_FEATURE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_FEATURE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        feature: action.data,
      };

    case DELETE_FEATURE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_ISSUES:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_ISSUES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        issue: action.data,
      };

    case GET_ISSUES_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_ISSUE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_ISSUE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        issue: action.data,
      };

    case ADD_ISSUE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_ISSUE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_ISSUE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        issue: action.data,
      };

    case UPDATE_ISSUE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_ISSUE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_ISSUE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        issue: action.data,
      };

    case DELETE_ISSUE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_FEEDBACKS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_FEEDBACKS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        feedback: action.data,
      };

    case GET_FEEDBACKS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_FEEDBACK:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        feedback: action.data,
      };

    case ADD_FEEDBACK_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_FEEDBACK:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        feedback: action.data,
      };

    case UPDATE_FEEDBACK_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_FEEDBACK:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        feedback: action.data,
      };

    case DELETE_FEEDBACK_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_DECISIONS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_DECISIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        decision: action.data,
      };

    case GET_DECISIONS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_DECISION:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_DECISION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        decision: action.data,
      };

    case ADD_DECISION_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_DECISION:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_DECISION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        decision: action.data,
      };

    case UPDATE_DECISION_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_DECISION:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_DECISION_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        decision: action.data,
      };

    case DELETE_DECISION_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_STATUSES:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_STATUSES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        status: action.data,
      };

    case GET_STATUSES_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_STATUS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        status: action.data,
      };

    case ADD_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_STATUS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        status: action.data,
      };

    case UPDATE_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_STATUS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        status: action.data,
      };

    case DELETE_STATUS_FAILURE:
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
