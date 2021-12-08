import * as actions from '../actions/release.actions';
import * as reducer from './release.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  feature: null,
  issue: null,
  feedback: null,
  decision: null,
  status: null,
};

describe('Get feature reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_FEATURES },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get feature success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_FEATURES_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      feature: undefined,
    });
  });

  it('get feature fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_FEATURES_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add feature reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_FEATURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add feature success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_FEATURE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      feature: undefined,
    });
  });

  it('add feature fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_FEATURE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update feature reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_FEATURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update feature success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_FEATURE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      feature: undefined,
    });
  });

  it('update feature fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_FEATURE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete feature reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_FEATURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete feature success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_FEATURE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      feature: undefined,
    });
  });

  it('delete feature fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_FEATURE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get issue reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ISSUES },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get issue success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ISSUES_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      issue: undefined,
    });
  });

  it('get issue fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ISSUES_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add issue reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_ISSUE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add issue success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_ISSUE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      issue: undefined,
    });
  });

  it('add issue fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_ISSUE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update issue reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_ISSUE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update issue success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_ISSUE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      issue: undefined,
    });
  });

  it('update issue fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_ISSUE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete issue reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_ISSUE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete issue success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_ISSUE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      issue: undefined,
    });
  });

  it('delete issue fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_ISSUE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get feedback reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_FEEDBACKS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get feedback success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_FEEDBACKS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      feedback: undefined,
    });
  });

  it('get feedback fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_FEEDBACKS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add feedback reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_FEEDBACK },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add feedback success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_FEEDBACK_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      feedback: undefined,
    });
  });

  it('add feedback fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_FEEDBACK_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update feedback reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_FEEDBACK },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update feedback success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_FEEDBACK_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      feedback: undefined,
    });
  });

  it('update feedback fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_FEEDBACK_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete feedback reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_FEEDBACK },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete feedback success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_FEEDBACK_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      feedback: undefined,
    });
  });

  it('delete feedback fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_FEEDBACK_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get decision reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DECISIONS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get decision success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DECISIONS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      decision: undefined,
    });
  });

  it('get decision fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DECISIONS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add decision reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_DECISION },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add decision success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_DECISION_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      decision: undefined,
    });
  });

  it('add decision fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_DECISION_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update decision reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_DECISION },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update decision success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_DECISION_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      decision: undefined,
    });
  });

  it('update decision fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_DECISION_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete decision reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_DECISION },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete decision success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_DECISION_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      decision: undefined,
    });
  });

  it('delete decision fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_DECISION_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get status reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_STATUSES },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get status success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_STATUSES_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      status: undefined,
    });
  });

  it('get status fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_STATUSES_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add status reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_STATUS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add status success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_STATUS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      status: undefined,
    });
  });

  it('add status fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_STATUS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update status reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_STATUS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update status success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_STATUS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      status: undefined,
    });
  });

  it('update status fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_STATUS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete status reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_STATUS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete status success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_STATUS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      status: undefined,
    });
  });

  it('delete status fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_STATUS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});