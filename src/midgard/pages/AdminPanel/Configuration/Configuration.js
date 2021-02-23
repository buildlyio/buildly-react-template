import React from "react";
import { connect } from "react-redux";
import CustodianType from "./components/CustodianType";
import GatewayType from "./components/GatewayType";
import ItemType from "./components/ItemType";

const Configuration = (props) => {
  return (
    <React.Fragment>
      <CustodianType {...props} />
      <GatewayType {...props} />
      <ItemType {...props} />
    </React.Fragment>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(Configuration);
