import * as _ from 'lodash';
import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
import { routes } from '@routes/routesConstants';
import {
  ALL_CREDENTIALS,
  ALL_CREDENTIALS_SUCCESS,
  ALL_CREDENTIALS_FAILURE,
  ALL_PRODUCT_TEAMS,
  ALL_PRODUCT_TEAMS_SUCCESS,
  ALL_PRODUCT_TEAMS_FAILURE,
  ALL_PRODUCTS,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAILURE,
  ALL_RELEASES,
  ALL_RELEASES_SUCCESS,
  ALL_RELEASES_FAILURE,
  ALL_THIRD_PARTY_TOOLS,
  ALL_THIRD_PARTY_TOOLS_SUCCESS,
  ALL_THIRD_PARTY_TOOLS_FAILURE,
  GET_CREDENTIAL,
  GET_CREDENTIAL_SUCCESS,
  GET_CREDENTIAL_FAILURE,
  GET_PRODUCT_TEAM,
  GET_PRODUCT_TEAM_SUCCESS,
  GET_PRODUCT_TEAM_FAILURE,
  GET_PRODUCT,
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAILURE,
  GET_RELEASE,
  GET_RELEASE_SUCCESS,
  GET_RELEASE_FAILURE,
  GET_THIRD_PARTY_TOOL,
  GET_THIRD_PARTY_TOOL_SUCCESS,
  GET_BOARD,
  GET_BOARD_SUCCESS,
  GET_BOARD_FAILURE,
  GET_THIRD_PARTY_TOOL_FAILURE,
  CREATE_CREDENTIAL,
  CREATE_CREDENTIAL_SUCCESS,
  CREATE_CREDENTIAL_FAILURE,
  CREATE_PRODUCT_TEAM,
  CREATE_PRODUCT_TEAM_SUCCESS,
  CREATE_PRODUCT_TEAM_FAILURE,
  CREATE_PRODUCT,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  CREATE_RELEASE,
  CREATE_RELEASE_SUCCESS,
  CREATE_RELEASE_FAILURE,
  CREATE_THIRD_PARTY_TOOL,
  CREATE_THIRD_PARTY_TOOL_SUCCESS,
  CREATE_THIRD_PARTY_TOOL_FAILURE,
  CREATE_BOARD,
  CREATE_BOARD_SUCCESS,
  CREATE_BOARD_FAILURE,
  UPDATE_CREDENTIAL,
  UPDATE_CREDENTIAL_SUCCESS,
  UPDATE_CREDENTIAL_FAILURE,
  UPDATE_PRODUCT_TEAM,
  UPDATE_PRODUCT_TEAM_SUCCESS,
  UPDATE_PRODUCT_TEAM_FAILURE,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  UPDATE_RELEASE,
  UPDATE_RELEASE_SUCCESS,
  UPDATE_RELEASE_FAILURE,
  UPDATE_THIRD_PARTY_TOOL,
  UPDATE_THIRD_PARTY_TOOL_SUCCESS,
  UPDATE_THIRD_PARTY_TOOL_FAILURE,
  DELETE_CREDENTIAL,
  DELETE_CREDENTIAL_SUCCESS,
  DELETE_CREDENTIAL_FAILURE,
  DELETE_PRODUCT_TEAM,
  DELETE_PRODUCT_TEAM_SUCCESS,
  DELETE_PRODUCT_TEAM_FAILURE,
  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  DELETE_RELEASE,
  DELETE_RELEASE_SUCCESS,
  DELETE_RELEASE_FAILURE,
  DELETE_THIRD_PARTY_TOOL,
  DELETE_THIRD_PARTY_TOOL_SUCCESS,
  DELETE_THIRD_PARTY_TOOL_FAILURE,
  createCredential,
  updateCredential,
  saveProductFormData,
  clearBoardData,
  // clearValidateData,
  getBoard,
  VALIDATE_CREDENTIAL,
  VALIDATE_CREDENTIAL_SUCCESS,
  VALIDATE_CREDENTIAL_FAILURE,
} from '../actions/product.actions';
import {
  createStatus,
} from '../../decision/actions/decision.actions';

const productEndpoint = 'product/';

function* allCredentials(payload) {
  try {
    const creds = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${productEndpoint}credential/`,
    );
    yield put({ type: ALL_CREDENTIALS_SUCCESS, data: creds.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Credentials!',
        }),
      ),
      yield put({
        type: ALL_CREDENTIALS_FAILURE,
        error,
      }),
    ];
  }
}

function* getCredential(payload) {
  try {
    const cred = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${productEndpoint}credential/?credential_uuid=${payload.credential_uuid}`,
    );
    yield put({ type: GET_CREDENTIAL_SUCCESS, data: cred.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Credential!',
        }),
      ),
      yield put({
        type: GET_CREDENTIAL_FAILURE,
        error,
      }),
    ];
  }
}

function* addCredential(payload) {
  try {
    const cred = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${productEndpoint}credential/`,
      payload.data,
    );
    yield put({ type: CREATE_CREDENTIAL_SUCCESS, data: cred.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Credential!',
        }),
      ),
      yield put({
        type: CREATE_CREDENTIAL_FAILURE,
        error,
      }),
    ];
  }
}

function* updateCredentials(payload) {
  try {
    const cred = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${productEndpoint}credential/${payload.data.credential_uuid}`,
      payload.data,
    );
    yield put({ type: UPDATE_CREDENTIAL_SUCCESS, data: cred.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Credential!',
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
  const { credential_uuid } = payload;
  try {
    const cred = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${productEndpoint}credential/${credential_uuid}`,
    );
    yield put({ type: DELETE_CREDENTIAL_SUCCESS, credential_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Credential!',
        }),
      ),
      yield put({
        type: DELETE_CREDENTIAL_FAILURE,
        error,
      }),
    ];
  }
}

function* allProductTeams(payload) {
  try {
    const teams = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${productEndpoint}productteam/`,
    );
    yield put({ type: ALL_PRODUCT_TEAMS_SUCCESS, data: teams.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Product Teams!',
        }),
      ),
      yield put({
        type: ALL_PRODUCT_TEAMS_FAILURE,
        error,
      }),
    ];
  }
}

function* getProductTeam(payload) {
  try {
    const team = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${productEndpoint}productteam/?productteam_uuid=${payload.productteam_uuid}`,
    );
    yield put({ type: GET_PRODUCT_TEAM_SUCCESS, data: team.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Product Team!',
        }),
      ),
      yield put({
        type: GET_PRODUCT_TEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* createProductTeam(payload) {
  try {
    const productTeam = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${productEndpoint}productteam/`,
      payload.data,
    );
    yield put({ type: CREATE_PRODUCT_TEAM_SUCCESS, data: productTeam.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Product Team!',
        }),
      ),
      yield put({
        type: CREATE_PRODUCT_TEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* updateProductTeam(payload) {
  try {
    const productTeam = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${productEndpoint}productteam/${payload.data.productteam_uuid}`,
      payload.data,
    );
    yield put({ type: UPDATE_PRODUCT_TEAM_SUCCESS, data: productTeam.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Product Team!',
        }),
      ),
      yield put({
        type: UPDATE_PRODUCT_TEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteProductTeam(payload) {
  const { productteam_uuid } = payload;
  try {
    const productTeam = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${productEndpoint}productteam/${productteam_uuid}`,
    );
    yield put({ type: DELETE_PRODUCT_TEAM_SUCCESS, productteam_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Product Team!',
        }),
      ),
      yield put({
        type: DELETE_PRODUCT_TEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* allProducts(payload) {
  try {
    const products = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${productEndpoint}product/`,
    );
    yield put({ type: ALL_PRODUCTS_SUCCESS, data: products.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Products!',
        }),
      ),
      yield put({
        type: ALL_PRODUCTS_FAILURE,
        error,
      }),
    ];
  }
}

function* getProduct(payload) {
  try {
    const product = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${productEndpoint}product/?organization_uuid=${payload.product_uuid}`,
    );
    yield put({ type: GET_PRODUCT_SUCCESS, data: product.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Product!',
        }),
      ),
      yield put({
        type: GET_PRODUCT_FAILURE,
        error,
      }),
    ];
  }
}

function* createProduct(payload) {
  const { history } = payload;
  try {
    const product = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${productEndpoint}product/`,
      payload.data,
    );
    if (product && product.data) {
      const dateTime = new Date();
      yield all(_.map(payload.data.creds, (cred) => (
        put(createCredential({
          ...cred,
          product_uuid: product.data.product_uuid,
          create_date: dateTime,
          edit_date: dateTime,
        }))
      )));
    }
    yield [
      yield put({ type: CREATE_PRODUCT_SUCCESS, data: product.data }),
      yield put(saveProductFormData(null)),
    ];
    if (history) {
      history.push(routes.DASHBOARD);
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Product!',
        }),
      ),
      yield put({
        type: CREATE_PRODUCT_FAILURE,
        error,
      }),
    ];
  }
}

function* updateProduct(payload) {
  try {
    const product = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${productEndpoint}product/${payload.data.product_uuid}`,
      payload.data,
    );
    if (product && product.data) {
      if ((payload.data.changedData[0].changeTool === true
        && payload.data.changedData[0].auth_detail)
        || (payload.data.changedData[0].changeTool === false
          && payload.data.changedData[0].third_party_tool
          && payload.data.changedData[0].credential_uuid === undefined)) {
        const dateTime = new Date();
        const credData = {
          ...payload.data.changedData[0],
          product_uuid: product.data.product_uuid,
          create_date: dateTime,
          edit_date: dateTime,
        };
        yield put(createCredential(credData));
      } else if (payload.data.changedData[0].changeTool) {
        const dateTime = new Date();
        const credData = {
          third_party_tool: null,
          auth_detail: {
            tool_name: null,
            tool_type: 'Feature',
            owner_name: null,
            access_token: null,
          },
          product_uuid: product.data.product_uuid,
          is_fresh_start: true,
          create_date: dateTime,
          edit_date: dateTime,
        };
        yield put(createCredential(credData));
      } else if (payload.data.changedData[0].changeTool === false
        && payload.data.changedData[0].credential_uuid) {
        const dateTime = new Date();
        const credData = {
          ...payload.data.changedData[0],
          product_uuid: product.data.product_uuid,
          create_date: dateTime,
          edit_date: dateTime,
        };
        yield put(updateCredential(credData));
      }

      if ((payload.data.changedData[1].changeTool === true
      && payload.data.changedData[1].auth_detail)
      || (payload.data.changedData[1].changeTool === false
        && payload.data.changedData[1].third_party_tool
        && payload.data.changedData[1].credential_uuid === undefined)) {
        const dateTime = new Date();
        const credData = {
          ...payload.data.changedData[1],
          product_uuid: product.data.product_uuid,
          create_date: dateTime,
          edit_date: dateTime,
        };
        yield put(createCredential(credData));
      } else if (payload.data.changedData[1].changeTool) {
        const dateTime = new Date();
        const credData = {
          third_party_tool: null,
          auth_detail: {
            tool_name: null,
            tool_type: 'Issue',
            owner_name: null,
            access_token: null,
          },
          product_uuid: product.data.product_uuid,
          is_fresh_start: true,
          create_date: dateTime,
          edit_date: dateTime,
        };
        yield put(createCredential(credData));
      } else if (payload.data.changedData[1].changeTool === false
      && payload.data.changedData[1].credential_uuid) {
        const dateTime = new Date();
        const credData = {
          ...payload.data.changedData[1],
          product_uuid: product.data.product_uuid,
          create_date: dateTime,
          edit_date: dateTime,
        };
        yield put(updateCredential(credData));
      }
    }
    yield put({ type: UPDATE_PRODUCT_SUCCESS, data: product.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Product!',
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
  const { product_uuid } = payload;
  try {
    const product = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${productEndpoint}product/${product_uuid}`,
    );
    yield put({ type: DELETE_PRODUCT_SUCCESS, product_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Product!',
        }),
      ),
      yield put({
        type: DELETE_PRODUCT_FAILURE,
        error,
      }),
    ];
  }
}

function* allReleases(payload) {
  try {
    const releases = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${productEndpoint}release/`,
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
      `${window.env.API_URL}${productEndpoint}release/?release_uuid=${payload.release_uuid}`,
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
      `${window.env.API_URL}${productEndpoint}release/`,
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
      `${window.env.API_URL}${productEndpoint}release/${payload.data.release_uuid}`,
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
      `${window.env.API_URL}${productEndpoint}release/${release_uuid}`,
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

function* allThirdPartyTools(payload) {
  try {
    const tools = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${productEndpoint}thirdpartytool/`,
    );
    yield put({ type: ALL_THIRD_PARTY_TOOLS_SUCCESS, data: tools.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Third Party Tools!',
        }),
      ),
      yield put({
        type: ALL_THIRD_PARTY_TOOLS_FAILURE,
        error,
      }),
    ];
  }
}

function* getThirdPartyTool(payload) {
  try {
    const tool = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${productEndpoint}thirdpartytool/?thirdpartytool_uuid=${payload.thirdpartytool_uuid}`,
    );
    yield put({ type: GET_THIRD_PARTY_TOOL_SUCCESS, data: tool.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Third Party Tool!',
        }),
      ),
      yield put({
        type: GET_THIRD_PARTY_TOOL_FAILURE,
        error,
      }),
    ];
  }
}

function* createThirdPartyTool(payload) {
  try {
    const thirdpartytool = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${productEndpoint}thirdpartytool/`,
      payload.data,
    );
    yield put({ type: CREATE_THIRD_PARTY_TOOL_SUCCESS, data: thirdpartytool.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Third Party Tool!',
        }),
      ),
      yield put({
        type: CREATE_THIRD_PARTY_TOOL_FAILURE,
        error,
      }),
    ];
  }
}

function* updateThirdPartyTool(payload) {
  try {
    const thirdpartytool = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${productEndpoint}thirdpartytool/${payload.data.thirdpartytool_uuid}`,
      payload.data,
    );
    yield put({ type: UPDATE_THIRD_PARTY_TOOL_SUCCESS, data: thirdpartytool.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Third Party Tool!',
        }),
      ),
      yield put({
        type: UPDATE_THIRD_PARTY_TOOL_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteThirdPartyTool(payload) {
  const { thirdpartytool_uuid } = payload;
  try {
    const thirdpartytool = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${productEndpoint}thirdpartytool/${thirdpartytool_uuid}`,
    );
    yield put({ type: DELETE_THIRD_PARTY_TOOL_SUCCESS, thirdpartytool_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Third Party Tool!',
        }),
      ),
      yield put({
        type: DELETE_THIRD_PARTY_TOOL_FAILURE,
        error,
      }),
    ];
  }
}

function* getBoards(payload) {
  try {
    const board = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${productEndpoint}board-list/?product_uuid=${payload.product_uuid}`,
    );
    yield put(clearBoardData());
    yield put({ type: GET_BOARD_SUCCESS, data: board.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Board!',
        }),
      ),
      yield put({
        type: GET_BOARD_FAILURE,
        error,
      }),
    ];
  }
}

function* createBoard(payload) {
  try {
    const board = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${productEndpoint}board-configuration/?product_uuid=${payload.data.product_uuid}`,
      payload.data,
    );
    if (payload.create) {
      const prodID = payload.data.product_uuid;
      const statusData = board?.data[0]?.feature_tool_detail?.column_list?.map((col) => ({
        product_uuid: prodID,
        name: col.column_name,
        description: col.column_name,
        status_tracking_id: col.column_id,
      }));
      if (statusData) {
        statusData.push({
          product_uuid: prodID,
          name: 'No Status',
          description: 'No Status',
          status_tracking_id: null,
        });
        yield put(createStatus(statusData));
      }
    }
    yield put({ type: CREATE_BOARD_SUCCESS, data: board.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Board!',
        }),
      ),
      yield put({
        type: CREATE_BOARD_FAILURE,
        error,
      }),
    ];
  }
}

function* validateCredential(payload) {
  try {
    const cred = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${productEndpoint}validate-credential/`,
      payload.data,
    );
    yield [
      yield put({ type: VALIDATE_CREDENTIAL_SUCCESS, data: payload.valid }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Credentials are valid',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Invalid credentials!',
        }),
      ),
      yield put({
        type: VALIDATE_CREDENTIAL_FAILURE,
        error,
      }),
    ];
  }
}

// Watchers
function* watchGetAllCredentials() {
  yield takeLatest(ALL_CREDENTIALS, allCredentials);
}

function* watchGetCredential() {
  yield takeLatest(GET_CREDENTIAL, getCredential);
}

function* watchCreateCredential() {
  yield takeLatest(CREATE_CREDENTIAL, addCredential);
}

function* watchUpdateCredential() {
  yield takeLatest(UPDATE_CREDENTIAL, updateCredentials);
}

function* watchDeleteCredential() {
  yield takeLatest(DELETE_CREDENTIAL, deleteCredential);
}

function* watchGetAllProductTeams() {
  yield takeLatest(ALL_PRODUCT_TEAMS, allProductTeams);
}

function* watchGetProductTeam() {
  yield takeLatest(GET_PRODUCT_TEAM, getProductTeam);
}

function* watchCreateProductTeam() {
  yield takeLatest(CREATE_PRODUCT_TEAM, createProductTeam);
}

function* watchUpdateProductTeam() {
  yield takeLatest(UPDATE_PRODUCT_TEAM, updateProductTeam);
}

function* watchDeleteProductTeam() {
  yield takeLatest(DELETE_PRODUCT_TEAM, deleteProductTeam);
}

function* watchGetAllProducts() {
  yield takeLatest(ALL_PRODUCTS, allProducts);
}

function* watchGetProduct() {
  yield takeLatest(GET_PRODUCT, getProduct);
}

function* watchCreateProduct() {
  yield takeLatest(CREATE_PRODUCT, createProduct);
}

function* watchUpdateProduct() {
  yield takeLatest(UPDATE_PRODUCT, updateProduct);
}

function* watchDeleteProduct() {
  yield takeLatest(DELETE_PRODUCT, deleteProduct);
}

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

function* watchGetAllThirdPartyTools() {
  yield takeLatest(ALL_THIRD_PARTY_TOOLS, allThirdPartyTools);
}

function* watchGetThirdPartyTool() {
  yield takeLatest(GET_THIRD_PARTY_TOOL, getThirdPartyTool);
}

function* watchCreateThirdPartyTool() {
  yield takeLatest(CREATE_THIRD_PARTY_TOOL, createThirdPartyTool);
}

function* watchUpdateThirdPartyTool() {
  yield takeLatest(UPDATE_THIRD_PARTY_TOOL, updateThirdPartyTool);
}

function* watchDeleteThirdPartyTool() {
  yield takeLatest(DELETE_THIRD_PARTY_TOOL, deleteThirdPartyTool);
}

function* watchGetBoard() {
  yield takeLatest(GET_BOARD, getBoards);
}

function* watchCreateBoard() {
  yield takeLatest(CREATE_BOARD, createBoard);
}

function* watchValidateCredential() {
  yield takeLatest(VALIDATE_CREDENTIAL, validateCredential);
}

export default function* productSaga() {
  yield all([
    watchGetAllCredentials(),
    watchGetAllProductTeams(),
    watchGetAllProducts(),
    watchGetAllReleases(),
    watchGetAllThirdPartyTools(),
    watchGetCredential(),
    watchGetProductTeam(),
    watchGetProduct(),
    watchGetRelease(),
    watchGetThirdPartyTool(),
    watchGetBoard(),
    watchCreateCredential(),
    watchCreateProductTeam(),
    watchCreateProduct(),
    watchCreateRelease(),
    watchCreateThirdPartyTool(),
    watchCreateBoard(),
    watchUpdateCredential(),
    watchUpdateProductTeam(),
    watchUpdateProduct(),
    watchUpdateRelease(),
    watchUpdateThirdPartyTool(),
    watchDeleteCredential(),
    watchDeleteProductTeam(),
    watchDeleteProduct(),
    watchDeleteRelease(),
    watchDeleteThirdPartyTool(),
    watchValidateCredential(),
  ]);
}
