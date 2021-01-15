import * as actions from "midgard/redux/alert/actions/alert.actions";
import * as reducer from "./alert.reducer";
const initialState = {
  data: null,
};
describe("Show Alert reducer", () => {
  it("show alert Reducer", () => {
    expect(reducer.default([], { type: actions.SHOW_ALERT })).toEqual({
      data: undefined,
    });
  });
});

describe("Hide alert reducer", () => {
  it("hide alert∂ Reducer", () => {
    expect(reducer.default(initialState, { type: actions.HIDE_ALERT })).toEqual(
      initialState
    );
  });
});
