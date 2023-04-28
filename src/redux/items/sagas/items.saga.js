import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
import {
  getItems,
  GET_ITEMS,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAILURE,
  ADD_ITEMS,
  ADD_ITEMS_FAILURE,
  EDIT_ITEMS,
  EDIT_ITEMS_FAILURE,
  DELETE_ITEMS,
  DELETE_ITEMS_FAILURE,
  GET_ITEMS_TYPE,
  GET_ITEMS_TYPE_SUCCESS,
  GET_ITEMS_TYPE_FAILURE,
  ADD_ITEMS_TYPE,
  ADD_ITEMS_TYPE_SUCCESS,
  ADD_ITEMS_TYPE_FAILURE,
  EDIT_ITEMS_TYPE,
  EDIT_ITEMS_TYPE_SUCCESS,
  EDIT_ITEMS_TYPE_FAILURE,
  DELETE_ITEMS_TYPE,
  DELETE_ITEMS_TYPE_SUCCESS,
  DELETE_ITEMS_TYPE_FAILURE,
  GET_PRODUCTS,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  ADD_PRODUCTS,
  ADD_PRODUCTS_SUCCESS,
  ADD_PRODUCTS_FAILURE,
  EDIT_PRODUCTS,
  EDIT_PRODUCTS_SUCCESS,
  EDIT_PRODUCTS_FAILURE,
  DELETE_PRODUCTS,
  DELETE_PRODUCTS_SUCCESS,
  DELETE_PRODUCTS_FAILURE,
  GET_PRODUCTS_TYPE,
  GET_PRODUCTS_TYPE_SUCCESS,
  GET_PRODUCTS_TYPE_FAILURE,
  ADD_PRODUCTS_TYPE,
  ADD_PRODUCTS_TYPE_SUCCESS,
  ADD_PRODUCTS_TYPE_FAILURE,
  EDIT_PRODUCTS_TYPE,
  EDIT_PRODUCTS_TYPE_SUCCESS,
  EDIT_PRODUCTS_TYPE_FAILURE,
  DELETE_PRODUCTS_TYPE,
  DELETE_PRODUCTS_TYPE_SUCCESS,
  DELETE_PRODUCTS_TYPE_FAILURE,
  GET_UNIT_OF_MEASURE,
  GET_UNIT_OF_MEASURE_SUCCESS,
  GET_UNIT_OF_MEASURE_FAILURE,
  ADD_UNIT_OF_MEASURE,
  ADD_UNIT_OF_MEASURE_SUCCESS,
  ADD_UNIT_OF_MEASURE_FAILURE,
  EDIT_UNIT_OF_MEASURE,
  EDIT_UNIT_OF_MEASURE_SUCCESS,
  EDIT_UNIT_OF_MEASURE_FAILURE,
  DELETE_UNIT_OF_MEASURE,
  DELETE_UNIT_OF_MEASURE_SUCCESS,
  DELETE_UNIT_OF_MEASURE_FAILURE,
  CREATE_DEFAULT_UNITS,
  CREATE_DEFAULT_UNITS_FAILURE,
} from '../actions/items.actions';

const shipmentApiEndPoint = 'shipment/';

function* getItemsList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${shipmentApiEndPoint}item/?organization_uuid=${payload.organization_uuid}`,
    );
    yield put({ type: GET_ITEMS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load data due to some error!',
        }),
      ),
      yield put({
        type: GET_ITEMS_FAILURE,
        error,
      }),
    ];
  }
}

function* addItem(action) {
  const { history, payload, redirectTo } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${shipmentApiEndPoint}item/`,
      payload,
    );
    yield [
      yield put(getItems(payload.organization_uuid)),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully Added Item',
        }),
      ),
    ];
    if (history && redirectTo) {
      yield call(history.push, redirectTo);
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in creating Item',
        }),
      ),
      yield put({
        type: ADD_ITEMS_FAILURE,
        error,
      }),
    ];
  }
}

function* editItem(action) {
  const { payload, history, redirectTo } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${shipmentApiEndPoint}item/${payload.id}/`,
      payload,
    );
    yield [
      yield put(getItems(payload.organization_uuid)),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Item successfully Edited!',
        }),
      ),
    ];
    if (history && redirectTo) {
      yield call(history.push, redirectTo);
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t edit Item!',
        }),
      ),
      yield put({
        type: EDIT_ITEMS_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteItem(payload) {
  const { itemId, organization_uuid } = payload;
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${shipmentApiEndPoint}item/${itemId}/`,
    );
    yield [
      yield put(getItems(organization_uuid)),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Item deleted successfully!',
        }),
      ),

    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting Item!',
        }),
      ),
      yield put({
        type: DELETE_ITEMS_FAILURE,
        error,
      }),
    ];
  }
}

function* getItemType(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${shipmentApiEndPoint}item_type/?organization_uuid=${payload.organization_uuid}`,
    );
    yield put({
      type: GET_ITEMS_TYPE_SUCCESS,
      data: data.data,
    });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load data due to some error!',
        }),
      ),
      yield put({
        type: GET_ITEMS_TYPE_FAILURE,
        error,
      }),
    ];
  }
}

function* addItemType(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${shipmentApiEndPoint}item_type/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: ADD_ITEMS_TYPE_SUCCESS,
          itemType: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Item Type',
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
          message: 'Couldn\'t Add Item Type due to some error!',
        }),
      ),
      yield put({
        type: ADD_ITEMS_TYPE_FAILURE,
        error,
      }),
    ];
  }
}

function* editItemType(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${shipmentApiEndPoint}item_type/${payload.id}`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: EDIT_ITEMS_TYPE_SUCCESS,
          itemType: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Item Type',
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
          message: 'Couldn\'t Edit Item Type due to some error!',
        }),
      ),
      yield put({
        type: EDIT_ITEMS_TYPE_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteItemType(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${shipmentApiEndPoint}item_type/${payload.id}`,
    );
    yield [
      yield put({
        type: DELETE_ITEMS_TYPE_SUCCESS,
        itemType: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully Deleted Item Type',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Delete Item Type due to some error!',
        }),
      ),
      yield put({
        type: DELETE_ITEMS_TYPE_FAILURE,
        error,
      }),
    ];
  }
}

function* getProductList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${shipmentApiEndPoint}product/?organization_uuid=${payload.organization_uuid}`,
    );
    yield put({ type: GET_PRODUCTS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load data due to some error!',
        }),
      ),
      yield put({
        type: GET_PRODUCTS_FAILURE,
        error,
      }),
    ];
  }
}

function* addProducts(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${shipmentApiEndPoint}product/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: ADD_PRODUCTS_SUCCESS,
          product: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Product',
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
          message: 'Couldn\'t Add Product due to some error!',
        }),
      ),
      yield put({
        type: ADD_PRODUCTS_FAILURE,
        error,
      }),
    ];
  }
}

function* editProducts(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${shipmentApiEndPoint}product/${payload.id}`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: EDIT_PRODUCTS_SUCCESS,
          product: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Product',
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
          message: 'Couldn\'t Edit Product due to some error!',
        }),
      ),
      yield put({
        type: EDIT_PRODUCTS_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteProducts(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${shipmentApiEndPoint}product/${payload.id}`,
    );
    yield [
      yield put({
        type: DELETE_PRODUCTS_SUCCESS,
        product: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully Deleted Product',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Delete Product due to some error!',
        }),
      ),
      yield put({
        type: DELETE_PRODUCTS_FAILURE,
        error,
      }),
    ];
  }
}

function* getProductTypeList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${shipmentApiEndPoint}product_type/?organization_uuid=${payload.organization_uuid}`,
    );
    yield put({ type: GET_PRODUCTS_TYPE_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load data due to some error!',
        }),
      ),
      yield put({
        type: GET_PRODUCTS_TYPE_FAILURE,
        error,
      }),
    ];
  }
}

function* addProductType(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${shipmentApiEndPoint}product_type/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: ADD_PRODUCTS_TYPE_SUCCESS,
          productType: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Product Type',
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
          message: 'Couldn\'t Add Product Type due to some error!',
        }),
      ),
      yield put({
        type: ADD_PRODUCTS_TYPE_FAILURE,
        error,
      }),
    ];
  }
}

function* editProductType(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${shipmentApiEndPoint}product_type/${payload.id}`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: EDIT_PRODUCTS_TYPE_SUCCESS,
          productType: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Product Type',
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
          message: 'Couldn\'t Edit Product Type due to some error!',
        }),
      ),
      yield put({
        type: EDIT_PRODUCTS_TYPE_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteProductType(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${shipmentApiEndPoint}product_type/${payload.id}`,
    );
    yield [
      yield put({
        type: DELETE_PRODUCTS_TYPE_SUCCESS,
        productType: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully Deleted Product Type',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Delete Product Type due to some error!',
        }),
      ),
      yield put({
        type: DELETE_PRODUCTS_TYPE_FAILURE,
        error,
      }),
    ];
  }
}

function* getUnit(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${shipmentApiEndPoint}unit_of_measure/?organization_uuid=${payload.organization_uuid}`,
    );
    yield put({
      type: GET_UNIT_OF_MEASURE_SUCCESS,
      data: data.data,
    });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load data due to some error!',
        }),
      ),
      yield put({
        type: GET_UNIT_OF_MEASURE_FAILURE,
        error,
      }),
    ];
  }
}

function* addUnitOfMeasure(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${shipmentApiEndPoint}unit_of_measure/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: ADD_UNIT_OF_MEASURE_SUCCESS,
          unitOfMeasure: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Unit of Measure',
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
          message: 'Couldn\'t Add Unit of Measure due to some error!',
        }),
      ),
      yield put({
        type: ADD_UNIT_OF_MEASURE_FAILURE,
        error,
      }),
    ];
  }
}

function* editUnitOfMeasure(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${shipmentApiEndPoint}unit_of_measure/${payload.id}`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: EDIT_UNIT_OF_MEASURE_SUCCESS,
          unitOfMeasure: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Unit of Measure',
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
          message: 'Couldn\'t Edit Unit of Measure due to some error!',
        }),
      ),
      yield put({
        type: EDIT_UNIT_OF_MEASURE_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteUnitOfMeasure(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${shipmentApiEndPoint}unit_of_measure/${payload.id}`,
    );
    yield [
      yield put({
        type: DELETE_UNIT_OF_MEASURE_SUCCESS,
        unitOfMeasure: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully Deleted Unit of Measure',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Delete Unit of Measure due to some error!',
        }),
      ),
      yield put({
        type: DELETE_UNIT_OF_MEASURE_FAILURE,
        error,
      }),
    ];
  }
}

function* createDefaultUnits(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${shipmentApiEndPoint}create_default_unit_of_measures/`,
      { organization: payload.organization },
    );
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Create Default Unit of Measures due to some error!',
        }),
      ),
      yield put({
        type: CREATE_DEFAULT_UNITS_FAILURE,
        error,
      }),
    ];
  }
}

function* watchGetItem() {
  yield takeLatest(GET_ITEMS, getItemsList);
}

function* watchAddItem() {
  yield takeLatest(ADD_ITEMS, addItem);
}

function* watchEditItem() {
  yield takeLatest(EDIT_ITEMS, editItem);
}

function* watchDeleteItem() {
  yield takeLatest(DELETE_ITEMS, deleteItem);
}

function* watchGetItemType() {
  yield takeLatest(GET_ITEMS_TYPE, getItemType);
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

function* watchGetProductsList() {
  yield takeLatest(GET_PRODUCTS, getProductList);
}

function* watchAddProducts() {
  yield takeLatest(ADD_PRODUCTS, addProducts);
}

function* watchEditProducts() {
  yield takeLatest(EDIT_PRODUCTS, editProducts);
}

function* watchDeleteProducts() {
  yield takeLatest(DELETE_PRODUCTS, deleteProducts);
}

function* watchGetProductTypeList() {
  yield takeLatest(GET_PRODUCTS_TYPE, getProductTypeList);
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

function* watchGetUnitOfMeasure() {
  yield takeLatest(GET_UNIT_OF_MEASURE, getUnit);
}

function* watchAddUnitOfMeasure() {
  yield takeLatest(ADD_UNIT_OF_MEASURE, addUnitOfMeasure);
}

function* watchEditUnitOfMeasure() {
  yield takeLatest(EDIT_UNIT_OF_MEASURE, editUnitOfMeasure);
}

function* watchDeleteUnitOfMeasure() {
  yield takeLatest(DELETE_UNIT_OF_MEASURE, deleteUnitOfMeasure);
}

function* watchCreateDefaultUnits() {
  yield takeLatest(CREATE_DEFAULT_UNITS, createDefaultUnits);
}

export default function* itemSaga() {
  yield all([
    watchGetItem(),
    watchAddItem(),
    watchEditItem(),
    watchDeleteItem(),
    watchGetItemType(),
    watchAddItemType(),
    watchEditItemType(),
    watchDeleteItemType(),
    watchGetProductsList(),
    watchAddProducts(),
    watchEditProducts(),
    watchDeleteProducts(),
    watchGetProductTypeList(),
    watchAddProductType(),
    watchEditProductType(),
    watchDeleteProductType(),
    watchGetUnitOfMeasure(),
    watchAddUnitOfMeasure(),
    watchEditUnitOfMeasure(),
    watchDeleteUnitOfMeasure(),
    watchCreateDefaultUnits(),
  ]);
}
