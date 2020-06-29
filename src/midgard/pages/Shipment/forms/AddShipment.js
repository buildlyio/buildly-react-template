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
}));

function getSteps() {
  return [
    "Shipment Details",
    "Custodians",
    "Items",
    "Sensors & Gateways",
    "Shipment Overview",
  ];
}

const getStepContent = (
  stepIndex,
  props,
  handleNext,
  handleBack,
  maxSteps,
  handleSubmit,
  handleSaveAndClose
) => {
  switch (stepIndex) {
    case 0:
      return (
        <ViewDetailsWrapper
          {...props}
          handleNext={handleNext}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          handleSaveAndClose={handleSaveAndClose}
          nextButtonText={"Add Custodians"}
          title={"Custodians"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <ShipmentInfo
            {...props}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </ViewDetailsWrapper>
      );
    case 1:
      return (
        <ViewDetailsWrapper
          {...props}
          handleNext={handleNext}
          handleBack={handleBack}
          nextButtonText={"Add Items"}
          title={"Custodians"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <Custodians
            noSearch={true}
            history={props.history}
            redirectTo={`${routes.SHIPMENT}/add`}
          />
        </ViewDetailsWrapper>
      );
    case 2:
      return (
        <ViewDetailsWrapper
          {...props}
          handleNext={handleNext}
          handleBack={handleBack}
          nextButtonText={"Add Sensors & Gateways"}
          title={"Items"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <Items
            noSearch={true}
            history={props.history}
            redirectTo={`${routes.SHIPMENT}/add`}
          />
        </ViewDetailsWrapper>
      );
    case 3:
      return (
        <ViewDetailsWrapper
          {...props}
          handleNext={handleNext}
          handleBack={handleBack}
          nextButtonText={"Shipment Overview"}
          title={"Gateways & Sensors"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <SensorsGateway
            noSearch={true}
            history={props.history}
            redirectTo={`${routes.SHIPMENT}/add`}
          />
        </ViewDetailsWrapper>
      );
    case 4:
      return (
        <ViewDetailsWrapper
          {...props}
          handleNext={handleNext}
          handleBack={handleBack}
          nextButtonText={"Save & Finish"}
          title={"Shipment Overview"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <ShipmentOverview {...props} />
        </ViewDetailsWrapper>
      );

    default:
      return "Unknown stepIndex";
  }
};

export default function AddShipment(props) {
  const { location, history, shipmentFormData, dispatch } = props;
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [openModal, toggleModal] = useState(true);
  const steps = getSteps();
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const closeModal = () => {
    toggleModal(false);
    if (location && location.state) {
      history.push(location.state.from);
    }
  };

  const handleSubmit = () => {};

  const handleSaveAndClose = () => {};

  return (
    <div>
      {openModal && (
        <Modal
          open={openModal}
          setOpen={closeModal}
          title={"Add Shipment"}
          titleClass={classes.formTitle}
          maxWidth={"md"}
        >
          <div className={classes.root}>
            <Hidden xsDown>
              <Grid container alignItems="center" justify="center">
                {activeStep > 0 && (
                  <Grid item xs={6} sm={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleBack}
                      className={classes.submit}
                    >
                      {"Back"}
                    </Button>
                  </Grid>
                )}
                <Grid item sm={10}>
                  <Stepper activeStep={activeStep} alternativeLabel nonLinear>
                    {steps.map((label) => (
                      <Step key={label}>
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
                  handleSubmit,
                  handleSaveAndClose
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
