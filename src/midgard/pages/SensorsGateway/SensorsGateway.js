import React from "react";
import { connect } from "react-redux";
import Gateway from "./Gateway/Gateway";
import Sensors from "./Sensors/Sensors";

function SensorsGateway(props) {
  const {
    gatewayData,
    gatewaySearchedData,
    sensorData,
    sensorSearchedData,
    gatewayOptions,
    sensorOptions,
    shipmentData,
  } = props;
  return (
    <React.Fragment>
      <Gateway data={gatewayData} searchData={gatewaySearchedData} {...props} />
      <Sensors data={sensorData} searchData={sensorSearchedData} {...props} />
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(SensorsGateway);
