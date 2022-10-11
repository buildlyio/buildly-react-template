import _ from 'lodash';
import {
  SAVE_FEATURE_FORM_DATA,
  ALL_DECISIONS,
  ALL_DECISIONS_SUCCESS,
  ALL_DECISIONS_FAILURE,
  ALL_FEATURES,
  ALL_FEATURES_SUCCESS,
  ALL_FEATURES_FAILURE,
  ALL_FEEDBACKS,
  ALL_FEEDBACKS_SUCCESS,
  ALL_FEEDBACKS_FAILURE,
  ALL_ISSUES,
  ALL_ISSUES_SUCCESS,
  ALL_ISSUES_FAILURE,
  ALL_STATUSES,
  ALL_STATUSES_SUCCESS,
  ALL_STATUSES_FAILURE,
  GET_DECISION,
  GET_DECISION_SUCCESS,
  GET_DECISION_FAILURE,
  GET_FEATURE,
  GET_FEATURE_SUCCESS,
  GET_FEATURE_FAILURE,
  GET_FEEDBACK,
  GET_FEEDBACK_SUCCESS,
  GET_FEEDBACK_FAILURE,
  GET_ISSUE,
  GET_ISSUE_SUCCESS,
  GET_ISSUE_FAILURE,
  GET_STATUS,
  GET_STATUS_SUCCESS,
  GET_STATUS_FAILURE,
  CREATE_DECISION,
  CREATE_DECISION_SUCCESS,
  CREATE_DECISION_FAILURE,
  CREATE_FEATURE,
  CREATE_FEATURE_SUCCESS,
  CREATE_FEATURE_FAILURE,
  CREATE_FEEDBACK,
  CREATE_FEEDBACK_SUCCESS,
  CREATE_FEEDBACK_FAILURE,
  CREATE_ISSUE,
  CREATE_ISSUE_SUCCESS,
  CREATE_ISSUE_FAILURE,
  CREATE_STATUS,
  CREATE_STATUS_SUCCESS,
  CREATE_STATUS_FAILURE,
  UPDATE_DECISION,
  UPDATE_DECISION_SUCCESS,
  UPDATE_DECISION_FAILURE,
  UPDATE_FEATURE,
  UPDATE_FEATURE_SUCCESS,
  UPDATE_FEATURE_FAILURE,
  UPDATE_FEEDBACK,
  UPDATE_FEEDBACK_SUCCESS,
  UPDATE_FEEDBACK_FAILURE,
  UPDATE_ISSUE,
  UPDATE_ISSUE_SUCCESS,
  UPDATE_ISSUE_FAILURE,
  UPDATE_STATUS,
  UPDATE_STATUS_SUCCESS,
  UPDATE_STATUS_FAILURE,
  DELETE_DECISION,
  DELETE_DECISION_SUCCESS,
  DELETE_DECISION_FAILURE,
  DELETE_FEATURE,
  DELETE_FEATURE_SUCCESS,
  DELETE_FEATURE_FAILURE,
  DELETE_FEEDBACK,
  DELETE_FEEDBACK_SUCCESS,
  DELETE_FEEDBACK_FAILURE,
  DELETE_ISSUE,
  DELETE_ISSUE_SUCCESS,
  DELETE_ISSUE_FAILURE,
  DELETE_STATUS,
  DELETE_STATUS_SUCCESS,
  DELETE_STATUS_FAILURE,
  IMPORT_TICKETS,
  IMPORT_TICKETS_SUCCESS,
  IMPORT_TICKETS_FAILURE,
  CLEAR_PRODUCT_DATA,
  CLEAR_PRODUCT_DATA_FAILURE,
  CLEAR_PRODUCT_DATA_SUCCESS,
} from '../actions/decision.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  decisions: [],
  features: [],
  feedbacks: [],
  issues: [],
  statuses: [],
  tickets: [],
  importLoaded: false,
  featureFormData: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_FEATURE_FORM_DATA:
      return {
        ...state,
        featureFormData: action.formData,
      };

    case ALL_DECISIONS:
    case ALL_FEATURES:
    case ALL_FEEDBACKS:
    case ALL_ISSUES:
    case ALL_STATUSES:
    case GET_DECISION:
    case GET_FEATURE:
    case GET_FEEDBACK:
    case GET_ISSUE:
    case GET_STATUS:
    case CREATE_DECISION:
    case CREATE_FEATURE:
    case CREATE_FEEDBACK:
    case CREATE_ISSUE:
    case CREATE_STATUS:
    case IMPORT_TICKETS:
    case UPDATE_DECISION:
    case UPDATE_FEATURE:
    case UPDATE_FEEDBACK:
    case UPDATE_ISSUE:
    case UPDATE_STATUS:
    case DELETE_DECISION:
    case DELETE_FEATURE:
    case DELETE_FEEDBACK:
    case DELETE_ISSUE:
    case DELETE_STATUS:
    case CLEAR_PRODUCT_DATA:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ALL_DECISIONS_FAILURE:
    case ALL_FEATURES_FAILURE:
    case ALL_FEEDBACKS_FAILURE:
    case ALL_ISSUES_FAILURE:
    case ALL_STATUSES_FAILURE:
    case GET_DECISION_FAILURE:
    case GET_FEATURE_FAILURE:
    case GET_FEEDBACK_FAILURE:
    case GET_ISSUE_FAILURE:
    case GET_STATUS_FAILURE:
    case CREATE_DECISION_FAILURE:
    case CREATE_FEATURE_FAILURE:
    case CREATE_FEEDBACK_FAILURE:
    case CREATE_ISSUE_FAILURE:
    case CREATE_STATUS_FAILURE:
    case IMPORT_TICKETS_FAILURE:
    case UPDATE_DECISION_FAILURE:
    case UPDATE_FEATURE_FAILURE:
    case UPDATE_FEEDBACK_FAILURE:
    case UPDATE_ISSUE_FAILURE:
    case UPDATE_STATUS_FAILURE:
    case DELETE_DECISION_FAILURE:
    case DELETE_FEATURE_FAILURE:
    case DELETE_FEEDBACK_FAILURE:
    case DELETE_ISSUE_FAILURE:
    case DELETE_STATUS_FAILURE:
    case CLEAR_PRODUCT_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ALL_DECISIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        decisions: action.data,
      };

    case GET_DECISION_SUCCESS:
    case CREATE_DECISION_SUCCESS:
    case UPDATE_DECISION_SUCCESS: {
      const found = _.find(
        state.decisions,
        { decision_uuid: action.data.decision_uuid },
      );
      const decisions = found
        ? _.map(state.decisions, (decision) => (
          decision.decision_uuid === action.data.decision_uuid
            ? action.data
            : decision
        ))
        : [...state.decisions, action.data];

      return {
        ...state,
        loading: false,
        loaded: true,
        decisions,
      };
    }

    case DELETE_DECISION_SUCCESS: {
      const { decisions } = state;
      _.remove(decisions, { decision_uuid: action.decision_uuid });

      return {
        ...state,
        loading: false,
        loaded: true,
        decisions,
      };
    }

    case ALL_FEATURES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        features: action.data,
      };

    case GET_FEATURE_SUCCESS:
    case CREATE_FEATURE_SUCCESS:
    case UPDATE_FEATURE_SUCCESS: {
      const found = _.find(
        state.features,
        { feature_uuid: action.data.feature_uuid },
      );
      const features = found
        ? _.map(state.features, (feature) => (
          feature.feature_uuid === action.data.feature_uuid
            ? action.data
            : feature
        ))
        : [...state.features, action.data];

      return {
        ...state,
        loading: false,
        loaded: true,
        features,
      };
    }

    case DELETE_FEATURE_SUCCESS: {
      const { features } = state;
      _.remove(features, { feature_uuid: action.feature_uuid });

      return {
        ...state,
        loading: false,
        loaded: true,
        features,
      };
    }

    case ALL_FEEDBACKS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        feedbacks: action.data,
      };

    case GET_FEEDBACK_SUCCESS:
    case CREATE_FEEDBACK_SUCCESS:
    case UPDATE_FEEDBACK_SUCCESS: {
      const found = _.find(
        state.feedbacks,
        { feedback_uuid: action.data.feedback_uuid },
      );
      const feedbacks = found
        ? _.map(state.feedbacks, (feedback) => (
          feedback.feedback_uuid === action.data.feedback_uuid
            ? action.data
            : feedback
        ))
        : [...state.feedbacks, action.data];

      return {
        ...state,
        loading: false,
        loaded: true,
        feedbacks,
      };
    }

    case DELETE_FEEDBACK_SUCCESS: {
      const { feedbacks } = state;
      _.remove(feedbacks, { feedback_uuid: action.feedback_uuid });

      return {
        ...state,
        loading: false,
        loaded: true,
        feedbacks,
      };
    }

    case ALL_ISSUES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        issues: action.data,
      };

    case GET_ISSUE_SUCCESS:
    case CREATE_ISSUE_SUCCESS:
    case UPDATE_ISSUE_SUCCESS: {
      const found = _.find(
        state.issues,
        { issue_uuid: action.data.issue_uuid },
      );
      const issues = found
        ? _.map(state.issues, (issue) => (
          issue.issue_uuid === action.data.issue_uuid
            ? action.data
            : issue
        ))
        : [...state.issues, action.data];

      return {
        ...state,
        loading: false,
        loaded: true,
        issues,
      };
    }

    case DELETE_ISSUE_SUCCESS: {
      const { issues } = state;
      _.remove(issues, { issue_uuid: action.issue_uuid });

      return {
        ...state,
        loading: false,
        loaded: true,
        issues,
      };
    }

    case ALL_STATUSES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        statuses: action.data,
      };

    case GET_STATUS_SUCCESS:
    case CREATE_STATUS_SUCCESS:
    case UPDATE_STATUS_SUCCESS: {
      const found = _.find(
        state.statuses,
        { product_uuid: action.data.product_uuid },
      );
      const statuses = found
        ? _.map(state.statuses, (status) => (
          status.product_uuid === action.data.product_uuid
            ? action.data
            : status
        ))
        : [...state.statuses, action.data];

      return {
        ...state,
        loading: false,
        loaded: true,
        statuses,
      };
    }

    case DELETE_STATUS_SUCCESS: {
      const { statuses } = state;
      _.remove(statuses, { status_uuid: action.status_uuid });

      return {
        ...state,
        loading: false,
        loaded: true,
        statuses,
      };
    }

    case IMPORT_TICKETS_SUCCESS: {
      const found = _.find(
        state.tickets,
        { product_uuid: action.data.product_uuid },
      );
      const tickets = found
        ? _.map(state.tickets, (ticket) => (
          ticket.product_uuid === action.data.product_uuid
            ? action.data
            : ticket
        ))
        : [...state.tickets, action.data];

      return {
        ...state,
        loading: false,
        loaded: true,
        importLoaded: true,
        tickets,
      };
    }

    case CLEAR_PRODUCT_DATA_SUCCESS: {
      const { features, issues } = state;
      _.remove(features, { product_uuid: action.data.product_uuid });
      _.remove(issues, { product_uuid: action.data.product_uuid });

      return {
        ...state,
        loading: false,
        loaded: true,
        features,
        issues,
      };
    }

    default:
      return state;
  }
};
