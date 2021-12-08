import * as actions from './devpartner.actions';

// Test Get Dev Teams
describe('Get Dev Team action', () => {
  it('should create an action to get dev team', () => {
    const organization_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_DEVTEAMS,
      organization_uuid,
    };
    expect(actions.getDevTeams(organization_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Dev Team
describe('Add Dev Team action', () => {
  it('should create an action to add dev team', () => {
    const payload = { dev_team_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_DEVTEAM,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addDevTeam(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Dev Team
describe('Edit Dev team action', () => {
  it('should create an action to edit dev team', () => {
    const payload = { dev_team_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_DEVTEAM,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateDevTeam(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Dev team
describe('Delete Dev team action', () => {
  it('should create an action to delete dev team', () => {
    const dev_team_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_DEVTEAM,
      dev_team_uuid,
    };
    expect(actions.deleteDevTeam(
      dev_team_uuid,
    )).toEqual(expectedAction);
  });
});

// Test Get Timesheets
describe('Get Timesheet action', () => {
  it('should create an action to get timesheet', () => {
    const project_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_TIMESHEETS,
      project_uuid,
    };
    expect(actions.getTimesheets(project_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Timesheet
describe('Add Timesheet action', () => {
  it('should create an action to add timesheet', () => {
    const payload = { timesheet_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_TIMESHEET,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addTimesheet(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Timesheet
describe('Edit Timesheet action', () => {
  it('should create an action to edit timesheet', () => {
    const payload = { timesheet_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_TIMESHEET,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateTimesheet(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Timesheet
describe('Delete Timesheet action', () => {
  it('should create an action to delete timesheet', () => {
    const timesheet_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_TIMESHEET,
      timesheet_uuid,
    };
    expect(actions.deleteTimesheet(
      timesheet_uuid,
    )).toEqual(expectedAction);
  });
});

// Test Get Timesheet hours
describe('Get Timesheet hour action', () => {
  it('should create an action to get timesheet hour', () => {
    const timesheet_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_TIMESHEET_HOURS,
      timesheet_uuid,
    };
    expect(actions.getTimesheet_hours(timesheet_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Timesheet hour
describe('Add Timesheet hour action', () => {
  it('should create an action to add timesheet hour', () => {
    const payload = { timesheet_hour_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21', name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_TIMESHEET_HOUR,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addTimesheet_hour(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Timesheet hour
describe('Edit Timesheet hour action', () => {
  it('should create an action to edit timesheet hour', () => {
    const payload = { timesheet_hour_uuid: '224761f5-0010-4a46-ba2f-d92a4fdc1d21' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.UPDATE_TIMESHEET_HOUR,
      payload,
      history,
      redirectTo,
    };
    expect(actions.updateTimesheet_hour(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Timesheet hour
describe('Delete Timesheet hour action', () => {
  it('should create an action to delete timesheet hour', () => {
    const timesheet_hour_uuid = '224761f5-0010-4a46-ba2f-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_TIMESHEET_HOUR,
      timesheet_hour_uuid,
    };
    expect(actions.deleteTimesheet_hour(
      timesheet_hour_uuid,
    )).toEqual(expectedAction);
  });
});
