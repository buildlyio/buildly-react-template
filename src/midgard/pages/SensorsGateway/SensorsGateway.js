import React from "react";
import { connect } from "react-redux";
import Gateway from "./Gateway/Gateway";

function SensorsGateway(props) {
  const { gatewayData, gatewaySearchedData } = props;
  return (
    <Gateway data={gatewayData} searchData={gatewaySearchedData} {...props} />
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
});

export default connect(mapStateToProps)(SensorsGateway);
