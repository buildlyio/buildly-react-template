import * as actions from '../actions/devpartner.actions';
import * as reducer from './devpartner.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  devTeams: [],
  timesheets: [],
  timesheetHours: [],
};

describe('Get all dev teams reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_DEV_TEAMS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get all dev teams success reducer', () => {
    const data = [{
      devteam_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    }];

    expect(reducer.default(
      initialState,
      { type: actions.ALL_DEV_TEAMS_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      devTeams: data,
    });
  });

  it('get all dev teams fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_DEV_TEAMS_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get a dev team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DEV_TEAM },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get a dev team success reducer', () => {
    const data = {
      devteam_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.GET_DEV_TEAM_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      devTeams: [data],
    });
  });

  it('get a dev team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DEV_TEAM_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Create a dev team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_DEV_TEAM },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('create a dev team success reducer', () => {
    const data = {
      devteam_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.CREATE_DEV_TEAM_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      devTeams: [data],
    });
  });

  it('create a dev team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_DEV_TEAM_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Update a dev team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_DEV_TEAM },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update a dev team success reducer', () => {
    const data = {
      devteam_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };
    const editedData = {
      devteam_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Edited',
    };

    expect(reducer.default(
      { ...initialState, devTeams: [data] },
      { type: actions.UPDATE_DEV_TEAM_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      devTeams: [editedData],
    });
  });

  it('update a dev team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_DEV_TEAM_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Delete a dev team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_DEV_TEAM },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete a dev team success reducer', () => {
    const data = {
      devteam_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      { ...initialState, devTeams: [data] },
      {
        type: actions.DELETE_DEV_TEAM_SUCCESS,
        devteam_uuid: data.devteam_uuid,
      },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      devTeams: [],
    });
  });

  it('delete a dev team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_DEV_TEAM_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get all timesheet hours reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_TIMESHEET_HOURS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get all timesheet hours success reducer', () => {
    const data = [{
      timesheethour_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    }];

    expect(reducer.default(
      initialState,
      { type: actions.ALL_TIMESHEET_HOURS_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      timesheetHours: data,
    });
  });

  it('get all timesheet hours fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_TIMESHEET_HOURS_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get a timesheet hour reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEET_HOUR },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get a timesheet hour success reducer', () => {
    const data = {
      timesheethour_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEET_HOUR_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      timesheetHours: [data],
    });
  });

  it('get a timesheet hour fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEET_HOUR_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Create a timesheet hour reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_TIMESHEET_HOUR },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('create a timesheet hour success reducer', () => {
    const data = {
      timesheethour_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.CREATE_TIMESHEET_HOUR_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      timesheetHours: [data],
    });
  });

  it('create a timesheet hour fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_TIMESHEET_HOUR_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Update a timesheet hour reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_TIMESHEET_HOUR },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update a timesheet hour success reducer', () => {
    const data = {
      timesheethour_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };
    const editedData = {
      timesheethour_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Edited',
    };

    expect(reducer.default(
      { ...initialState, timesheetHours: [data] },
      { type: actions.UPDATE_TIMESHEET_HOUR_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      timesheetHours: [editedData],
    });
  });

  it('update a timesheet hour fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_TIMESHEET_HOUR_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Delete a timesheet hour reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_TIMESHEET_HOUR },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete a timesheet hour success reducer', () => {
    const data = {
      timesheethour_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      { ...initialState, timesheetHours: [data] },
      {
        type: actions.DELETE_TIMESHEET_HOUR_SUCCESS,
        timesheethour_uuid: data.timesheethour_uuid,
      },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      timesheetHours: [],
    });
  });

  it('delete a timesheet hour fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_TIMESHEET_HOUR_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get all timesheets reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_TIMESHEETS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get all timesheets success reducer', () => {
    const data = [{
      timesheet_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    }];

    expect(reducer.default(
      initialState,
      { type: actions.ALL_TIMESHEETS_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      timesheets: data,
    });
  });

  it('get all timesheets fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ALL_TIMESHEETS_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Get a timesheet reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEET },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get a timesheet success reducer', () => {
    const data = {
      timesheet_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEET_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      timesheets: [data],
    });
  });

  it('get a timesheet fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEET_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Create a timesheet reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_TIMESHEET },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('create a timesheet success reducer', () => {
    const data = {
      timesheet_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      initialState,
      { type: actions.CREATE_TIMESHEET_SUCCESS, data },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      timesheets: [data],
    });
  });

  it('create a timesheet fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_TIMESHEET_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Update a timesheet reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_TIMESHEET },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update a timesheet success reducer', () => {
    const data = {
      timesheet_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };
    const editedData = {
      timesheet_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test Edited',
    };

    expect(reducer.default(
      { ...initialState, timesheets: [data] },
      { type: actions.UPDATE_TIMESHEET_SUCCESS, data: editedData },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      timesheets: [editedData],
    });
  });

  it('update a timesheet fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_TIMESHEET_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});

describe('Delete a timesheet reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_TIMESHEET },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete a timesheet success reducer', () => {
    const data = {
      timesheet_uuid: 'kfhwue-y38wgws-3i2wfhv-84gheu',
      name: 'Test',
    };

    expect(reducer.default(
      { ...initialState, timesheets: [data] },
      {
        type: actions.DELETE_TIMESHEET_SUCCESS,
        timesheet_uuid: data.timesheet_uuid,
      },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      timesheets: [],
    });
  });

  it('delete a timesheet fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_TIMESHEET_FAILURE },
    )).toEqual({
      ...initialState,
      loading: false,
      loaded: true,
      error: undefined,
    });
  });
});
