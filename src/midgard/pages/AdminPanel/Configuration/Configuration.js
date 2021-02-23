import React from "react";
import { connect } from "react-redux";
import CustodianType from "./components/CustodianType";
import GatewayType from "./components/GatewayType";

const Configuration = (props) => {
  return (
    <React.Fragment>
      <CustodianType {...props} />
      <GatewayType {...props} />
    </React.Fragment>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(Configuration);
