import { all, call, put, takeLatest, } from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';

import {
	GET_MILESTONES,
	GET_MILESTONES_FAIL,
	GET_MILESTONES_SUCCESS,
	GET_REPOSITORIES,
	GET_REPOSITORIES_FAIL,
	GET_REPOSITORIES_SUCCESS,
	CLEAR_MILESTONES,
	CLEAR_MILESTONES_SUCCESS,
	CLEAR_MILESTONES_FAIL,
	CLEAR_MILESTONES_HEADINGS,
	CLEAR_MILESTONES_HEADINGS_SUCCESS,
	CLEAR_MILESTONES_HEADINGS_FAIL
} from '../actions/milestone.actions';

function* getRepositories(payload) {
	try {
		const repositories = yield call(
			httpService.makeRequest,
			'get',
			`${ window.env.GITHUB_API_URL }/orgs/${ payload.data.owner }/repos`,
			{},
			false,
			null,
			null,
			true
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
		for(let i = 0; i < selectedRepositories.length; i++) {
			const milestones = yield call(
				httpService.makeRequest,
				'get',
				`${ window.env.GITHUB_API_URL }/repos/${ owner }/${ selectedRepositories[i] }/milestones?state=${ milestoneState }`,
				{},
				false,
				null,
				null,
				true
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

export default function* milestoneSaga() {
	yield all([watchGetRepositories(), watchGetMilestones(), watchClearMilestones(), watchClearMilestonesHeadings()]);
}