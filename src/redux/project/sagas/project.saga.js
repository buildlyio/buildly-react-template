import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
import {
  GET_PRODUCTTEAMS,
  GET_PRODUCTTEAMS_SUCCESS,
  GET_PRODUCTTEAMS_FAILURE,
  ADD_PRODUCTTEAM,
  ADD_PRODUCTTEAM_FAILURE,
  UPDATE_PRODUCTTEAM,
  UPDATE_PRODUCTTEAM_FAILURE,
  DELETE_PRODUCTTEAM,
  DELETE_PRODUCTTEAM_FAILURE,
  GET_PRODUCTS,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  ADD_PRODUCT,
  ADD_PRODUCT_FAILURE,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT,
  DELETE_PRODUCT_FAILURE,
  GET_THIRDPARTYTOOLS,
  GET_THIRDPARTYTOOLS_SUCCESS,
  GET_THIRDPARTYTOOLS_FAILURE,
  ADD_THIRDPARTYTOOL,
  ADD_THIRDPARTYTOOL_FAILURE,
  UPDATE_THIRDPARTYTOOL,
  UPDATE_THIRDPARTYTOOL_FAILURE,
  DELETE_THIRDPARTYTOOL,
  DELETE_THIRDPARTYTOOL_FAILURE,
  GET_CREDENTIALS,
  GET_CREDENTIALS_SUCCESS,
  GET_CREDENTIALS_FAILURE,
  ADD_CREDENTIAL,
  ADD_CREDENTIAL_FAILURE,
  UPDATE_CREDENTIAL,
  UPDATE_CREDENTIAL_FAILURE,
  DELETE_CREDENTIAL,
  DELETE_CREDENTIAL_FAILURE,
  GET_RELEASES,
  GET_RELEASES_SUCCESS,
  GET_RELEASES_FAILURE,
  ADD_RELEASE,
  ADD_RELEASE_SUCCESS,
  ADD_RELEASE_FAILURE,
  UPDATE_RELEASE,
  UPDATE_RELEASE_SUCCESS,
  UPDATE_RELEASE_FAILURE,
  DELETE_RELEASE,
  DELETE_RELEASE_SUCCESS,
  DELETE_RELEASE_FAILURE,
} from '../actions/project.actions';

const projecttoolEndpoint = 'projecttool/';

function* getProductteams(payload) {
  try {
    let query_params = '';
    if (payload.organization_uuid) {
      query_params = `organization_uuid=${payload.organization_uuid}/`;
    } else if (payload.product_team_uuid) {
      query_params = query_params.concat(`product_team_uuid=${payload.product_team_uuid}`);
    }
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${projecttoolEndpoint}productteam/?${query_params}`,
    );
    yield put({ type: GET_PRODUCTTEAMS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Product Teams!',
        }),
      ),
      yield put({
        type: GET_PRODUCTTEAMS_FAILURE,
        error,
      }),
    ];
  }
}

function* addProductteam(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${projecttoolEndpoint}productteam/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getProductteams(data.data.product_team_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Product Team',
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
          message: 'Couldn\'t Add Product Team due to some error!',
        }),
      ),
      yield put({
        type: ADD_PRODUCTTEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* updateProductteam(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${projecttoolEndpoint}productteam/${payload.product_team_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getProductteams(payload.product_team_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Product Team',
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
          message: 'Couldn\'t Edit Product_team due to some error!',
        }),
      ),
      yield put({
        type: UPDATE_PRODUCTTEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteProductteam(payload) {
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${projecttoolEndpoint}productteam/${payload.product_team_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Product Team deleted successfully!',
        }),
      ),
      yield put(getProductteams(payload.organization_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting product team!',
        }),
      ),
      yield put({
        type: DELETE_PRODUCTTEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* getProducts(payload) {
  try {
    let query_params = '';
    if (payload.organization_uuid) {
      query_params = `organization_uuid=${payload.organization_uuid}/`;
    } else if (payload.project_uuid) {
      query_params = query_params.concat(`project_uuid=${payload.project_uuid}`);
    }
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${projecttoolEndpoint}product/?${query_params}`,
    );
    yield put({ type: GET_PRODUCTS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Products!',
        }),
      ),
      yield put({
        type: GET_PRODUCTS_FAILURE,
        error,
      }),
    ];
  }
}

function* addProduct(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${projecttoolEndpoint}product/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getProducts(data.data.product_uuid)),
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
        type: ADD_PRODUCT_FAILURE,
        error,
      }),
    ];
  }
}

function* updateProduct(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${projecttoolEndpoint}product/${payload.product_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getProducts(payload.product_uuid)),
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
        type: UPDATE_PRODUCT_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteProduct(payload) {
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${projecttoolEndpoint}product/${payload.product_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Product deleted successfully!',
        }),
      ),
      yield put(getProducts(payload.project_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting product!',
        }),
      ),
      yield put({
        type: DELETE_PRODUCT_FAILURE,
        error,
      }),
    ];
  }
}

function* getThirdpartytools(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${projecttoolEndpoint}thirdpartytool/?project_uuid=${payload.project_uuid}`,
    );
    yield put({ type: GET_THIRDPARTYTOOLS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Thirdpartytools!',
        }),
      ),
      yield put({
        type: GET_THIRDPARTYTOOLS_FAILURE,
        error,
      }),
    ];
  }
}

function* addThirdpartytool(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${projecttoolEndpoint}thirdpartytool/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getThirdpartytools(data.data.thirdpartytool_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Thirdpartytool',
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
          message: 'Couldn\'t Add Thirdpartytool due to some error!',
        }),
      ),
      yield put({
        type: ADD_THIRDPARTYTOOL_FAILURE,
        error,
      }),
    ];
  }
}

function* updateThirdpartytool(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${projecttoolEndpoint}thirdpartytool/${payload.thirdpartytool_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getThirdpartytools(payload.thirdpartytool_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Thirdpartytool',
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
          message: 'Couldn\'t Edit Thirdpartytool due to some error!',
        }),
      ),
      yield put({
        type: UPDATE_THIRDPARTYTOOL_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteThirdpartytool(payload) {
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${projecttoolEndpoint}thirdpartytool/${payload.thirdpartytool_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Thirdpartytool deleted successfully!',
        }),
      ),
      yield put(getThirdpartytools(payload.project_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting thirdpartytool!',
        }),
      ),
      yield put({
        type: DELETE_THIRDPARTYTOOL_FAILURE,
        error,
      }),
    ];
  }
}

function* getCredentials(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${projecttoolEndpoint}credential/?thirdpartytool_uuid=${payload.thirdpartytool_uuid}`,
    );
    yield put({ type: GET_CREDENTIALS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Credentials!',
        }),
      ),
      yield put({
        type: GET_CREDENTIALS_FAILURE,
        error,
      }),
    ];
  }
}

function* addCredential(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${projecttoolEndpoint}credential/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getCredentials(data.data.credential_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Credential',
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
          message: 'Couldn\'t Add Credential due to some error!',
        }),
      ),
      yield put({
        type: ADD_CREDENTIAL_FAILURE,
        error,
      }),
    ];
  }
}

function* updateCredential(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${projecttoolEndpoint}credential/${payload.credential_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getCredentials(payload.credential_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Credential',
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
          message: 'Couldn\'t Edit Credential due to some error!',
        }),
      ),
      yield put({
        type: UPDATE_CREDENTIAL_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteCredential(payload) {
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${projecttoolEndpoint}credential/${payload.credential_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Credential deleted successfully!',
        }),
      ),
      yield put(getCredentials(payload.project_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting credential!',
        }),
      ),
      yield put({
        type: DELETE_CREDENTIAL_FAILURE,
        error,
      }),
    ];
  }
}

function* getReleases(payload) {
  try {
    let query_params = '';
    if (payload.release_uuid) {
      query_params = `release_uuid=${payload.release_uuid}/`;
    } else if (payload.project_uuid) {
      query_params = query_params.concat(`project_uuid=${payload.project_uuid}`);
    } else if (payload.dev_team_uuid) {
      query_params = query_params.concat(`dev_team_uuid=${payload.dev_team_uuid}`);
    }
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${projecttoolEndpoint}release/?${query_params}`,
    );
    yield put({ type: GET_RELEASES_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Releases!',
        }),
      ),
      yield put({
        type: GET_RELEASES_FAILURE,
        error,
      }),
    ];
  }
}

function* addRelease(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${projecttoolEndpoint}release/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getReleases(data.data.release_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Release',
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
          message: 'Couldn\'t Add Release due to some error!',
        }),
      ),
      yield put({
        type: ADD_RELEASE_FAILURE,
        error,
      }),
    ];
  }
}

function* updateRelease(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${projecttoolEndpoint}release/${payload.release_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getReleases(payload.release_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Release',
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
          message: 'Couldn\'t Edit Release due to some error!',
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
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${projecttoolEndpoint}release/${payload.release_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Release deleted successfully!',
        }),
      ),
      yield put(getReleases(payload.project_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting release!',
        }),
      ),
      yield put({
        type: DELETE_RELEASE_FAILURE,
        error,
      }),
    ];
  }
}

// Watchers
function* watchGetProductteams() {
  yield takeLatest(GET_PRODUCTTEAMS, getProductteams);
}

function* watchAddProductteam() {
  yield takeLatest(ADD_PRODUCTTEAM, addProductteam);
}

function* watchUpdateProductteam() {
  yield takeLatest(UPDATE_PRODUCTTEAM, updateProductteam);
}

function* watchDeleteProductteam() {
  yield takeLatest(DELETE_PRODUCTTEAM, deleteProductteam);
}

function* watchGetProducts() {
  yield takeLatest(GET_PRODUCTS, getProducts);
}

function* watchAddProduct() {
  yield takeLatest(ADD_PRODUCT, addProduct);
}

function* watchUpdateProduct() {
  yield takeLatest(UPDATE_PRODUCT, updateProduct);
}

function* watchDeleteProduct() {
  yield takeLatest(DELETE_PRODUCT, deleteProduct);
}

function* watchGetThirdpartytools() {
  yield takeLatest(GET_THIRDPARTYTOOLS, getThirdpartytools);
}

function* watchAddThirdpartytool() {
  yield takeLatest(ADD_THIRDPARTYTOOL, addThirdpartytool);
}

function* watchUpdateThirdpartytool() {
  yield takeLatest(UPDATE_THIRDPARTYTOOL, updateThirdpartytool);
}

function* watchDeleteThirdpartytool() {
  yield takeLatest(DELETE_THIRDPARTYTOOL, deleteThirdpartytool);
}

function* watchGetCredentials() {
  yield takeLatest(GET_CREDENTIALS, getCredentials);
}

function* watchAddCredential() {
  yield takeLatest(ADD_CREDENTIAL, addCredential);
}

function* watchUpdateCredential() {
  yield takeLatest(UPDATE_CREDENTIAL, updateCredential);
}

function* watchDeleteCredential() {
  yield takeLatest(DELETE_CREDENTIAL, deleteCredential);
}

function* watchGetReleases() {
  yield takeLatest(GET_RELEASES, getReleases);
}

function* watchAddRelease() {
  yield takeLatest(ADD_RELEASE, addRelease);
}

function* watchUpdateRelease() {
  yield takeLatest(UPDATE_RELEASE, updateRelease);
}

function* watchDeleteRelease() {
  yield takeLatest(DELETE_RELEASE, deleteRelease);
}


export default function* projecttoolSaga() {
  yield all([
    watchGetProductteams(),
    watchAddProductteam(),
    watchUpdateProductteam(),
    watchDeleteProductteam(),
    watchGetProducts(),
    watchAddProduct(),
    watchUpdateProduct(),
    watchDeleteProduct(),
    watchGetThirdpartytools(),
    watchAddThirdpartytool(),
    watchUpdateThirdpartytool(),
    watchDeleteThirdpartytool(),
    watchGetCredentials(),
    watchAddCredential(),
    watchUpdateCredential(),
    watchDeleteCredential(),
    watchGetReleases(),
    watchAddRelease(),
    watchUpdateRelease(),
    watchDeleteRelease(),
  ]);
}
