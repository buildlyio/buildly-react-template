import * as actions from '../actions/project.actions';
import * as reducer from './project.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  productteam: null,
  product: null,
  thirdpartytool: null,
  credential: null,
  release: null,
};

describe('Get product team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTTEAMS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get product team success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTTEAMS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productteam: undefined,
    });
  });

  it('get product team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTTEAMS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add product team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCTTEAM },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add product team success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCTTEAM_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productteam: undefined,
    });
  });

  it('add product team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCTTEAM_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update product team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_PRODUCTTEAM },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update product team success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_PRODUCTTEAM_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productteam: undefined,
    });
  });

  it('update product team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_PRODUCTTEAM_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete product team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCTTEAM },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete product team success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCTTEAM_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productteam: undefined,
    });
  });

  it('delete product team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCTTEAM_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get product reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get product success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      product: undefined,
    });
  });

  it('get product fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add product reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add product success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCT_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      product: undefined,
    });
  });

  it('add product fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCT_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update product reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_PRODUCT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update product success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_PRODUCT_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      product: undefined,
    });
  });

  it('update product fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_PRODUCT_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete product reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete product success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCT_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      product: undefined,
    });
  });

  it('delete product fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCT_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get thirdpartytool reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_THIRDPARTYTOOLS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get thirdpartytool success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_THIRDPARTYTOOLS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      thirdpartytool: undefined,
    });
  });

  it('get thirdpartytool fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_THIRDPARTYTOOLS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add thirdpartytool reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_THIRDPARTYTOOL },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add thirdpartytool success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_THIRDPARTYTOOL_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      thirdpartytool: undefined,
    });
  });

  it('add thirdpartytool fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_THIRDPARTYTOOL_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update thirdpartytool reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_THIRDPARTYTOOL },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update thirdpartytool success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_THIRDPARTYTOOL_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      thirdpartytool: undefined,
    });
  });

  it('update thirdpartytool fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_THIRDPARTYTOOL_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete thirdpartytool reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_THIRDPARTYTOOL },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete thirdpartytool success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_THIRDPARTYTOOL_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      thirdpartytool: undefined,
    });
  });

  it('delete thirdpartytool fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_THIRDPARTYTOOL_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get credentials reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CREDENTIALS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get credentials success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CREDENTIALS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      credential: undefined,
    });
  });

  it('get credentials fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_CREDENTIALS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add credentials reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CREDENTIAL },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add credentials success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CREDENTIAL_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      credential: undefined,
    });
  });

  it('add credentials fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_CREDENTIAL_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update credentials reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_CREDENTIAL },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update credentials success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_CREDENTIAL_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      credential: undefined,
    });
  });

  it('update credentials fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_CREDENTIAL_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete credentials reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CREDENTIAL },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete credentials success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CREDENTIAL_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      credential: undefined,
    });
  });

  it('delete credentials fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_CREDENTIAL_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get releases reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_RELEASES },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get releases success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_RELEASES_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      release: undefined,
    });
  });

  it('get releases fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_RELEASES_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add releases reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_RELEASE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add releases success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_RELEASE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      release: undefined,
    });
  });

  it('add releases fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_RELEASE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update releases reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_RELEASE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update releases success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_RELEASE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      release: undefined,
    });
  });

  it('update releases fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_RELEASE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete releases reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_RELEASE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete releases success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_RELEASE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      release: undefined,
    });
  });

  it('delete releases fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_RELEASE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
