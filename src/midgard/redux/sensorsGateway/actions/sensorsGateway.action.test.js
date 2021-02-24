import * as actions from "./sensorsGateway.actions";
describe("actions", () => {
  it("should create an action to get Gateway by organization", () => {
    const organization_uuid = "224761f5-0010-4a46-ba2f-d92a4fdc1d21";
    const expectedAction = {
      type: actions.GET_GATEWAYS,
      organization_uuid,
    };
    expect(actions.getGateways(organization_uuid)).toEqual(expectedAction);
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
    const organization_uuid = "224761f5-0010-4a46-ba2f-d92a4fdc1d21";
    const expectedAction = {
      type: actions.DELETE_GATEWAY,
      gatewayId,
      organization_uuid,
    };
    expect(actions.deleteGateway(gatewayId, organization_uuid)).toEqual(expectedAction);
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
  it("should create an action to get Sensor by organization", () => {
    const organization_uuid = "224761f5-0010-4a46-ba2f-d92a4fdc1d21";
    const expectedAction = {
      type: actions.GET_SENSORS,
      organization_uuid,
    };
    expect(actions.getSensors(organization_uuid)).toEqual(expectedAction);
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
    const organization_uuid = "224761f5-0010-4a46-ba2f-d92a4fdc1d21";
    const expectedAction = {
      type: actions.DELETE_SENSOR,
      sensorId,
      organization_uuid,
    };
    expect(actions.deleteSensor(sensorId, organization_uuid)).toEqual(expectedAction);
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

describe("actions", () => {
  it("should create an action to add Gateway type", () => {
    const payload = { name: "test gateway" };
    const expectedAction = {
      type: actions.ADD_GATEWAYS_TYPE,
      payload,
    };
    expect(actions.addGatewayType(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to edit Gateway type", () => {
    const payload = { name: "test gateway - edited" };
    const expectedAction = {
      type: actions.EDIT_GATEWAYS_TYPE,
      payload,
    };
    expect(actions.editGatewayType(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete Gateway type", () => {
    const id = 1;
    const expectedAction = {
      type: actions.DELETE_GATEWAYS_TYPE,
      id,
    };
    expect(actions.deleteGatewayType(id)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to add Sensor type", () => {
    const payload = { name: "test sensor" };
    const expectedAction = {
      type: actions.ADD_SENSORS_TYPE,
      payload,
    };
    expect(actions.addSensorType(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to edit Sensor type", () => {
    const payload = { name: "test sensor - edited" };
    const expectedAction = {
      type: actions.EDIT_SENSORS_TYPE,
      payload,
    };
    expect(actions.editSensorType(payload)).toEqual(expectedAction);
  });
});

describe("actions", () => {
  it("should create an action to delete Sensor type", () => {
    const id = 1;
    const expectedAction = {
      type: actions.DELETE_SENSORS_TYPE,
      id,
    };
    expect(actions.deleteSensorType(id)).toEqual(expectedAction);
  });
});