import * as actions from './devpartner.actions';

// Test Get All Dev Teams
describe('Get All Dev Teams action', () => {
  it('should create an action to get all dev teams', () => {
    const expectedAction = { type: actions.ALL_DEV_TEAMS };
    expect(actions.getAllDevTeams()).toEqual(expectedAction);
  });
});

// Test Get Dev Team
describe('Get Dev Team action', () => {
  it('should create an action to get dev team', () => {
    const devteam_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.GET_DEV_TEAM,
      devteam_uuid,
    };

    expect(actions.getDevTeam(devteam_uuid))
      .toEqual(expectedAction);
  });
});

// Test Create Dev Team
describe('Create Dev Team action', () => {
  it('should create an action to create dev team', () => {
    const data = { name: 'Test' };
    const expectedAction = {
      type: actions.CREATE_DEV_TEAM,
      data,
    };

    expect(actions.createDevTeam(data)).toEqual(expectedAction);
  });
});

// Test Update Dev Team
describe('Update Dev Team action', () => {
  it('should create an action to update dev team', () => {
    const data = { name: 'Test Edited' };
    const expectedAction = {
      type: actions.UPDATE_DEV_TEAM,
      data,
    };

    expect(actions.updateDevTeam(data)).toEqual(expectedAction);
  });
});

// Test Delete Dev Team
describe('Delete Dev Team action', () => {
  it('should create an action to delete dev team', () => {
    const devteam_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.DELETE_DEV_TEAM,
      devteam_uuid,
    };

    expect(actions.deleteDevTeam(devteam_uuid))
      .toEqual(expectedAction);
  });
});

// Test Get All Timesheet Hours
describe('Get All Timesheet Hours action', () => {
  it('should create an action to get all timesheet hours', () => {
    const expectedAction = { type: actions.ALL_TIMESHEET_HOURS };
    expect(actions.getAllTimesheetHours()).toEqual(expectedAction);
  });
});

// Test Get Timesheet Hour
describe('Get Timesheet Hour action', () => {
  it('should create an action to get timesheet hour', () => {
    const timesheethour_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.GET_TIMESHEET_HOUR,
      timesheethour_uuid,
    };

    expect(actions.getTimesheetHour(timesheethour_uuid))
      .toEqual(expectedAction);
  });
});

// Test Create Timesheet Hour
describe('Create Timesheet Hour action', () => {
  it('should create an action to create timesheet hour', () => {
    const data = { name: 'Test' };
    const expectedAction = {
      type: actions.CREATE_TIMESHEET_HOUR,
      data,
    };

    expect(actions.createTimesheetHour(data))
      .toEqual(expectedAction);
  });
});

// Test Update Timesheet Hour
describe('Update Timesheet Hour action', () => {
  it('should create an action to update timesheet hour', () => {
    const data = { name: 'Test Edited' };
    const expectedAction = {
      type: actions.UPDATE_TIMESHEET_HOUR,
      data,
    };

    expect(actions.updateTimesheetHour(data))
      .toEqual(expectedAction);
  });
});

// Test Delete Timesheet Hour
describe('Delete Timesheet Hour action', () => {
  it('should create an action to delete timesheet hour', () => {
    const timesheethour_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.DELETE_TIMESHEET_HOUR,
      timesheethour_uuid,
    };

    expect(actions.deleteTimesheetHour(timesheethour_uuid))
      .toEqual(expectedAction);
  });
});

// Test Get All Timesheets
describe('Get All Timesheets action', () => {
  it('should create an action to get all timesheets', () => {
    const expectedAction = { type: actions.ALL_TIMESHEETS };
    expect(actions.getAllTimesheets()).toEqual(expectedAction);
  });
});

// Test Get Timesheet
describe('Get Timesheet action', () => {
  it('should create an action to get timesheet', () => {
    const timesheet_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.GET_TIMESHEET,
      timesheet_uuid,
    };

    expect(actions.getTimesheet(timesheet_uuid))
      .toEqual(expectedAction);
  });
});

// Test Create Timesheet
describe('Create Timesheet action', () => {
  it('should create an action to create timesheet', () => {
    const data = { name: 'Test' };
    const expectedAction = {
      type: actions.CREATE_TIMESHEET,
      data,
    };

    expect(actions.createTimesheet(data)).toEqual(expectedAction);
  });
});

// Test Update Timesheet
describe('Update Timesheet action', () => {
  it('should create an action to update timesheet', () => {
    const data = { name: 'Test Edited' };
    const expectedAction = {
      type: actions.UPDATE_TIMESHEET,
      data,
    };

    expect(actions.updateTimesheet(data)).toEqual(expectedAction);
  });
});

// Test Delete Timesheet
describe('Delete Timesheet action', () => {
  it('should create an action to delete timesheet', () => {
    const timesheet_uuid = '275ac379-82a2-4937-a434-ce6c2e277c88';
    const expectedAction = {
      type: actions.DELETE_TIMESHEET,
      timesheet_uuid,
    };

    expect(actions.deleteTimesheet(timesheet_uuid))
      .toEqual(expectedAction);
  });
});
