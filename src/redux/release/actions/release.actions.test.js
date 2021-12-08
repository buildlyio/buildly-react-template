import * as actions from './release.actions';

// Test Get Features
describe('Get Feature action', () => {
  it('should create an action to get feature', () => {
    const project_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_FEATURES,
      project_uuid,
    };
    expect(actions.getFeatures(project_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Feature
describe('Add Feature action', () => {
  it('should create an action to add feature', () => {
    const payload = { feature_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_FEATURE,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addFeature(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Feature
describe('Edit Feature action', () => {
  it('should create an action to edit feature', () => {
    const payload = { feature_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_FEATURE,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateFeature(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Feature
describe('Delete Feature action', () => {
  it('should create an action to delete feature', () => {
    const feature_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_FEATURE,
      feature_uuid,
    };
    expect(actions.deleteFeature(
      feature_uuid,
    )).toEqual(expectedAction);
  });
});

// Test Get Issues
describe('Get Issue action', () => {
  it('should create an action to get issue', () => {
    const project_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_ISSUES,
      project_uuid,
    };
    expect(actions.getIssues(project_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Issue
describe('Add Issue action', () => {
  it('should create an action to add issue', () => {
    const payload = { issue_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_ISSUE,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addIssue(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Issue
describe('Edit Issue action', () => {
  it('should create an action to edit issue', () => {
    const payload = { issue_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_ISSUE,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateIssue(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Issue
describe('Delete Issue action', () => {
  it('should create an action to delete issue', () => {
    const issue_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_ISSUE,
      issue_uuid,
    };
    expect(actions.deleteIssue(
      issue_uuid,
    )).toEqual(expectedAction);
  });
});

// Test Get Feedbacks
describe('Get Feedback action', () => {
  it('should create an action to get feedback', () => {
    const project_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_FEEDBACKS,
      project_uuid,
    };
    expect(actions.getFeedbacks(project_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Feedback
describe('Add Feedback action', () => {
  it('should create an action to add feedback', () => {
    const payload = { feedback_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_FEEDBACK,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addFeedback(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Feedback
describe('Edit Feedback action', () => {
  it('should create an action to edit feedback', () => {
    const payload = { feedback_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_FEEDBACK,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateFeedback(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Feedback
describe('Delete Feedback action', () => {
  it('should create an action to delete feedback', () => {
    const feedback_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_FEEDBACK,
      feedback_uuid,
    };
    expect(actions.deleteFeedback(
      feedback_uuid,
    )).toEqual(expectedAction);
  });
});

// Test Get Decisions
describe('Get Decision action', () => {
  it('should create an action to get decision', () => {
    const project_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_DECISIONS,
      project_uuid,
    };
    expect(actions.getDecisions(project_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Decision
describe('Add Decision action', () => {
  it('should create an action to add decision', () => {
    const payload = { decision_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_DECISION,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addDecision(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Decision
describe('Edit Decision action', () => {
  it('should create an action to edit decision', () => {
    const payload = { decision_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_DECISION,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateDecision(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Decision
describe('Delete Decision action', () => {
  it('should create an action to delete decision', () => {
    const decision_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_DECISION,
      decision_uuid,
    };
    expect(actions.deleteDecision(
      decision_uuid,
    )).toEqual(expectedAction);
  });
});

// Test Get Statuses
describe('Get Status action', () => {
  it('should create an action to get status', () => {
    const project_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_STATUSES,
      project_uuid,
    };
    expect(actions.getStatuses(project_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Status
describe('Add Status action', () => {
  it('should create an action to add status', () => {
    const payload = { status_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_STATUS,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addStatus(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Status
describe('Edit Status action', () => {
  it('should create an action to edit status', () => {
    const payload = { status_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_STATUS,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateStatus(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Status
describe('Delete Status action', () => {
  it('should create an action to delete status', () => {
    const status_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_STATUS,
      status_uuid,
    };
    expect(actions.deleteStatus(
      status_uuid,
    )).toEqual(expectedAction);
  });
});
