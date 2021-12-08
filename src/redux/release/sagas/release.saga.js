import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
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

const releaseEndpoint = 'release/';

function* getFeatures(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${releaseEndpoint}feature/?project_uuid=${payload.project_uuid}`,
    );
    yield put({ type: GET_FEATURES_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Features!',
        }),
      ),
      yield put({
        type: GET_FEATURES_FAILURE,
        error,
      }),
    ];
  }
}

function* addFeature(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${releaseEndpoint}feature/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getFeatures(data.data.feature_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Feature',
          }),
        ),

      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Add Feature due to some error!',
        }),
      ),
      yield put({
        type: ADD_FEATURE_FAILURE,
        error,
      }),
    ];
  }
}

function* updateFeature(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${releaseEndpoint}feature/${payload.feature_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getFeatures(payload.feature_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Feature',
          }),
        ),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Edit Feature due to some error!',
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
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${releaseEndpoint}feature/${payload.feature_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Feature deleted successfully!',
        }),
      ),
      yield put(getFeatures(payload.project_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting feature!',
        }),
      ),
      yield put({
        type: DELETE_FEATURE_FAILURE,
        error,
      }),
    ];
  }
}

function* getIssues(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${releaseEndpoint}issue/?project_uuid=${payload.project_uuid}`,
    );
    yield put({ type: GET_ISSUES_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Issues!',
        }),
      ),
      yield put({
        type: GET_ISSUES_FAILURE,
        error,
      }),
    ];
  }
}

function* addIssue(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${releaseEndpoint}issue/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getIssues(data.data.issue_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Issue',
          }),
        ),

      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Add Issue due to some error!',
        }),
      ),
      yield put({
        type: ADD_ISSUE_FAILURE,
        error,
      }),
    ];
  }
}

function* updateIssue(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${releaseEndpoint}issue/${payload.issue_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getIssues(payload.issue_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Issue',
          }),
        ),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Edit Issue due to some error!',
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
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${releaseEndpoint}issue/${payload.issue_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Issue deleted successfully!',
        }),
      ),
      yield put(getIssues(payload.project_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting issue!',
        }),
      ),
      yield put({
        type: DELETE_ISSUE_FAILURE,
        error,
      }),
    ];
  }
}

function* getFeedbacks(payload) {
  try {
    let query_params = '';
    if (payload.project_uuid) {
      query_params = `project_uuid=${payload.project_uuid}/`;
    } else if (payload.issue_uuid) {
      query_params = query_params.concat(`issue_uuid=${payload.issue_uuid}`);
    } else if (payload.feature_uuid) {
      query_params = query_params.concat(`feature_uuid=${payload.feature_uuid}`);
    }
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${releaseEndpoint}feedback/?${query_params}`,
    );
    yield put({ type: GET_FEEDBACKS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Feedbacks!',
        }),
      ),
      yield put({
        type: GET_FEEDBACKS_FAILURE,
        error,
      }),
    ];
  }
}

function* addFeedback(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${releaseEndpoint}feedback/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getFeedbacks(data.data.feedback_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Feedback',
          }),
        ),

      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Add Feedback due to some error!',
        }),
      ),
      yield put({
        type: ADD_FEEDBACK_FAILURE,
        error,
      }),
    ];
  }
}

function* updateFeedback(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${releaseEndpoint}feedback/${payload.feedback_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getFeedbacks(payload.feedback_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Feedback',
          }),
        ),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Edit Feedback due to some error!',
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
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${releaseEndpoint}feedback/${payload.feedback_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Feedback deleted successfully!',
        }),
      ),
      yield put(getFeedbacks(payload.project_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting feedback!',
        }),
      ),
      yield put({
        type: DELETE_FEEDBACK_FAILURE,
        error,
      }),
    ];
  }
}

function* getDecisions(payload) {
  try {
    let query_params = '';
    if (payload.project_uuid) {
      query_params = `project_uuid=${payload.project_uuid}/`;
    } else if (payload.issue_uuid) {
      query_params = query_params.concat(`issue_uuid=${payload.issue_uuid}`);
    } else if (payload.feature_uuid) {
      query_params = query_params.concat(`feature_uuid=${payload.feature_uuid}`);
    }
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${releaseEndpoint}decision/?${query_params}`,
    );
    yield put({ type: GET_DECISIONS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Decisions!',
        }),
      ),
      yield put({
        type: GET_DECISIONS_FAILURE,
        error,
      }),
    ];
  }
}

function* addDecision(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${releaseEndpoint}decision/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getDecisions(data.data.decision_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Decision',
          }),
        ),

      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Add Decision due to some error!',
        }),
      ),
      yield put({
        type: ADD_DECISION_FAILURE,
        error,
      }),
    ];
  }
}

function* updateDecision(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${releaseEndpoint}decision/${payload.decision_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getDecisions(payload.decision_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Decision',
          }),
        ),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Edit Decision due to some error!',
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
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${releaseEndpoint}decision/${payload.decision_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Decision deleted successfully!',
        }),
      ),
      yield put(getDecisions(payload.project_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting decision!',
        }),
      ),
      yield put({
        type: DELETE_DECISION_FAILURE,
        error,
      }),
    ];
  }
}

function* getStatuses(payload) {
  try {
    let query_params = '';
    if (payload.project_uuid) {
      query_params = `project_uuid=${payload.project_uuid}/`;
    } else if (payload.issue_uuid) {
      query_params = query_params.concat(`issue_uuid=${payload.issue_uuid}`);
    } else if (payload.feature_uuid) {
      query_params = query_params.concat(`feature_uuid=${payload.feature_uuid}`);
    }
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${releaseEndpoint}status/?${query_params}`,
    );
    yield put({ type: GET_STATUSES_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Statuses!',
        }),
      ),
      yield put({
        type: GET_STATUSES_FAILURE,
        error,
      }),
    ];
  }
}

function* addStatus(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${releaseEndpoint}status/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getStatuses(data.data.status_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Status',
          }),
        ),

      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Add Status due to some error!',
        }),
      ),
      yield put({
        type: ADD_STATUS_FAILURE,
        error,
      }),
    ];
  }
}

function* updateStatus(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${releaseEndpoint}status/${payload.status_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getStatuses(payload.status_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Status',
          }),
        ),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Edit Status due to some error!',
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
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${releaseEndpoint}status/${payload.status_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Status deleted successfully!',
        }),
      ),
      yield put(getStatuses(payload.project_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting status!',
        }),
      ),
      yield put({
        type: DELETE_STATUS_FAILURE,
        error,
      }),
    ];
  }
}

function* watchGetFeatures() {
  yield takeLatest(GET_FEATURES, getFeatures);
}

function* watchAddFeature() {
  yield takeLatest(ADD_FEATURE, addFeature);
}

function* watchUpdateFeature() {
  yield takeLatest(UPDATE_FEATURE, updateFeature);
}

function* watchDeleteFeature() {
  yield takeLatest(DELETE_FEATURE, deleteFeature);
}

function* watchGetIssues() {
  yield takeLatest(GET_ISSUES, getIssues);
}

function* watchAddIssue() {
  yield takeLatest(ADD_ISSUE, addIssue);
}

function* watchUpdateIssue() {
  yield takeLatest(UPDATE_ISSUE, updateIssue);
}

function* watchDeleteIssue() {
  yield takeLatest(DELETE_ISSUE, deleteIssue);
}

function* watchGetFeedbacks() {
  yield takeLatest(GET_FEEDBACKS, getFeedbacks);
}

function* watchAddFeedback() {
  yield takeLatest(ADD_FEEDBACK, addFeedback);
}

function* watchUpdateFeedback() {
  yield takeLatest(UPDATE_FEEDBACK, updateFeedback);
}

function* watchDeleteFeedback() {
  yield takeLatest(DELETE_FEEDBACK, deleteFeedback);
}

function* watchGetDecisions() {
  yield takeLatest(GET_DECISIONS, getDecisions);
}

function* watchAddDecision() {
  yield takeLatest(ADD_DECISION, addDecision);
}

function* watchUpdateDecision() {
  yield takeLatest(UPDATE_DECISION, updateDecision);
}

function* watchDeleteDecision() {
  yield takeLatest(DELETE_DECISION, deleteDecision);
}

function* watchGetStatuses() {
  yield takeLatest(GET_STATUSES, getStatuses);
}

function* watchAddStatus() {
  yield takeLatest(ADD_STATUS, addStatus);
}

function* watchUpdateStatus() {
  yield takeLatest(UPDATE_STATUS, updateStatus);
}

function* watchDeleteStatus() {
  yield takeLatest(DELETE_STATUS, deleteStatus);
}

export default function* releaseSaga() {
  yield all([
    watchGetFeatures(),
    watchAddFeature(),
    watchUpdateFeature(),
    watchDeleteFeature(),
    watchGetIssues(),
    watchAddIssue(),
    watchUpdateIssue(),
    watchDeleteIssue(),
    watchGetFeedbacks(),
    watchAddFeedback(),
    watchUpdateFeedback(),
    watchDeleteFeedback(),
    watchGetDecisions(),
    watchAddDecision(),
    watchUpdateDecision(),
    watchDeleteDecision(),
    watchGetStatuses(),
    watchAddStatus(),
    watchUpdateStatus(),
    watchDeleteStatus(),
  ]);
}
