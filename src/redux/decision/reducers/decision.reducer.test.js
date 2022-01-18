import * as actions from '../actions/decision.actions';
import * as reducer from './decision.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  decisions: [],
  features: [],
  feedbacks: [],
  issues: [],
  statuses: [],
};

describe('Get all decisions reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_DECISIONS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get all decisions success reducer', () => {
    const data = [{
      decision_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    }];

    expect(reducer.default(
      initialState,
      { type: actions.ALL_DECISIONS_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      decisions: data,
    });
  });

  it('get all decisions fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_DECISIONS_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get a decision reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DECISION },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get a decision success reducer', () => {
    const data = {
      decision_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.GET_DECISION_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      decisions: [data],
    });
  });

  it('get a decision fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DECISION_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Create a decision reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_DECISION },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('create a decision success reducer', () => {
    const data = {
      decision_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.CREATE_DECISION_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      decisions: [data],
    });
  });

  it('create a decision fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_DECISION_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Update a decision reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_DECISION },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update a decision success reducer', () => {
    const data = {
      decision_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };
    const editedData = {
      decision_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Edited',
    };

    expect(reducer.default(
      { ...initialState, decisions: [data] },
      { type: actions.UPDATE_DECISION_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      decisions: [editedData],
    });
  });

  it('update a decision fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_DECISION_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Delete a decision reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_DECISION },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete a decision success reducer', () => {
    const data = {
      decision_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      { ...initialState, decisions: [data] },
      {
        type: actions.DELETE_DECISION_SUCCESS,
        decision_uuid: data.decision_uuid,
      },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      decisions: [],
    });
  });

  it('delete a decision fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_DECISION_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get all features reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_FEATURES },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get all features success reducer', () => {
    const data = [{
      feature_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    }];

    expect(reducer.default(
      initialState,
      { type: actions.ALL_FEATURES_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      features: data,
    });
  });

  it('get all features fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_FEATURES_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get a fetaure reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_FEATURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get a feature success reducer', () => {
    const data = {
      feature_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.GET_FEATURE_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      features: [data],
    });
  });

  it('get a feature fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_FEATURE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Create a feature reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_FEATURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('create a feature success reducer', () => {
    const data = {
      feature_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.CREATE_FEATURE_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      features: [data],
    });
  });

  it('create a feature fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_FEATURE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Update a feature reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_FEATURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update a feature success reducer', () => {
    const data = {
      feature_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };
    const editedData = {
      feature_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Edited',
    };

    expect(reducer.default(
      { ...initialState, features: [data] },
      { type: actions.UPDATE_FEATURE_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      features: [editedData],
    });
  });

  it('update a feature fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_FEATURE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Delete a feature reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_FEATURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete a feature success reducer', () => {
    const data = {
      feature_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      { ...initialState, features: [data] },
      {
        type: actions.DELETE_FEATURE_SUCCESS,
        feature_uuid: data.feature_uuid,
      },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      features: [],
    });
  });

  it('delete a feature fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_FEATURE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get all feedbacks reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_FEEDBACKS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get all feedbacks success reducer', () => {
    const data = [{
      feedback_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    }];

    expect(reducer.default(
      initialState,
      { type: actions.ALL_FEEDBACKS_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      feedbacks: data,
    });
  });

  it('get all feedbacks fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_FEEDBACKS_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get a feedback reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_FEEDBACK },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get a feedback success reducer', () => {
    const data = {
      feedback_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.GET_FEEDBACK_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      feedbacks: [data],
    });
  });

  it('get a feedback fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_FEEDBACK_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Create a feedback reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_FEEDBACK },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('create a feedback success reducer', () => {
    const data = {
      feedback_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.CREATE_FEEDBACK_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      feedbacks: [data],
    });
  });

  it('create a feedback fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_FEEDBACK_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Update a feedback reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_FEEDBACK },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update a feedback success reducer', () => {
    const data = {
      feedback_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };
    const editedData = {
      feedback_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Edited',
    };

    expect(reducer.default(
      { ...initialState, feedbacks: [data] },
      { type: actions.UPDATE_FEEDBACK_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      feedbacks: [editedData],
    });
  });

  it('update a feedback fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_FEEDBACK_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Delete a feedback reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_FEEDBACK },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete a feedback success reducer', () => {
    const data = {
      feedback_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      { ...initialState, feedbacks: [data] },
      {
        type: actions.DELETE_FEEDBACK_SUCCESS,
        feedback_uuid: data.feedback_uuid,
      },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      feedbacks: [],
    });
  });

  it('delete a feedback fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_FEEDBACK_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get all issues reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_ISSUES },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get all issues success reducer', () => {
    const data = [{
      issue_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    }];

    expect(reducer.default(
      initialState,
      { type: actions.ALL_ISSUES_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      issues: data,
    });
  });

  it('get all issues fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_ISSUES_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get an issue reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ISSUE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get an issue success reducer', () => {
    const data = {
      issue_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.GET_ISSUE_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      issues: [data],
    });
  });

  it('get an issue fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ISSUE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Create a issue reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_ISSUE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('create a issue success reducer', () => {
    const data = {
      issue_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.CREATE_ISSUE_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      issues: [data],
    });
  });

  it('create a issue fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_ISSUE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Update a issue reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_ISSUE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update a issue success reducer', () => {
    const data = {
      issue_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };
    const editedData = {
      issue_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Edited',
    };

    expect(reducer.default(
      { ...initialState, issues: [data] },
      { type: actions.UPDATE_ISSUE_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      issues: [editedData],
    });
  });

  it('update a issue fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_ISSUE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Delete a issue reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_ISSUE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete a issue success reducer', () => {
    const data = {
      issue_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      { ...initialState, issues: [data] },
      {
        type: actions.DELETE_ISSUE_SUCCESS,
        issue_uuid: data.issue_uuid,
      },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      issues: [],
    });
  });

  it('delete a issue fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_ISSUE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get all statuses reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_STATUSES },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get all statuses success reducer', () => {
    const data = [{
      status_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    }];

    expect(reducer.default(
      initialState,
      { type: actions.ALL_STATUSES_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      statuses: data,
    });
  });

  it('get all statuses fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_STATUSES_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get a status reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_STATUS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get a status success reducer', () => {
    const data = {
      status_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.GET_STATUS_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      statuses: [data],
    });
  });

  it('get a status fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_STATUS_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Create a status reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_STATUS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('create a status success reducer', () => {
    const data = {
      status_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.CREATE_STATUS_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      statuses: [data],
    });
  });

  it('create a status fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_STATUS_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Update a status reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_STATUS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update a status success reducer', () => {
    const data = {
      status_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };
    const editedData = {
      status_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Edited',
    };

    expect(reducer.default(
      { ...initialState, statuses: [data] },
      { type: actions.UPDATE_STATUS_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      statuses: [editedData],
    });
  });

  it('update a status fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_STATUS_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Delete a status reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_STATUS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete a status success reducer', () => {
    const data = {
      status_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      { ...initialState, statuses: [data] },
      {
        type: actions.DELETE_STATUS_SUCCESS,
        status_uuid: data.status_uuid,
      },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      statuses: [],
    });
  });

  it('delete a status fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_STATUS_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});
