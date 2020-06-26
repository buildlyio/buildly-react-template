import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";

function CustodianInfo(props) {
  const {
    gatewayData,
    gatewaySearchedData,
    sensorData,
    sensorSearchedData,
    handleBack,
    handleNext,
  } = props;
  return (
    <React.Fragment>
      <div>Hello</div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          // className={classes.button}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          // className={classes.button}
        >
          Add Items
        </Button>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(CustodianInfo);
