import * as actions from "./sensorsGateway.actions";
describe("actions", () => {
  it("should create an action to get Gateway", () => {
    const expectedAction = {
      type: actions.GET_GATEWAYS,
    };
    expect(actions.getGateways()).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to add Gateway", () => {
    const payload = { id: 123, name: "Abc" };
    const history = undefined;
    const redirectTo = undefined;
    const expectedAction = {
      type: actions.ADD_GATEWAY,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addGateway(payload, history)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to update Gateway", () => {
    const payload = { id: 123 };
    const history = undefined;
    const redirectTo = undefined;
    const expectedAction = {
      type: actions.EDIT_GATEWAY,
      payload,
      history,
      redirectTo,
    };
    expect(actions.editGateway(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete Gateway", () => {
    const gatewayId = "123";
    const expectedAction = {
      type: actions.DELETE_GATEWAY,
      gatewayId,
    };
    expect(actions.deleteGateway(gatewayId)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to search Gateway", () => {
    const searchItem = "abc";
    const searchList = [{ id: "123", name: "abc" }];
    const expectedAction = {
      type: actions.GATEWAY_SEARCH,
      searchItem,
      searchList,
    };
    expect(actions.searchGatewayItem(searchItem, searchList)).toEqual(
      expectedAction
    );
  });
});

describe("actions", () => {
  it("should create an action to get Gateway type", () => {
    const expectedAction = {
      type: actions.GET_GATEWAYS_TYPE,
    };
    expect(actions.getGatewayType()).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to get Sensor", () => {
    const expectedAction = {
      type: actions.GET_SENSORS,
    };
    expect(actions.getSensors()).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to add Sensor", () => {
    const payload = { id: 123, name: "Abc" };
    const history = undefined;
    const redirectTo = undefined;
    const expectedAction = {
      type: actions.Add_SENSOR,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addSensor(payload, history)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to update Sensor", () => {
    const payload = { id: 123 };
    const history = undefined;
    const redirectTo = undefined;
    const expectedAction = {
      type: actions.EDIT_SENSOR,
      payload,
      history,
      redirectTo,
    };
    expect(actions.editSensor(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete Sensor", () => {
    const sensorId = "123";
    const expectedAction = {
      type: actions.DELETE_SENSOR,
      sensorId,
    };
    expect(actions.deleteSensor(sensorId)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to search Sensor", () => {
    const searchItem = "abc";
    const searchList = [{ id: "123", name: "abc" }];
    const expectedAction = {
      type: actions.SENSOR_SEARCH,
      searchItem,
      searchList,
    };
    expect(actions.searchSensorItem(searchItem, searchList)).toEqual(
      expectedAction
    );
  });
});

describe("actions", () => {
  it("should create an action to get Sensor type", () => {
    const expectedAction = {
      type: actions.GET_SENSORS_TYPE,
    };
    expect(actions.getSensorType()).toEqual(expectedAction);
  });
});
