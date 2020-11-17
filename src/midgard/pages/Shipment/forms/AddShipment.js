import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Modal from "../../../components/Modal/Modal";
import ShipmentInfo from "../components/ShipmentInfo";
import { Hidden, Grid } from "@material-ui/core";
import MobileStepper from "@material-ui/core/MobileStepper";
import { dispatch } from "../../../redux/store";
import ViewDetailsWrapper from "../components/ViewDetailsWrapper";
import Custodians from "../../Custodians/Custodians";
import Items from "../../Items/Items";
import { routes } from "../../../routes/routesConstants";
import SensorsGateway from "../../SensorsGateway/SensorsGateway";
import ShipmentOverview from "../components/ShipmentOverview";
import ItemsInfo from "../components/ItemInfo";
import { saveShipmentFormData } from "../../../redux/shipment/actions/shipment.actions";
import { connect } from "react-redux";
import SensorsGatewayInfo from "../components/Sensors&GatewayInfo";
import EnvironmentalLimitsInfo from "../components/EnvironmentalLimitsInfo";
import CustodianInfo from "../components/custodian-info/CustodianInfo";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  submit: {
    borderRadius: "18px",
    fontSize: 11,
  },
  formTitle: {
    fontWeight: "bold",
    marginTop: "1em",
    textAlign: "center",
  },
  step: {
    cursor: "pointer",
  },
}));

function getSteps() {
  return [
    "Shipment Details",
    "Items",
    "Custodians",
    "Sensors & Gateways",
    // "Shipment Overview",
    "Environmental Limits",
  ];
}

const getStepContent = (
  stepIndex,
  props,
  handleNext,
  handleBack,
  maxSteps,
  handleCancel
) => {
  switch (stepIndex) {
    case 0:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title={"Shipment Details"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <ShipmentInfo
            {...props}
            location={props.location}
            handleNext={handleNext}
            handleBack={handleBack}
            handleCancel={handleCancel}
            redirectTo={`${routes.SHIPMENT}`}
          />
        </ViewDetailsWrapper>
      );
    case 1:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title={"Items"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <ItemsInfo
            {...props}
            history={props.history}
            redirectTo={`${routes.SHIPMENT}/add`}
            handleNext={handleNext}
            handleCancel={handleCancel}
          />
        </ViewDetailsWrapper>
      );
    case 2:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title={"Custodians"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <CustodianInfo
            {...props}
            history={props.history}
            redirectTo={`${routes.SHIPMENT}/add`}
            handleNext={handleNext}
            handleCancel={handleCancel}
          />
        </ViewDetailsWrapper>
      );

    case 3:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title={"Sensors & Gateways"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <SensorsGatewayInfo
            {...props}
            history={props.history}
            redirectTo={`${routes.SHIPMENT}/add`}
            handleNext={handleNext}
            handleCancel={handleCancel}
          />
        </ViewDetailsWrapper>
      );
    case 4:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title={"Environmental Limits"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <EnvironmentalLimitsInfo
            {...props}
            history={props.history}
            redirectTo={`${routes.SHIPMENT}/add`}
            handleNext={handleNext}
            handleCancel={handleCancel}
          />
        </ViewDetailsWrapper>
      );
    // case 4:
    //   return (
    //     <ViewDetailsWrapper
    //       {...props}
    //       handleNext={handleNext}
    //       handleBack={handleBack}
    //       nextButtonText={"Save & Finish"}
    //       title={"Shipment Overview"}
    //       maxSteps={maxSteps}
    //       activeStep={stepIndex}
    //     >
    //       <ShipmentOverview {...props} />
    //     </ViewDetailsWrapper>
    //   );

    default:
      return "Unknown stepIndex";
  }
};

function AddShipment(props) {
  const { location, history, shipmentFormData, dispatch } = props;
  const editPage = location.state && location.state.type === "edit";
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [openModal, toggleModal] = useState(true);
  const steps = getSteps();
  const maxSteps = steps.length;
  const formTitle = editPage ? "Edit Shipment" : "Add Shipment";

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    if (shipmentFormData !== null) {
      setActiveStep(step);
    }
  };

  const closeModal = () => {
    toggleModal(false);
    dispatch(saveShipmentFormData(null));
    history.push(routes.SHIPMENT);
  };

  const handleCancel = () => {
    dispatch(saveShipmentFormData(null));
    history.push(`${routes.SHIPMENT}`);
  };

  return (
    <div>
      {openModal && (
        <Modal
          open={openModal}
          setOpen={closeModal}
          title={formTitle}
          titleClass={classes.formTitle}
          maxWidth={"md"}
        >
          <div className={classes.root}>
            <Hidden xsDown>
              <Grid container alignItems="center" justify="center">
                <Grid item sm={10}>
                  <Stepper activeStep={activeStep} alternativeLabel nonLinear>
                    {steps.map((label, index) => (
                      <Step
                        key={`step${index}:${label}`}
                        className={`${
                          shipmentFormData !== null && classes.step
                        }`}
                        onClick={handleStep(index)}
                      >
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
              </Grid>
            </Hidden>

            <div>
              <div>
                {getStepContent(
                  activeStep,
                  props,
                  handleNext,
                  handleBack,
                  maxSteps,
                  handleCancel
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(AddShipment);
