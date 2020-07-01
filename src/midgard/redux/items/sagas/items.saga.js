import {
  getItems,
  GET_ITEMS,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAILURE,
  ADD_ITEMS,
  ADD_ITEMS_SUCCESS,
  ADD_ITEMS_FAILURE,
  EDIT_ITEMS,
  EDIT_ITEMS_SUCCESS,
  EDIT_ITEMS_FAILURE,
  DELETE_ITEMS,
  DELETE_ITEMS_SUCCESS,
  GET_ITEMS_TYPE,
  GET_ITEMS_TYPE_SUCCESS,
  GET_ITEMS_TYPE_FAILURE,
  DELETE_ITEMS_FAILURE,
  SEARCH_SUCCESS,
  SEARCH,
  GET_UNITS_OF_MEASURE,
  GET_UNITS_OF_MEASURE_FAILURE,
  GET_UNITS_OF_MEASURE_SUCCESS,
} from "../actions/items.actions";
import { put, takeLatest, all, call } from "redux-saga/effects";
import { oauthService } from "../../../modules/oauth/oauth.service";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environment";
import { routes } from "../../../routes/routesConstants";
import { showAlert } from "../../alert/actions/alert.actions";

const shipmentApiEndPoint = "shipment/";

function* getItemsList() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}item/`,
      null,
      true
    );
    yield [yield put({ type: GET_ITEMS_SUCCESS, data: data.data })];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't load data due to some error!",
        })
      ),
      yield put({
        type: GET_ITEMS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* getItemType() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}item_type/`,
      null,
      true
    );
    yield [
      yield put({
        type: GET_ITEMS_TYPE_SUCCESS,
        data: data.data,
      }),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't load data due to some error!",
        })
      ),
      yield put({
        type: GET_ITEMS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteItem(payload) {
  let { itemId } = payload;
  try {
    yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${shipmentApiEndPoint}item/${itemId}/`,
      null,
      true
    );
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Item deleted successfully!",
        })
      ),
      yield put(getItems()),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in deleting Item!",
        })
      ),
      yield put({
        type: DELETE_ITEMS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editItem(action) {
  let { payload, history, redirectTo } = action;
  try {
    let data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${shipmentApiEndPoint}item/${payload.id}/`,
      payload,
      true
    );
    yield [
      yield put(getItems()),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Item successfully Edited!",
        })
      ),
      yield call(history.push, redirectTo),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't edit Item!",
        })
      ),
      yield put({
        type: EDIT_ITEMS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addItem(action) {
  let { history, payload, redirectTo } = action;
  try {
    let data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${shipmentApiEndPoint}item/`,
      payload,
      true
    );
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Added Item",
        })
      ),
      yield put(getItems()),
      yield call(history.push, redirectTo),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in creating Item",
        })
      ),
      yield put({
        type: ADD_ITEMS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* getUnits() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}unit_of_measure/`,
      null,
      true
    );
    yield [
      yield put({
        type: GET_UNITS_OF_MEASURE_SUCCESS,
        data: data.data,
      }),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't load data due to some error!",
        })
      ),
      yield put({
        type: GET_UNITS_OF_MEASURE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* searchItem(payload) {
  try {
    if (!payload.searchItem) {
      yield put({ type: SEARCH_SUCCESS, data: [] });
    } else {
      let data = payload.searchList.filter((item) => {
        return (
          item.name.includes(payload.searchItem.trim()) ||
          item.id.toString().includes(payload.searchItem)
        );
      });
      yield put({ type: SEARCH_SUCCESS, data });
    }
  } catch (error) {
    // yield put({ type: UPDATE_USER_FAIL, error: "Updating user fields failed" });
  }
}

function* watchGetItem() {
  yield takeLatest(GET_ITEMS, getItemsList);
}

function* watchSearchItem() {
  yield takeLatest(SEARCH, searchItem);
}

function* watchGetItemType() {
  yield takeLatest(GET_ITEMS_TYPE, getItemType);
}

function* watchAddItem() {
  yield takeLatest(ADD_ITEMS, addItem);
}

function* watchDeleteItem() {
  yield takeLatest(DELETE_ITEMS, deleteItem);
}

function* watchEditItem() {
  yield takeLatest(EDIT_ITEMS, editItem);
}

function* watchGetUnitsOfMeasure() {
  yield takeLatest(GET_UNITS_OF_MEASURE, getUnits);
}

export default function* itemSaga() {
  yield all([
    watchSearchItem(),
    watchGetItem(),
    watchGetItemType(),
    watchAddItem(),
    watchDeleteItem(),
    watchEditItem(),
    watchGetUnitsOfMeasure(),
  ]);
}
