import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Modal from "../../../components/Modal/Modal";
import ShipmentInfo from "../components/ShipmentInfo";
import CustodianInfo from "../components/CustodianInfo";
import { Hidden } from "@material-ui/core";
import MobileStepper from "@material-ui/core/MobileStepper";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { dispatch } from "../../../redux/store";

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
    "SHipment Overview",
  ];
}

const getStepContent = (stepIndex, props, handleNext, handleBack) => {
  switch (stepIndex) {
    case 0:
      return (
        <ShipmentInfo
          {...props}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      );
    case 1:
      return (
        <CustodianInfo
          {...props}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      );
    case 2:
      return "This is the bit I really care about!";
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
            <Hidden smDown>
              <Stepper activeStep={activeStep} nonLinear>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Hidden>

            <div>
              <div>
                {getStepContent(activeStep, props, handleNext, handleBack)}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
