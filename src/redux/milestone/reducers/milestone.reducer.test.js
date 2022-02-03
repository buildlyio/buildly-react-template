import * as actions from '../actions/milestone.actions';
import * as reducer from './milestone.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  repositories: [],
  milestones: [],
  milestoneHeadings: [],
};

describe('get repositories reducer', () => {
  it('is empty', () => {
    expect(reducer.default(initialState, { type: actions.GET_REPOSITORIES })).toEqual({
      loading: true,
      loaded: false,
      error: null,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });

  it('is successful', () => {
    const data = [
      {
        name: 'repo-1',
      },
    ];

    expect(reducer.default(initialState, { type: actions.GET_REPOSITORIES_SUCCESS, data }))
      .toEqual({
        loading: false,
        loaded: true,
        error: null,
        repositories: ['repo-1'],
        milestones: [],
        milestoneHeadings: [],
      });
  });

  it('failed', () => {
    expect(reducer.default(initialState, { type: actions.GET_REPOSITORIES_FAIL })).toEqual({
      loading: false,
      loaded: true,
      error: undefined,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });
});

describe('get milestones reducer', () => {
  it('is empty', () => {
    expect(reducer.default(initialState, { type: actions.GET_MILESTONES })).toEqual({
      loading: true,
      loaded: false,
      error: null,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });

  it('is successful', () => {
    const data = {
      milestones: [
        {
          title: 'milestone-1',
        },
      ],
    };

    expect(reducer.default(initialState, { type: actions.GET_MILESTONES_SUCCESS, data })).toEqual({
      loading: false,
      loaded: true,
      error: null,
      repositories: [],
      milestones: [
        {
          title: 'milestone-1',
        },
      ],
      milestoneHeadings: ['milestone-1'],
    });
  });

  it('failed', () => {
    expect(reducer.default(initialState, { type: actions.GET_MILESTONES_FAIL })).toEqual({
      loading: false,
      loaded: true,
      error: undefined,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });
});

describe('clear milestones reducer', () => {
  it('is empty', () => {
    expect(reducer.default(initialState, { type: actions.CLEAR_MILESTONES })).toEqual({
      loading: true,
      loaded: false,
      error: null,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });

  it('is successful', () => {
    expect(reducer.default({
      ...initialState,
      milestones: [
        {
          title: 'milestone-1',
        },
      ],
    }, { type: actions.CLEAR_MILESTONES_SUCCESS })).toEqual({
      loading: false,
      loaded: true,
      error: null,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });

  it('failed', () => {
    expect(reducer.default(initialState, { type: actions.CLEAR_MILESTONES_FAIL })).toEqual({
      loading: false,
      loaded: true,
      error: undefined,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });
});

describe('clear milestone headings reducer', () => {
  it('is empty', () => {
    expect(reducer.default(initialState, { type: actions.CLEAR_MILESTONES_HEADINGS })).toEqual({
      loading: true,
      loaded: false,
      error: null,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });

  it('is successful', () => {
    expect(reducer.default({
      ...initialState,
      milestoneHeadings: [
        'milestone-1',
      ],
    }, { type: actions.CLEAR_MILESTONES_HEADINGS_SUCCESS })).toEqual({
      loading: false,
      loaded: true,
      error: null,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });

  it('failed', () => {
    expect(reducer.default(initialState, { type: actions.CLEAR_MILESTONES_HEADINGS_FAIL }))
      .toEqual({
        loading: false,
        loaded: true,
        error: undefined,
        repositories: [],
        milestones: [],
        milestoneHeadings: [],
      });
  });
});

describe('create milestone reducer', () => {
  it('is empty', () => {
    expect(reducer.default(initialState, { type: actions.CREATE_MILESTONE })).toEqual({
      loading: true,
      loaded: false,
      error: null,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });

  it('is successful', () => {
    expect(reducer.default(initialState, { type: actions.CREATE_MILESTONE_SUCCESS })).toEqual({
      loading: false,
      loaded: true,
      error: null,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });

  it('failed', () => {
    expect(reducer.default(initialState, { type: actions.CREATE_MILESTONE_FAIL })).toEqual({
      loading: false,
      loaded: true,
      error: undefined,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });
});

describe('delete milestone reducer', () => {
  it('is empty', () => {
    expect(reducer.default(initialState, { type: actions.DELETE_MILESTONE })).toEqual({
      loading: true,
      loaded: false,
      error: null,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });

  it('is successful', () => {
    const data = {
      number: 1,
    };

    expect(reducer.default({
      ...initialState,
      milestones: [
        {
          title: 'milestone-1',
          number: 1,
        },
      ],
    }, { type: actions.DELETE_MILESTONE_SUCCESS, data })).toEqual({
      loading: false,
      loaded: true,
      error: null,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });

  it('failed', () => {
    expect(reducer.default(initialState, { type: actions.DELETE_MILESTONE_FAIL })).toEqual({
      loading: false,
      loaded: true,
      error: undefined,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });
});

describe('update milestone reducer', () => {
  it('is empty', () => {
    expect(reducer.default(initialState, { type: actions.UPDATE_MILESTONE })).toEqual({
      loading: true,
      loaded: false,
      error: null,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });

  it('is successful', () => {
    const data = {
      milestone: {
        data: {
          number: 1,
          title: 'milestone-1-edited',
        },
      },
    };

    expect(reducer.default({
      ...initialState,
      milestones: [
        {
          title: 'milestone-1',
          number: 1,
        },
      ],
    }, { type: actions.UPDATE_MILESTONE_SUCCESS, data })).toEqual({
      loading: false,
      loaded: true,
      error: null,
      repositories: [],
      milestones: [
        {
          title: 'milestone-1-edited',
          number: 1,
        },
      ],
      milestoneHeadings: [
        'milestone-1-edited',
      ],
    });
  });

  it('failed', () => {
    expect(reducer.default(initialState, { type: actions.DELETE_MILESTONE_FAIL })).toEqual({
      loading: false,
      loaded: true,
      error: undefined,
      repositories: [],
      milestones: [],
      milestoneHeadings: [],
    });
  });
});
