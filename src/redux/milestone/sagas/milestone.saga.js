import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';

import {
  CLEAR_MILESTONES,
  CLEAR_MILESTONES_FAIL,
  CLEAR_MILESTONES_SUCCESS,
  CLEAR_MILESTONES_HEADINGS,
  CLEAR_MILESTONES_HEADINGS_FAIL,
  CLEAR_MILESTONES_HEADINGS_SUCCESS,
  CREATE_MILESTONE,
  CREATE_MILESTONE_FAIL,
  CREATE_MILESTONE_SUCCESS,
  DELETE_MILESTONE,
  DELETE_MILESTONE_FAIL,
  DELETE_MILESTONE_SUCCESS,
  GET_MILESTONES,
  GET_MILESTONES_FAIL,
  GET_MILESTONES_SUCCESS,
  GET_REPOSITORIES,
  GET_REPOSITORIES_FAIL,
  GET_REPOSITORIES_SUCCESS,
  UPDATE_MILESTONE,
  UPDATE_MILESTONE_FAIL,
  UPDATE_MILESTONE_SUCCESS,
} from '../actions/milestone.actions';

const headers = {
  Authorization: `token ${window.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
};

function* getRepositories(payload) {
  try {
    const repositories = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.GITHUB_API_URL}/orgs/${payload.data.owner}/repos`,
      {},
      false,
      null,
      null,
      headers,
    );

    yield put({ type: GET_REPOSITORIES_SUCCESS, data: repositories.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all repositories!',
        }),
      ),
      yield put({
        type: GET_REPOSITORIES_FAIL,
        error,
      }),
    ];
  }
}

function* getMilestones(payload) {
  try {
    const { owner, selectedRepositories, milestoneState } = payload.data;
    const data = [];
    for (let i = 0; i < selectedRepositories.length; i += 1) {
      const milestones = yield call(
        httpService.makeRequest,
        'get',
        `${window.env.GITHUB_API_URL}/repos/${owner}/${selectedRepositories[i]}/milestones?state=${milestoneState}`,
        {},
        false,
        null,
        null,
        headers,
      );

      data.push(...milestones.data);
    }

    yield put({ type: GET_MILESTONES_SUCCESS, data: { milestones: data } });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all milestones!',
        }),
      ),
      yield put({
        type: GET_MILESTONES_FAIL,
        error,
      }),
    ];
  }
}

function* clearMilestones() {
  try {
    yield put({ type: CLEAR_MILESTONES_SUCCESS });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t clear milestones!',
        }),
      ),
      yield put({
        type: CLEAR_MILESTONES_FAIL,
        error,
      }),
    ];
  }
}

function* clearMilestonesHeadings() {
  try {
    yield put({ type: CLEAR_MILESTONES_HEADINGS_SUCCESS });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t clear milestone headings!',
        }),
      ),
      yield put({
        type: CLEAR_MILESTONES_HEADINGS_FAIL,
        error,
      }),
    ];
  }
}

function* createMilestone(payload) {
  try {
    const { owner, repositories, data } = payload.data;

    const milestones = [];
    for (let i = 0; i < repositories.length; i += 1) {
      const milestone = yield call(
        httpService.makeRequest,
        'post',
        `${window.env.GITHUB_API_URL}/repos/${owner}/${repositories[i]}/milestones`,
        data,
        false,
        null,
        null,
        headers,
      );

      milestones.push(milestone.data);
    }

    yield [
      yield put({ type: CREATE_MILESTONE_SUCCESS, data: { milestones } }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Milestone created successfully!',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create the milestone!',
        }),
      ),
      yield put({
        type: CREATE_MILESTONE_FAIL,
        error,
      }),
    ];
  }
}

function* deleteMilestone(payload) {
  try {
    const { owner, repository, number, id } = payload.data;

    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.GITHUB_API_URL}/repos/${owner}/${repository}/milestones/${number}`,
      {},
      false,
      null,
      null,
      headers,
    );

    yield [
      yield put({ type: DELETE_MILESTONE_SUCCESS, data: { id } }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Milestone deleted successfully!',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete the milestone!',
        }),
      ),
      yield put({
        type: DELETE_MILESTONE_FAIL,
        error,
      }),
    ];
  }
}

function* updateMilestone(payload) {
  try {
    const {
      owner, repository, data, number,
    } = payload.data;

    const milestone = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.GITHUB_API_URL}/repos/${owner}/${repository}/milestones/${number}`,
      data,
      false,
      null,
      null,
      headers,
    );

    yield [
      yield put({ type: UPDATE_MILESTONE_SUCCESS, data: { milestone } }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Milestone updated successfully!',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update the milestone!',
        }),
      ),
      yield put({
        type: UPDATE_MILESTONE_FAIL,
        error,
      }),
    ];
  }
}

function* watchGetRepositories() {
  yield takeLatest(GET_REPOSITORIES, getRepositories);
}

function* watchGetMilestones() {
  yield takeLatest(GET_MILESTONES, getMilestones);
}

function* watchClearMilestones() {
  yield takeLatest(CLEAR_MILESTONES, clearMilestones);
}

function* watchClearMilestonesHeadings() {
  yield takeLatest(CLEAR_MILESTONES_HEADINGS, clearMilestonesHeadings);
}

function* watchCreateMilestone() {
  yield takeLatest(CREATE_MILESTONE, createMilestone);
}

function* watchDeleteMilestone() {
  yield takeLatest(DELETE_MILESTONE, deleteMilestone);
}

function* watchUpdateMilestone() {
  yield takeLatest(UPDATE_MILESTONE, updateMilestone);
}

export default function* milestoneSaga() {
  yield all([
    watchGetRepositories(),
    watchGetMilestones(),
    watchClearMilestones(),
    watchClearMilestonesHeadings(),
    watchCreateMilestone(),
    watchDeleteMilestone(),
    watchUpdateMilestone(),
  ]);
}
