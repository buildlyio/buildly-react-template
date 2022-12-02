import _ from 'lodash';
import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
import {
  ALL_RELEASES,
  ALL_RELEASES_SUCCESS,
  ALL_RELEASES_FAILURE,
  ALL_COMMENTS,
  ALL_COMMENTS_SUCCESS,
  ALL_COMMENTS_FAILURE,
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
  GET_RELEASE,
  GET_RELEASE_SUCCESS,
  GET_RELEASE_FAILURE,
  GET_COMMENT,
  GET_COMMENT_SUCCESS,
  GET_COMMENT_FAILURE,
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
  CREATE_RELEASE,
  CREATE_RELEASE_SUCCESS,
  CREATE_RELEASE_FAILURE,
  CREATE_COMMENT,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
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
  UPDATE_RELEASE,
  UPDATE_RELEASE_SUCCESS,
  UPDATE_RELEASE_FAILURE,
  UPDATE_COMMENT,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_COMMENT_FAILURE,
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
  DELETE_RELEASE,
  DELETE_RELEASE_SUCCESS,
  DELETE_RELEASE_FAILURE,
  DELETE_COMMENT,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILURE,
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
  CLEAR_PRODUCT_DATA,
  CLEAR_PRODUCT_DATA_SUCCESS,
  CLEAR_PRODUCT_DATA_FAILURE,
  THIRD_PARTY_TOOL_SYNC,
  THIRD_PARTY_TOOL_SYNC_SUCCESS,
  THIRD_PARTY_TOOL_SYNC_FAILURE,
} from '../actions/release.actions';
import {
  deleteProduct, getProduct,
} from '../../product/actions/product.actions';

function* allReleases(payload) {
  try {
    const releases = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}release/release/`,
    );
    yield put({ type: ALL_RELEASES_SUCCESS, data: releases.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Releases!',
        }),
      ),
      yield put({
        type: ALL_RELEASES_FAILURE,
        error,
      }),
    ];
  }
}

function* getRelease(payload) {
  try {
    const release = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}release/release/${payload.release_uuid}/`,
    );
    yield put({ type: GET_RELEASE_SUCCESS, data: release.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Release!',
        }),
      ),
      yield put({
        type: GET_RELEASE_FAILURE,
        error,
      }),
    ];
  }
}

function* createRelease(payload) {
  try {
    const release = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}release/release/`,
      payload.data,
    );
    yield put({ type: CREATE_RELEASE_SUCCESS, data: release.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Release!',
        }),
      ),
      yield put({
        type: CREATE_RELEASE_FAILURE,
        error,
      }),
    ];
  }
}

function* updateRelease(payload) {
  try {
    const release = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}release/release/${payload.data.release_uuid}/`,
      payload.data,
    );
    yield put({ type: UPDATE_RELEASE_SUCCESS, data: release.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Release!',
        }),
      ),
      yield put({
        type: UPDATE_RELEASE_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteRelease(payload) {
  const { release_uuid } = payload;
  try {
    const release = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}release/release/${release_uuid}/`,
    );
    yield put({ type: DELETE_RELEASE_SUCCESS, release_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Release!',
        }),
      ),
      yield put({
        type: DELETE_RELEASE_FAILURE,
        error,
      }),
    ];
  }
}

function* allComments(payload) {
  try {
    const comments = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}release/comment/?${payload.searchQuery}`,
    );
    yield put({ type: ALL_COMMENTS_SUCCESS, data: comments.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Comments!',
        }),
      ),
      yield put({
        type: ALL_COMMENTS_FAILURE,
        error,
      }),
    ];
  }
}

function* getComment(payload) {
  try {
    const comment = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}release/comment/${payload.comment_uuid}/`,
    );
    yield put({ type: GET_COMMENT_SUCCESS, data: comment.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Comment!',
        }),
      ),
      yield put({
        type: GET_COMMENT_FAILURE,
        error,
      }),
    ];
  }
}

function* createComment(payload) {
  try {
    const comment = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}release/comment/`,
      payload.data,
    );
    yield [
      yield put({ type: CREATE_COMMENT_SUCCESS, data: comment.data }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Succesfully commented on the feature/issue',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Comment!',
        }),
      ),
      yield put({
        type: CREATE_COMMENT_FAILURE,
        error,
      }),
    ];
  }
}

function* updateComment(payload) {
  try {
    const comment = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}release/comment/${payload.data.comment_uuid}/`,
      payload.data,
    );
    yield put({ type: UPDATE_COMMENT_SUCCESS, data: comment.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Comment!',
        }),
      ),
      yield put({
        type: UPDATE_COMMENT_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteComment(payload) {
  const { comment_uuid } = payload;
  try {
    const comment = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}release/comment/${comment_uuid}/`,
    );
    yield put({ type: DELETE_COMMENT_SUCCESS, comment_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Comment!',
        }),
      ),
      yield put({
        type: DELETE_COMMENT_FAILURE,
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
      `${window.env.API_URL}release/feature/?product_uuid=${payload.product_uuid}`,
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
      `${window.env.API_URL}release/feature/${payload.feature_uuid}/`,
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
      `${window.env.API_URL}release/feature/`,
      payload.data,
    );
    yield [
      yield put({ type: CREATE_FEATURE_SUCCESS, data: feature.data }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Created feature successfully',
        }),
      ),
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
      `${window.env.API_URL}release/feature/${payload.data.feature_uuid}/`,
      payload.data,
    );
    yield [
      yield put({ type: UPDATE_FEATURE_SUCCESS, data: feature.data }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Updated feature successfully',
        }),
      ),
    ];
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
      `${window.env.API_URL}release/feature/${feature_uuid}/`,
      payload.data,
    );
    yield [
      yield put({ type: DELETE_FEATURE_SUCCESS, feature_uuid }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Deleted feature successfully',
        }),
      ),
    ];
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
      `${window.env.API_URL}release/feedback/`,
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
      `${window.env.API_URL}release/feedback/${payload.feedback_uuid}/`,
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
      `${window.env.API_URL}release/feedback/`,
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
      `${window.env.API_URL}release/feedback/${payload.data.feedback_uuid}/`,
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
      `${window.env.API_URL}release/feedback/${feedback_uuid}/`,
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
      `${window.env.API_URL}release/issue/?product_uuid=${payload.product_uuid}`,
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
      `${window.env.API_URL}release/issue/${payload.issue_uuid}/`,
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
  const { data } = payload;
  try {
    if (_.size(data) > 1) {
      const issues = yield all(_.map(data, (issue_data) => (
        call(
          httpService.makeRequest,
          'post',
          `${window.env.API_URL}release/issue/`,
          issue_data,
        )
      )));
      yield put({ type: CREATE_ISSUE_SUCCESS, data: _.flatMap(_.map(issues, 'data')) });
    } else {
      const issue = yield call(
        httpService.makeRequest,
        'post',
        `${window.env.API_URL}release/issue/`,
        payload.data,
      );
      yield [
        yield put({ type: CREATE_ISSUE_SUCCESS, data: issue.data }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Created Issue successfully',
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
      `${window.env.API_URL}release/issue/${payload.data.issue_uuid}/`,
      payload.data,
    );
    yield [
      yield put({ type: UPDATE_ISSUE_SUCCESS, data: issue.data }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Updated Issue successfully',
        }),
      ),
    ];
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
      `${window.env.API_URL}release/issue/${issue_uuid}/`,
      payload.data,
    );
    yield [
      yield put({ type: DELETE_ISSUE_SUCCESS, issue_uuid }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Deleted Issue successfully',
        }),
      ),
    ];
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
      `${window.env.API_URL}release/status/?product_uuid=${payload.product_uuid}`,
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
      `${window.env.API_URL}release/status/${payload.status_uuid}/`,
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
  const { data } = payload;
  try {
    const { product_uuid } = data[0];
    if (_.size(data) > 1) {
      const statuses = yield all(_.map(data, (status_data) => (
        call(
          httpService.makeRequest,
          'post',
          `${window.env.API_URL}release/status/`,
          status_data,
        )
      )));
      yield put({ type: CREATE_STATUS_SUCCESS, data: _.flatMap(_.map(statuses, 'data')) });
    } else {
      const status = yield call(
        httpService.makeRequest,
        'post',
        `${window.env.API_URL}release/status/`,
        data,
      );
      yield put({ type: CREATE_STATUS_SUCCESS, data: status.data });
    }
    yield put(getProduct(product_uuid));
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
      `${window.env.API_URL}release/status/${payload.data.status_uuid}/`,
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
      `${window.env.API_URL}release/status/${status_uuid}/`,
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

function* clearProductData(payload) {
  try {
    const product = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}release/clear-product-data/`,
      payload.data,
    );
    yield put({ type: CLEAR_PRODUCT_DATA_SUCCESS, data: payload.data });
    yield put(deleteProduct(payload.data.product_uuid));
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

function* thirdPartyToolSync(payload) {
  const { creds } = payload;
  try {
    const toolSyncResponse = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}release/third_party_tool_sync/`,
      creds,
    );
    if (toolSyncResponse && toolSyncResponse.data) {
      let status = true;
      _.forEach(toolSyncResponse.data, (tool) => {
        status = status && !_.isEmpty(tool) && _.isEmpty(tool.details);
      });

      if (status) {
        yield [
          yield put({ type: THIRD_PARTY_TOOL_SYNC_SUCCESS }),
          yield put(
            showAlert({
              type: 'success',
              open: true,
              message: 'Third party tool(s) data synced successfully',
            }),
          ),
        ];
      } else {
        yield [
          yield put({
            type: THIRD_PARTY_TOOL_SYNC_FAILURE,
            error: 'Couldn\'t sync third party tool(s) data!',
          }),
          yield put(
            showAlert({
              type: 'success',
              open: true,
              message: 'Couldn\'t sync third party tool(s) data!',
            }),
          ),
        ];
      }
    }
  } catch (error) {
    yield [
      yield put({
        type: THIRD_PARTY_TOOL_SYNC_FAILURE,
        error,
      }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t sync third party tool(s) data!',
        }),
      ),
    ];
  }
}

// Watchers
function* watchGetAllReleases() {
  yield takeLatest(ALL_RELEASES, allReleases);
}

function* watchGetRelease() {
  yield takeLatest(GET_RELEASE, getRelease);
}

function* watchCreateRelease() {
  yield takeLatest(CREATE_RELEASE, createRelease);
}

function* watchUpdateRelease() {
  yield takeLatest(UPDATE_RELEASE, updateRelease);
}

function* watchDeleteRelease() {
  yield takeLatest(DELETE_RELEASE, deleteRelease);
}

function* watchGetAllComments() {
  yield takeLatest(ALL_COMMENTS, allComments);
}

function* watchGetComment() {
  yield takeLatest(GET_COMMENT, getComment);
}

function* watchCreateComment() {
  yield takeLatest(CREATE_COMMENT, createComment);
}

function* watchUpdateComment() {
  yield takeLatest(UPDATE_COMMENT, updateComment);
}

function* watchDeleteComment() {
  yield takeLatest(DELETE_COMMENT, deleteComment);
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

function* watchClearProductData() {
  yield takeLatest(CLEAR_PRODUCT_DATA, clearProductData);
}

function* watchThirdPartyToolSync() {
  yield takeLatest(THIRD_PARTY_TOOL_SYNC, thirdPartyToolSync);
}

export default function* releaseSaga() {
  yield all([
    watchGetAllReleases(),
    watchGetAllComments(),
    watchGetAllFeatures(),
    watchGetAllFeedbacks(),
    watchGetAllIssues(),
    watchGetAllStatuses(),
    watchGetRelease(),
    watchGetComment(),
    watchGetFeature(),
    watchGetFeedback(),
    watchGetIssue(),
    watchGetStatus(),
    watchCreateRelease(),
    watchCreateComment(),
    watchCreateFeature(),
    watchCreateFeedback(),
    watchCreateIssue(),
    watchCreateStatus(),
    watchUpdateRelease(),
    watchUpdateComment(),
    watchUpdateFeature(),
    watchUpdateFeedback(),
    watchUpdateIssue(),
    watchUpdateStatus(),
    watchDeleteRelease(),
    watchDeleteComment(),
    watchDeleteFeature(),
    watchDeleteFeedback(),
    watchDeleteIssue(),
    watchDeleteStatus(),
    watchClearProductData(),
    watchThirdPartyToolSync(),
  ]);
}
