import {
  GET_API_RESPONSE,
  GET_API_RESPONSE_SUCCESS,
  GET_API_RESPONSE_FAILURE,
  GET_EXPORT_DATA,
  GET_EXPORT_DATA_SUCCESS,
  GET_EXPORT_DATA_FAILURE,
} from "../actions/importExport.actions";
import { put, takeLatest, all, call } from "redux-saga/effects";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environments/environment";
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

function* getExportData(payload) {
  let endPoint;
  switch (payload.model) {
    case "item":
    case "product":
      endPoint = "shipment/file_export/"
  }

  try {
    const response = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${endPoint}?model=${payload.model}&file_type=${payload.fileType}`,
    );
    yield [yield put({ type: GET_EXPORT_DATA_SUCCESS, data: response.data })];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't export data due to some error!",
        })
      ),
      yield put({
        type: GET_EXPORT_DATA_FAILURE,
        error,
      }),
    ];
  }
}

function* watchGetApiResponse() {
  yield takeLatest(GET_API_RESPONSE, getApiResponse);
}

function* watchGetExportData() {
  yield takeLatest(GET_EXPORT_DATA, getExportData);
}

export default function* importExportSaga() {
  yield all([
    watchGetApiResponse(),
    watchGetExportData(),
  ]);
}
