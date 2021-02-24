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
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCTS,
  GET_PRODUCTS_TYPE,
  GET_PRODUCTS_TYPE_SUCCESS,
  GET_PRODUCTS_TYPE_FAILURE,
  ADD_ITEMS_TYPE,
  ADD_ITEMS_TYPE_SUCCESS,
  ADD_ITEMS_TYPE_FAILURE,
  EDIT_ITEMS_TYPE,
  EDIT_ITEMS_TYPE_SUCCESS,
  EDIT_ITEMS_TYPE_FAILURE,
  DELETE_ITEMS_TYPE,
  DELETE_ITEMS_TYPE_SUCCESS,
  DELETE_ITEMS_TYPE_FAILURE,
  ADD_PRODUCTS_TYPE,
  ADD_PRODUCTS_TYPE_SUCCESS,
  ADD_PRODUCTS_TYPE_FAILURE,
  EDIT_PRODUCTS_TYPE,
  EDIT_PRODUCTS_TYPE_SUCCESS,
  EDIT_PRODUCTS_TYPE_FAILURE,
  DELETE_PRODUCTS_TYPE,
  DELETE_PRODUCTS_TYPE_SUCCESS,
  DELETE_PRODUCTS_TYPE_FAILURE,
  ADD_UNITS_OF_MEASURE,
  ADD_UNITS_OF_MEASURE_SUCCESS,
  ADD_UNITS_OF_MEASURE_FAILURE,
  EDIT_UNITS_OF_MEASURE,
  EDIT_UNITS_OF_MEASURE_SUCCESS,
  EDIT_UNITS_OF_MEASURE_FAILURE,
  DELETE_UNITS_OF_MEASURE,
  DELETE_UNITS_OF_MEASURE_SUCCESS,
  DELETE_UNITS_OF_MEASURE_FAILURE,
} from "../actions/items.actions";
import { put, takeLatest, all, call } from "redux-saga/effects";
import { oauthService } from "../../../modules/oauth/oauth.service";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environments/environment";
import { routes } from "../../../routes/routesConstants";
import { showAlert } from "../../alert/actions/alert.actions";
import { searchFilter } from "../../../utils/utilMethods";

const shipmentApiEndPoint = "shipment/";

function* getItemsList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}item/?organization_uuid=${payload.organization_uuid}`,
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

function* getItemType(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}item_type/?organization_uuid=${payload.organization_uuid}`,
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
  let { itemId, organization_uuid } = payload;
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
      yield put(getItems(organization_uuid)),
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
      yield put(getItems(payload.organization_uuid)),
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
      yield put(getItems(payload.organization_uuid)),
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
    let filteredData = searchFilter(payload);
    yield put({ type: SEARCH_SUCCESS, data: filteredData });
  } catch (error) {
    // yield put({ type: UPDATE_USER_FAIL, error: "Updating user fields failed" });
  }
}

function* getProductList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}product/?organization_uuid=${payload.organization_uuid}`,
      null,
      true
    );
    yield [yield put({ type: GET_PRODUCTS_SUCCESS, data: data.data })];
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
        type: GET_PRODUCTS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* getProductTypeList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}product_type/?organization_uuid=${payload.organization_uuid}`,
      null,
      true
    );
    yield [yield put({ type: GET_PRODUCTS_TYPE_SUCCESS, data: data.data })];
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
        type: GET_PRODUCTS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addItemType(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${shipmentApiEndPoint}item_type/`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({ 
          type: ADD_ITEMS_TYPE_SUCCESS,
          itemType: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Added Item Type",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Add Item Type due to some error!",
        })
      ),
      yield put({
        type: ADD_ITEMS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editItemType(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${shipmentApiEndPoint}item_type/${payload.id}`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({ 
          type: EDIT_ITEMS_TYPE_SUCCESS,
          itemType: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Edited Item Type",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Edit Item Type due to some error!",
        })
      ),
      yield put({
        type: EDIT_ITEMS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteItemType(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${shipmentApiEndPoint}item_type/${payload.id}`,
      null,
      true
    );
    yield [
      yield put({ 
        type: DELETE_ITEMS_TYPE_SUCCESS,
        itemType: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Deleted Item Type",
        })
      ),
    ];
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Delete Item Type due to some error!",
        })
      ),
      yield put({
        type: DELETE_ITEMS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addProductType(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${shipmentApiEndPoint}product_type/`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({ 
          type: ADD_PRODUCTS_TYPE_SUCCESS,
          productType: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Added Product Type",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Add Product Type due to some error!",
        })
      ),
      yield put({
        type: ADD_PRODUCTS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editProductType(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${shipmentApiEndPoint}product_type/${payload.id}`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({ 
          type: EDIT_PRODUCTS_TYPE_SUCCESS,
          productType: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Edited Product Type",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Edit Product Type due to some error!",
        })
      ),
      yield put({
        type: EDIT_PRODUCTS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteProductType(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${shipmentApiEndPoint}product_type/${payload.id}`,
      null,
      true
    );
    yield [
      yield put({ 
        type: DELETE_PRODUCTS_TYPE_SUCCESS,
        productType: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Deleted Product Type",
        })
      ),
    ];
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Delete Product Type due to some error!",
        })
      ),
      yield put({
        type: DELETE_PRODUCTS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addUnitsOfMeasure(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${shipmentApiEndPoint}unit_of_measure/`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({ 
          type: ADD_UNITS_OF_MEASURE_SUCCESS,
          unitsOfMeasure: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Added Unit of Measure",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Add Unit of Measure due to some error!",
        })
      ),
      yield put({
        type: ADD_UNITS_OF_MEASURE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editUnitsOfMeasure(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${shipmentApiEndPoint}unit_of_measure/${payload.id}`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({ 
          type: EDIT_UNITS_OF_MEASURE_SUCCESS,
          unitsOfMeasure: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Edited Unit of Measure",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Edit Unit of Measure due to some error!",
        })
      ),
      yield put({
        type: EDIT_UNITS_OF_MEASURE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteUnitsOfMeasure(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${shipmentApiEndPoint}unit_of_measure/${payload.id}`,
      null,
      true
    );
    yield [
      yield put({ 
        type: DELETE_UNITS_OF_MEASURE_SUCCESS,
        unitsOfMeasure: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Deleted Unit of Measure",
        })
      ),
    ];
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Delete Unit of Measure due to some error!",
        })
      ),
      yield put({
        type: DELETE_UNITS_OF_MEASURE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* watchGetProductsList() {
  yield takeLatest(GET_PRODUCTS, getProductList);
}

function* watchGetProductTypeList() {
  yield takeLatest(GET_PRODUCTS_TYPE, getProductTypeList);
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

function* watchAddItemType() {
  yield takeLatest(ADD_ITEMS_TYPE, addItemType);
}

function* watchEditItemType() {
  yield takeLatest(EDIT_ITEMS_TYPE, editItemType);
}

function* watchDeleteItemType() {
  yield takeLatest(DELETE_ITEMS_TYPE, deleteItemType);
}

function* watchAddProductType() {
  yield takeLatest(ADD_PRODUCTS_TYPE, addProductType);
}

function* watchEditProductType() {
  yield takeLatest(EDIT_PRODUCTS_TYPE, editProductType);
}

function* watchDeleteProductType() {
  yield takeLatest(DELETE_PRODUCTS_TYPE, deleteProductType);
}

function* watchAddUnitsOfMeasure() {
  yield takeLatest(ADD_UNITS_OF_MEASURE, addUnitsOfMeasure);
}

function* watchEditUnitsOfMeasure() {
  yield takeLatest(EDIT_UNITS_OF_MEASURE, editUnitsOfMeasure);
}

function* watchDeleteUnitsOfMeasure() {
  yield takeLatest(DELETE_UNITS_OF_MEASURE, deleteUnitsOfMeasure);
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
    watchGetProductsList(),
    watchGetProductTypeList(),
    watchAddItemType(),
    watchEditItemType(),
    watchDeleteItemType(),
    watchAddProductType(),
    watchEditProductType(),
    watchDeleteProductType(),
    watchAddUnitsOfMeasure(),
    watchEditUnitsOfMeasure(),
    watchDeleteUnitsOfMeasure(),
  ]);
}
