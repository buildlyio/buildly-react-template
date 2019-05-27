// import {
//   LOAD_DATA_COREUSER,
//   LOAD_DATA_COREUSER_COMMIT, LOAD_DATA_COREUSER_FAIL
// } from './coreuser.actions';
// import { put, takeLatest, all, call } from 'redux-saga/effects';
// import { oauthService } from 'midgard/modules/oauth/oauth.service';
// import { httpService } from 'midgard/modules/http/http.service';
// import { environment } from 'environment';
//
// function* getUser() {
//     try {
//         const data = yield call(httpService.makeRequest, 'get', `${environment.API_URL}coreuser/`);
//         yield [
//             yield put({ type: LOAD_DATA_COREUSER_COMMIT, data })
//         ];
//     } catch(error) {
//         yield put({ type: LOAD_DATA_COREUSER_FAIL, error: 'Could not load users' });
//     }
// }
//
// function* watchGetUser() {
//     yield takeLatest(LOAD_DATA_COREUSER, getUser)
// }
//
//
// export default function* authSaga() {
//   yield all([
//     watchGetUser(),
//   ]);
// }
