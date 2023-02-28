import * as actions from '../actions/alert.actions';
import * as reducer from './alert.reducer';

const initialState = {
  data: null,
};

// Test Alert Reducer
describe('Show Alert reducer', () => {
  it('should update redux state with action data for show alert',
    () => {
      const action = {
        type: actions.SHOW_ALERT,
        data: {
          type: 'success',
          open: true,
          message: 'Success message to be shown.',
        },
      };

      expect(reducer.default(initialState, action))
        .toEqual({
          data: {
            type: 'success',
            open: true,
            message: 'Success message to be shown.',
          },
        });
    });
});

describe('Hide alert reducer', () => {
  it('should update redux state to remove data for hide alert ',
    () => {
      const action = { type: actions.HIDE_ALERT };
      expect(reducer.default(initialState, action))
        .toEqual(initialState);
    });
});
