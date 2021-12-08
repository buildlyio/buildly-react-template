import * as actions from '../actions/devpartner.actions';
import * as reducer from './devpartner.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  devTeam: null,
  timesheet: null,
  timesheet_hour: null,
};

describe('Get dev team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DEVTEAMS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get dev team success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DEVTEAMS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      devTeam: undefined,
    });
  });

  it('get dev team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_DEVTEAMS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add dev team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_DEVTEAM },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add dev team success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_DEVTEAM_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      devTeam: undefined,
    });
  });

  it('add dev team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_DEVTEAM_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update dev team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_DEVTEAM },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update dev team success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_DEVTEAM_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      devTeam: undefined,
    });
  });

  it('update dev team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_DEVTEAM_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete dev team reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_DEVTEAM },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete dev team success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_DEVTEAM_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      devTeam: undefined,
    });
  });

  it('delete dev team fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_DEVTEAM_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get timesheet reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEETS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get timesheet success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEETS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      timesheet: undefined,
    });
  });

  it('get timesheet fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEETS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add timesheet reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_TIMESHEET },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add timesheet success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_TIMESHEET_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      timesheet: undefined,
    });
  });

  it('add timesheet fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_TIMESHEET_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update timesheet reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_TIMESHEET },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update timesheet success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_TIMESHEET_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      timesheet: undefined,
    });
  });

  it('update timesheet fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_TIMESHEET_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete timesheet reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_TIMESHEET },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete timesheet success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_TIMESHEET_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      timesheet: undefined,
    });
  });

  it('delete timesheet fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_TIMESHEET_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get timesheet hour reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEET_HOURS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get timesheet hour success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEET_HOURS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      timesheet_hour: undefined,
    });
  });

  it('get timesheet hour fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_TIMESHEET_HOURS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add timesheet hour reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_TIMESHEET_HOUR },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('add timesheet hour success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_TIMESHEET_HOUR_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      timesheet_hour: undefined,
    });
  });

  it('add timesheet hour fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_TIMESHEET_HOUR_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Update timesheet hour reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_TIMESHEET_HOUR },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('update timesheet hour success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_TIMESHEET_HOUR_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      timesheet_hour: undefined,
    });
  });

  it('update timesheet hour fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.UPDATE_TIMESHEET_HOUR_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete timesheet hour reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_TIMESHEET_HOUR },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('delete timesheet hour success reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_TIMESHEET_HOUR_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      timesheet_hour: undefined,
    });
  });

  it('delete timesheethour fail reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_TIMESHEET_HOUR_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
