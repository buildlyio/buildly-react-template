import {
  GET_API_RESPONSE,
  GET_API_RESPONSE_SUCCESS,
  GET_API_RESPONSE_FAILURE,
} from "../actions/importExport.actions";
import { put, takeLatest, all, call } from "redux-saga/effects";
import { httpService } from "../../../modules/http/http.service";
import { showAlert } from "../../alert/actions/alert.actions";

function* getApiResponse(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${payload.url}`,
      null,
      null,
      null,
      null,
      payload.header,
    );
    yield [yield put({ type: GET_API_RESPONSE_SUCCESS, res: data })];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't get api response due to some error!",
        })
      ),
      yield put({
        type: GET_API_RESPONSE_FAILURE,
        error,
      }),
    ];
  }
}

function* watchGetApiResponse() {
  yield takeLatest(GET_API_RESPONSE, getApiResponse);
}

export default function* custodianSaga() {
  yield all([
    watchGetApiResponse(),
  ]);
}
