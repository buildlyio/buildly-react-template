import * as actions from '../actions/release.actions';
import * as reducer from './release.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  releases: [],
  comments: [],
  features: [],
  feedbacks: [],
  issues: [],
  statuses: [],
  importLoaded: false,
  featureFormData: null,
};

describe('Save Feature Form reducer', () => {
  it('should save feature form data', () => {
    const formData = { name: 'Test' };
    expect(reducer.default(
      initialState,
      { type: actions.SAVE_FEATURE_FORM_DATA, formData },
    )).toEqual({
      ...initialState,
      featureFormData: formData,
    });
  });
});

describe('Get all releases reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_RELEASES },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get all releases success reducer', () => {
    const data = [{
      release_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Release',
    }];

    expect(reducer.default(
      initialState,
      { type: actions.ALL_RELEASES_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      releases: data,
    });
  });

  it('get all releases fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_RELEASES_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get a release reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_RELEASE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get a release success reducer', () => {
    const data = {
      release_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Release',
    };

    expect(reducer.default(
      initialState,
      { type: actions.GET_RELEASE_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      releases: [data],
    });
  });

  it('get a release fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_RELEASE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Create a release reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_RELEASE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('create a release success reducer', () => {
    const data = {
      release_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Release',
    };

    expect(reducer.default(
      initialState,
      { type: actions.CREATE_RELEASE_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      releases: [data],
    });
  });

  it('create a release fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_RELEASE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Update a release reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_RELEASE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update a release success reducer', () => {
    const data = {
      release_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Release',
    };
    const editedData = {
      release_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Release Edited',
    };

    expect(reducer.default(
      { ...initialState, releases: [data] },
      { type: actions.UPDATE_RELEASE_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      releases: [editedData],
    });
  });

  it('update a release fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_RELEASE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Delete a release reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_RELEASE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete a release success reducer', () => {
    const data = {
      release_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Release',
    };

    expect(reducer.default(
      { ...initialState, releases: [data] },
      {
        type: actions.DELETE_RELEASE_SUCCESS,
        release_uuid: data.release_uuid,
      },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      releases: [],
    });
  });

  it('delete a release fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_RELEASE_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get all comments reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_COMMENTS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get all comments success reducer', () => {
    const data = [{
      comment_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Comment',
    }];

    expect(reducer.default(
      initialState,
      { type: actions.ALL_COMMENTS_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      comments: data,
    });
  });

  it('get all comments fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_COMMENTS_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get a comment reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_COMMENT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get a comment success reducer', () => {
    const data = {
      comment_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Comment',
    };

    expect(reducer.default(
      initialState,
      { type: actions.GET_COMMENT_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      comments: [data],
    });
  });

  it('get a comment fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_COMMENT_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Create a comment reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_COMMENT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('create a comment success reducer', () => {
    const data = {
      comment_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Comment',
    };

    expect(reducer.default(
      initialState,
      { type: actions.CREATE_COMMENT_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      comments: [data],
    });
  });

  it('create a comment fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_COMMENT_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Update a comment reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_COMMENT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update a comment success reducer', () => {
    const data = {
      comment_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Comment',
    };
    const editedData = {
      comment_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Comment Edited',
    };

    expect(reducer.default(
      { ...initialState, comments: [data] },
      { type: actions.UPDATE_COMMENT_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      comments: [editedData],
    });
  });

  it('update a comment fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_COMMENT_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Delete a comment reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_COMMENT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete a comment success reducer', () => {
    const data = {
      comment_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Comment',
    };

    expect(reducer.default(
      { ...initialState, comments: [data] },
      {
        type: actions.DELETE_COMMENT_SUCCESS,
        comment_uuid: data.comment_uuid,
      },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      comments: [],
    });
  });

  it('delete a comment fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_COMMENT_FAILURE },
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
      product_uuid: '275ac379-82a2-4937-a434-ce6c2e277c88',
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

describe('Create a ticket reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.IMPORT_TICKETS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('create a ticket success reducer', () => {
    const data = {
      product_uuid: '275ac379-82a2-4937-a434-ce6c2e277c88',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.IMPORT_TICKETS_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      importLoaded: true,
    });
  });

  it('create a ticket fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.IMPORT_TICKETS_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Clear a product reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CLEAR_PRODUCT_DATA },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('clear a product success reducer', () => {
    const data = {
      product_uuid: '275ac379-82a2-4937-a434-ce6c2e277c88',
      name: 'Test',
    };

    expect(reducer.default(
      { ...initialState, features: [data] },
      { ...initialState, issues: [data] },
      {
        type: actions.CLEAR_PRODUCT_DATA_SUCCESS,
        product_uuid: data.product_uuid,
      },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      features: [],
      issues: [],
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

describe('Resync board data reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESYNC_BOARD_DATA },
    )).toEqual({
      ...initialState,
      loading: true,
      importLoaded: false,
    });
  });

  it('Resync board data success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESYNC_BOARD_DATA_SUCCESS },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      importLoaded: true,
    });
  });

  it('Resync board data fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.RESYNC_BOARD_DATA_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});
