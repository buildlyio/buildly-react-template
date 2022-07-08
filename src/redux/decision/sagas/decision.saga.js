import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
import { routes } from '@routes/routesConstants';
import {
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
  saveFeatureFormData,
  IMPORT_TICKETS,
  IMPORT_TICKETS_SUCCESS,
  IMPORT_TICKETS_FAILURE,
  CLEAR_PRODUCT_DATA,
  CLEAR_PRODUCT_DATA_SUCCESS,
  CLEAR_PRODUCT_DATA_FAILURE,
} from '../actions/decision.actions';
import {
  deleteProduct,
} from '../../product/actions/product.actions';

const decisionEndpoint = 'decision/';

function* allDecisions(payload) {
  try {
    const decisions = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${decisionEndpoint}decision/`,
    );
    yield put({ type: ALL_DECISIONS_SUCCESS, data: decisions.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Decisions!',
        }),
      ),
      yield put({
        type: ALL_DECISIONS_FAILURE,
        error,
      }),
    ];
  }
}

function* getDecision(payload) {
  try {
    const decision = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${decisionEndpoint}decision/?decision_uuid=${payload.decision_uuid}`,
    );
    yield put({ type: GET_DECISION_SUCCESS, data: decision.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Decision!',
        }),
      ),
      yield put({
        type: GET_DECISION_FAILURE,
        error,
      }),
    ];
  }
}

function* createDecision(payload) {
  try {
    const decision = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${decisionEndpoint}decision/`,
      payload.data,
    );
    yield put({ type: CREATE_DECISION_SUCCESS, data: decision.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Decision!',
        }),
      ),
      yield put({
        type: CREATE_DECISION_FAILURE,
        error,
      }),
    ];
  }
}

function* updateDecision(payload) {
  try {
    const decision = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${decisionEndpoint}decision/${payload.data.decision_uuid}`,
      payload.data,
    );
    yield put({ type: UPDATE_DECISION_SUCCESS, data: decision.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Decision!',
        }),
      ),
      yield put({
        type: UPDATE_DECISION_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteDecision(payload) {
  const { decision_uuid } = payload;
  try {
    const decision = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${decisionEndpoint}decision/${decision_uuid}`,
    );
    yield put({ type: DELETE_DECISION_SUCCESS, decision_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Decision!',
        }),
      ),
      yield put({
        type: DELETE_DECISION_FAILURE,
        error,
      }),
    ];
  }
}

function* allFeatures(payload) {
  try {
    const features = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${decisionEndpoint}feature/`,
    );
    yield put({ type: ALL_FEATURES_SUCCESS, data: features.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Features!',
        }),
      ),
      yield put({
        type: ALL_FEATURES_FAILURE,
        error,
      }),
    ];
  }
}

function* getFeature(payload) {
  try {
    const feature = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${decisionEndpoint}feature/?feature_uuid=${payload.feature_uuid}`,
    );
    yield put({ type: GET_FEATURE_SUCCESS, data: feature.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Feature!',
        }),
      ),
      yield put({
        type: GET_FEATURE_FAILURE,
        error,
      }),
    ];
  }
}

function* createFeature(payload) {
  try {
    const feature = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${decisionEndpoint}feature/`,
      payload.data,
    );
    yield [
      yield put({ type: CREATE_FEATURE_SUCCESS, data: feature.data }),
      yield put(saveFeatureFormData(null)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Feature!',
        }),
      ),
      yield put({
        type: CREATE_FEATURE_FAILURE,
        error,
      }),
    ];
  }
}

function* updateFeature(payload) {
  try {
    const feature = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${decisionEndpoint}feature/${payload.data.feature_uuid}`,
      payload.data,
    );
    yield put({ type: UPDATE_FEATURE_SUCCESS, data: feature.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Feature!',
        }),
      ),
      yield put({
        type: UPDATE_FEATURE_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteFeature(payload) {
  const { feature_uuid } = payload.data;
  try {
    const feature = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${decisionEndpoint}feature/${feature_uuid}`,
      payload.data,
    );
    yield put({ type: DELETE_FEATURE_SUCCESS, feature_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Feature!',
        }),
      ),
      yield put({
        type: DELETE_FEATURE_FAILURE,
        error,
      }),
    ];
  }
}

function* allFeedbacks(payload) {
  try {
    const feedbacks = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${decisionEndpoint}feedback/`,
    );
    yield put({ type: ALL_FEEDBACKS_SUCCESS, data: feedbacks.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Feedbacks!',
        }),
      ),
      yield put({
        type: ALL_FEEDBACKS_FAILURE,
        error,
      }),
    ];
  }
}

function* getFeedback(payload) {
  try {
    const feedback = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${decisionEndpoint}feedback/?feedback_uuid=${payload.feedback_uuid}`,
    );
    yield put({ type: GET_FEEDBACK_SUCCESS, data: feedback.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Feedback!',
        }),
      ),
      yield put({
        type: GET_FEEDBACK_FAILURE,
        error,
      }),
    ];
  }
}

function* createFeedback(payload) {
  try {
    const feedback = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${decisionEndpoint}feedback/`,
      payload.data,
    );
    yield put({ type: CREATE_FEEDBACK_SUCCESS, data: feedback.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Feedback!',
        }),
      ),
      yield put({
        type: CREATE_FEEDBACK_FAILURE,
        error,
      }),
    ];
  }
}

function* updateFeedback(payload) {
  try {
    const feedback = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${decisionEndpoint}feedback/${payload.data.feedback_uuid}`,
      payload.data,
    );
    yield put({ type: UPDATE_FEEDBACK_SUCCESS, data: feedback.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Feedback!',
        }),
      ),
      yield put({
        type: UPDATE_FEEDBACK_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteFeedback(payload) {
  const { feedback_uuid } = payload;
  try {
    const feedback = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${decisionEndpoint}feedback/${feedback_uuid}`,
    );
    yield put({ type: DELETE_FEEDBACK_SUCCESS, feedback_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Feedback!',
        }),
      ),
      yield put({
        type: DELETE_FEEDBACK_FAILURE,
        error,
      }),
    ];
  }
}

function* allIssues(payload) {
  try {
    const issues = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${decisionEndpoint}issue/`,
    );
    yield put({ type: ALL_ISSUES_SUCCESS, data: issues.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Issues!',
        }),
      ),
      yield put({
        type: ALL_ISSUES_FAILURE,
        error,
      }),
    ];
  }
}

function* getIssue(payload) {
  try {
    const issue = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${decisionEndpoint}issue/?issue_uuid=${payload.issue_uuid}`,
    );
    yield put({ type: GET_ISSUE_SUCCESS, data: issue.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Issue!',
        }),
      ),
      yield put({
        type: GET_ISSUE_FAILURE,
        error,
      }),
    ];
  }
}

function* createIssue(payload) {
  try {
    if (payload.data.length > 0) {
      for (let i = 0; i < payload.data.length; i += 1) {
        const issue = yield call(
          httpService.makeRequest,
          'post',
          `${window.env.API_URL}${decisionEndpoint}issue/`,
          payload.data[i],
        );
        yield put({ type: CREATE_ISSUE_SUCCESS, data: issue.data });
      }
    } else {
      const issue = yield call(
        httpService.makeRequest,
        'post',
        `${window.env.API_URL}${decisionEndpoint}issue/`,
        payload.data,
      );
      yield put({ type: CREATE_ISSUE_SUCCESS, data: issue.data });
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Issue!',
        }),
      ),
      yield put({
        type: CREATE_ISSUE_FAILURE,
        error,
      }),
    ];
  }
}

function* updateIssue(payload) {
  try {
    const issue = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${decisionEndpoint}issue/${payload.data.issue_uuid}`,
      payload.data,
    );
    yield put({ type: UPDATE_ISSUE_SUCCESS, data: issue.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Issue!',
        }),
      ),
      yield put({
        type: UPDATE_ISSUE_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteIssue(payload) {
  const { issue_uuid } = payload.data;
  try {
    const issue = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${decisionEndpoint}issue/${issue_uuid}`,
      payload.data,
    );
    yield put({ type: DELETE_ISSUE_SUCCESS, issue_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Issue!',
        }),
      ),
      yield put({
        type: DELETE_ISSUE_FAILURE,
        error,
      }),
    ];
  }
}

function* allStatuses(payload) {
  try {
    const statuses = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${decisionEndpoint}status/`,
    );
    yield put({ type: ALL_STATUSES_SUCCESS, data: statuses.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Statuses!',
        }),
      ),
      yield put({
        type: ALL_STATUSES_FAILURE,
        error,
      }),
    ];
  }
}

function* getStatus(payload) {
  try {
    const status = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${decisionEndpoint}status/?product_uuid=${payload.product_uuid}`,
    );
    yield put({ type: GET_STATUS_SUCCESS, data: status.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Status!',
        }),
      ),
      yield put({
        type: GET_STATUS_FAILURE,
        error,
      }),
    ];
  }
}

function* createStatus(payload) {
  try {
    if (payload.data.length > 0) {
      for (let i = 0; i < payload.data.length; i += 1) {
        const status = yield call(
          httpService.makeRequest,
          'post',
          `${window.env.API_URL}${decisionEndpoint}status/`,
          payload.data[i],
        );
        yield put({ type: CREATE_STATUS_SUCCESS, data: status.data });
      }
    } else {
      const status = yield call(
        httpService.makeRequest,
        'post',
        `${window.env.API_URL}${decisionEndpoint}status/`,
        payload.data,
      );
      yield put({ type: CREATE_STATUS_SUCCESS, data: status.data });
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Status!',
        }),
      ),
      yield put({
        type: CREATE_STATUS_FAILURE,
        error,
      }),
    ];
  }
}

function* updateStatus(payload) {
  try {
    const status = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${decisionEndpoint}status/${payload.data.status_uuid}`,
      payload.data,
    );
    yield put({ type: UPDATE_STATUS_SUCCESS, data: status.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Status!',
        }),
      ),
      yield put({
        type: UPDATE_STATUS_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteStatus(payload) {
  const { status_uuid } = payload;
  try {
    const status = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${decisionEndpoint}status/${status_uuid}`,
    );
    yield put({ type: DELETE_STATUS_SUCCESS, status_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Status!',
        }),
      ),
      yield put({
        type: DELETE_STATUS_FAILURE,
        error,
      }),
    ];
  }
}

function* importTickets(payload) {
  try {
    const ticket = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${decisionEndpoint}import-project-tickets/`,
      payload.data,
    );
    yield put({ type: IMPORT_TICKETS_SUCCESS, data: ticket.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t import tickets!',
        }),
      ),
      yield put({
        type: IMPORT_TICKETS_FAILURE,
        error,
      }),
    ];
  }
}

function* clearProductData(payload) {
  const { product_uuid } = payload;
  try {
    const product = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${decisionEndpoint}clear-product-data/`,
      product_uuid,
    );
    yield put({ type: CLEAR_PRODUCT_DATA_SUCCESS, product_uuid });
    yield put(deleteProduct(payload));
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t clear product!',
        }),
      ),
      yield put({
        type: CLEAR_PRODUCT_DATA_FAILURE,
        error,
      }),
    ];
  }
}

// Watchers
function* watchGetAllDecisions() {
  yield takeLatest(ALL_DECISIONS, allDecisions);
}

function* watchGetDecision() {
  yield takeLatest(GET_DECISION, getDecision);
}

function* watchCreateDecision() {
  yield takeLatest(CREATE_DECISION, createDecision);
}

function* watchUpdateDecision() {
  yield takeLatest(UPDATE_DECISION, updateDecision);
}

function* watchDeleteDecision() {
  yield takeLatest(DELETE_DECISION, deleteDecision);
}

function* watchGetAllFeatures() {
  yield takeLatest(ALL_FEATURES, allFeatures);
}

function* watchGetFeature() {
  yield takeLatest(GET_FEATURE, getFeature);
}

function* watchCreateFeature() {
  yield takeLatest(CREATE_FEATURE, createFeature);
}

function* watchUpdateFeature() {
  yield takeLatest(UPDATE_FEATURE, updateFeature);
}

function* watchDeleteFeature() {
  yield takeLatest(DELETE_FEATURE, deleteFeature);
}

function* watchGetAllFeedbacks() {
  yield takeLatest(ALL_FEEDBACKS, allFeedbacks);
}

function* watchGetFeedback() {
  yield takeLatest(GET_FEEDBACK, getFeedback);
}

function* watchCreateFeedback() {
  yield takeLatest(CREATE_FEEDBACK, createFeedback);
}

function* watchUpdateFeedback() {
  yield takeLatest(UPDATE_FEEDBACK, updateFeedback);
}

function* watchDeleteFeedback() {
  yield takeLatest(DELETE_FEEDBACK, deleteFeedback);
}

function* watchGetAllIssues() {
  yield takeLatest(ALL_ISSUES, allIssues);
}

function* watchGetIssue() {
  yield takeLatest(GET_ISSUE, getIssue);
}

function* watchCreateIssue() {
  yield takeLatest(CREATE_ISSUE, createIssue);
}

function* watchUpdateIssue() {
  yield takeLatest(UPDATE_ISSUE, updateIssue);
}

function* watchDeleteIssue() {
  yield takeLatest(DELETE_ISSUE, deleteIssue);
}

function* watchGetAllStatuses() {
  yield takeLatest(ALL_STATUSES, allStatuses);
}

function* watchGetStatus() {
  yield takeLatest(GET_STATUS, getStatus);
}

function* watchCreateStatus() {
  yield takeLatest(CREATE_STATUS, createStatus);
}

function* watchUpdateStatus() {
  yield takeLatest(UPDATE_STATUS, updateStatus);
}

function* watchDeleteStatus() {
  yield takeLatest(DELETE_STATUS, deleteStatus);
}

function* watchImportTickets() {
  yield takeLatest(IMPORT_TICKETS, importTickets);
}

function* watchClearProductData() {
  yield takeLatest(CLEAR_PRODUCT_DATA, clearProductData);
}

export default function* decisionSaga() {
  yield all([
    watchGetAllDecisions(),
    watchGetAllFeatures(),
    watchGetAllFeedbacks(),
    watchGetAllIssues(),
    watchGetAllStatuses(),
    watchGetDecision(),
    watchGetFeature(),
    watchGetFeedback(),
    watchGetIssue(),
    watchGetStatus(),
    watchCreateDecision(),
    watchCreateFeature(),
    watchCreateFeedback(),
    watchCreateIssue(),
    watchCreateStatus(),
    watchImportTickets(),
    watchUpdateDecision(),
    watchUpdateFeature(),
    watchUpdateFeedback(),
    watchUpdateIssue(),
    watchUpdateStatus(),
    watchDeleteDecision(),
    watchDeleteFeature(),
    watchDeleteFeedback(),
    watchDeleteIssue(),
    watchDeleteStatus(),
    watchClearProductData(),
  ]);
}
