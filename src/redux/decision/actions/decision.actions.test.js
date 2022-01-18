import * as actions from './decision.actions';

// Test Get All Decisions
describe('Get All Decisions action', () => {
  it('should create an action to get all decisions', () => {
    const expectedAction = { type: actions.ALL_DECISIONS };
    expect(actions.getAllDecisions()).toEqual(expectedAction);
  });
});

// Test Get Decision
describe('Get Decision action', () => {
  it('should create an action to get decision', () => {
    const decision_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.GET_DECISION,
      decision_uuid,
    };

    expect(actions.getDecision(decision_uuid))
      .toEqual(expectedAction);
  });
});

// Test Create Decision
describe('Create Decision action', () => {
  it('should create an action to create decision', () => {
    const data = { name: 'Test Decision' };
    const expectedAction = {
      type: actions.CREATE_DECISION,
      data,
    };

    expect(actions.createDecision(data)).toEqual(expectedAction);
  });
});

// Test Update Decision
describe('Update Decision action', () => {
  it('should create an action to update decision', () => {
    const data = { name: 'Test Decision Edited' };
    const expectedAction = {
      type: actions.UPDATE_DECISION,
      data,
    };

    expect(actions.updateDecision(data)).toEqual(expectedAction);
  });
});

// Test Delete Decision
describe('Delete Decision action', () => {
  it('should create an action to delete decision', () => {
    const decision_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.DELETE_DECISION,
      decision_uuid,
    };

    expect(actions.deleteDecision(decision_uuid))
      .toEqual(expectedAction);
  });
});

// Test Get All Features
describe('Get All Features action', () => {
  it('should create an action to get all features', () => {
    const expectedAction = { type: actions.ALL_FEATURES };
    expect(actions.getAllFeatures()).toEqual(expectedAction);
  });
});

// Test Get Feature
describe('Get Feature action', () => {
  it('should create an action to get feature', () => {
    const feature_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.GET_FEATURE,
      feature_uuid,
    };

    expect(actions.getFeature(feature_uuid)).toEqual(expectedAction);
  });
});

// Test Create Feature
describe('Create Feature action', () => {
  it('should create an action to create feature', () => {
    const data = { name: 'Test Feature' };
    const expectedAction = {
      type: actions.CREATE_FEATURE,
      data,
    };

    expect(actions.createFeature(data)).toEqual(expectedAction);
  });
});

// Test Update Feature
describe('Update Feature action', () => {
  it('should create an action to update feature', () => {
    const data = { name: 'Test Feature Edited' };
    const expectedAction = {
      type: actions.UPDATE_FEATURE,
      data,
    };

    expect(actions.updateFeature(data)).toEqual(expectedAction);
  });
});

// Test Delete Feature
describe('Delete Feature action', () => {
  it('should create an action to delete feature', () => {
    const feature_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.DELETE_FEATURE,
      feature_uuid,
    };

    expect(actions.deleteFeature(feature_uuid))
      .toEqual(expectedAction);
  });
});

// Test Get All Feedbacks
describe('Get All Feedbacks action', () => {
  it('should create an action to get all feedbacks', () => {
    const expectedAction = { type: actions.ALL_FEEDBACKS };
    expect(actions.getAllFeedbacks()).toEqual(expectedAction);
  });
});

// Test Get Feedback
describe('Get Feedback action', () => {
  it('should create an action to get feedback', () => {
    const feedback_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.GET_FEEDBACK,
      feedback_uuid,
    };

    expect(actions.getFeedback(feedback_uuid))
      .toEqual(expectedAction);
  });
});

// Test Create Feedback
describe('Create Feedback action', () => {
  it('should create an action to create feedback', () => {
    const data = { name: 'Test Feedback' };
    const expectedAction = {
      type: actions.CREATE_FEEDBACK,
      data,
    };

    expect(actions.createFeedback(data)).toEqual(expectedAction);
  });
});

// Test Update Feedback
describe('Update Feedback action', () => {
  it('should create an action to update feedback', () => {
    const data = { name: 'Test Feedback Edited' };
    const expectedAction = {
      type: actions.UPDATE_FEEDBACK,
      data,
    };

    expect(actions.updateFeedback(data)).toEqual(expectedAction);
  });
});

// Test Delete Feedback
describe('Delete Feedback action', () => {
  it('should create an action to delete feedback', () => {
    const feedback_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.DELETE_FEEDBACK,
      feedback_uuid,
    };

    expect(actions.deleteFeedback(feedback_uuid))
      .toEqual(expectedAction);
  });
});

// Test Get All Issues
describe('Get All Issues action', () => {
  it('should create an action to get all issues', () => {
    const expectedAction = { type: actions.ALL_ISSUES };
    expect(actions.getAllIssues()).toEqual(expectedAction);
  });
});

// Test Get Issue
describe('Get Issue action', () => {
  it('should create an action to get issue', () => {
    const issue_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.GET_ISSUE,
      issue_uuid,
    };

    expect(actions.getIssue(issue_uuid)).toEqual(expectedAction);
  });
});

// Test Create Issue
describe('Create Issue action', () => {
  it('should create an action to create issue', () => {
    const data = { name: 'Test Issue' };
    const expectedAction = {
      type: actions.CREATE_ISSUE,
      data,
    };

    expect(actions.createIssue(data)).toEqual(expectedAction);
  });
});

// Test Update Issue
describe('Update Issue action', () => {
  it('should create an action to update issue', () => {
    const data = { name: 'Test Issue Edited' };
    const expectedAction = {
      type: actions.UPDATE_ISSUE,
      data,
    };

    expect(actions.updateIssue(data)).toEqual(expectedAction);
  });
});

// Test Delete Issue
describe('Delete Issue action', () => {
  it('should create an action to delete issue', () => {
    const issue_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.DELETE_ISSUE,
      issue_uuid,
    };

    expect(actions.deleteIssue(issue_uuid))
      .toEqual(expectedAction);
  });
});

// Test Get All Statuses
describe('Get All Statuses action', () => {
  it('should create an action to get all statuses', () => {
    const expectedAction = { type: actions.ALL_STATUSES };
    expect(actions.getAllStatuses()).toEqual(expectedAction);
  });
});

// Test Get Status
describe('Get Status action', () => {
  it('should create an action to get status', () => {
    const status_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.GET_STATUS,
      status_uuid,
    };

    expect(actions.getStatus(status_uuid)).toEqual(expectedAction);
  });
});

// Test Create Status
describe('Create Status action', () => {
  it('should create an action to create status', () => {
    const data = { name: 'Test Status' };
    const expectedAction = {
      type: actions.CREATE_STATUS,
      data,
    };

    expect(actions.createStatus(data)).toEqual(expectedAction);
  });
});

// Test Update Status
describe('Update Status action', () => {
  it('should create an action to update status', () => {
    const data = { name: 'Test Status Edited' };
    const expectedAction = {
      type: actions.UPDATE_STATUS,
      data,
    };

    expect(actions.updateStatus(data)).toEqual(expectedAction);
  });
});

// Test Delete Status
describe('Delete Status action', () => {
  it('should create an action to delete status', () => {
    const status_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.DELETE_STATUS,
      status_uuid,
    };

    expect(actions.deleteStatus(status_uuid))
      .toEqual(expectedAction);
  });
});
