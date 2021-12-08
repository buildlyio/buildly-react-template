import React, { useState, useContext } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import {
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  Hidden,
  Grid,
} from "@material-ui/core";
import FormModal from "@components/Modal/FormModal";
import { UserContext } from "@context/User.context";
import { routes } from "@routes/routesConstants";
// import { checkForGlobalAdmin } from "@utils/utilMethods";
import ViewDetailsWrapper from "../components/ViewDetailsWrapper";
import ProjectSetup, {
  checkIfProjectSetupEdited,
} from "../components/ProjectSetup";
import ApplicationMarket, {
  checkIfApplicationMarketEdited,
} from "../components/ApplicationMarket";
import BudgetTechnology, {
  checkIfBudgetTechnologyEdited,
} from "../components/BudgetTechnology";
import TeamUser, { checkIfTeamUserEdited } from "../components/TeamUser";
import UsersInfo from "../components/UsersInfo";
import MinimalFunctionality from "../components/MinimalFunctionality";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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

const getSteps = () => [
  "New Project Setup",
  "Application & Market",
  "Budget & Technology",
  "Team & Users",
  "Users Information",
  "Minimal Functionality",
];

const getStepContent = (
  stepIndex,
  props,
  // viewOnly,
  handleNext,
  handleBack,
  maxSteps,
  handleCancel,
  setConfirmModal,
  setConfirmModalFor
) => {
  switch (stepIndex) {
    case 0:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="New Project Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <ProjectSetup
            {...props}
            // viewOnly={viewOnly}
            location={props.location}
            handleNext={handleNext}
            handleCancel={handleCancel}
          />
        </ViewDetailsWrapper>
      );

    case 1:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="New Project Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <ApplicationMarket
            {...props}
            // viewOnly={viewOnly}
            location={props.location}
            handleNext={handleNext}
            handleBack={handleBack}
            handleCancel={handleCancel}
          />
        </ViewDetailsWrapper>
      );

    case 2:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="New Project Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <BudgetTechnology
            {...props}
            // viewOnly={viewOnly}
            location={props.location}
            handleNext={handleNext}
            handleBack={handleBack}
            handleCancel={handleCancel}
          />
        </ViewDetailsWrapper>
      );

    case 3:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="New Project Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <TeamUser
            {...props}
            // viewOnly={viewOnly}
            location={props.location}
            handleNext={handleNext}
            handleBack={handleBack}
            handleCancel={handleCancel}
          />
        </ViewDetailsWrapper>
      );

    case 4:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="New Project Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <UsersInfo
            {...props}
            // viewOnly={viewOnly}
            location={props.location}
            handleNext={handleNext}
            handleBack={handleBack}
            handleCancel={handleCancel}
          />
        </ViewDetailsWrapper>
      );

    case 5:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="New Project Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <MinimalFunctionality
            {...props}
            // viewOnly={viewOnly}
            location={props.location}
            handleBack={handleBack}
            handleCancel={handleCancel}
          />
        </ViewDetailsWrapper>
      );

    default:
      return "Unknown stepIndex";
  }
};

const NewProjectForm = (props) => {
  const { location, history, shipmentFormData, dispatch } = props;
  const classes = useStyles();
  const user = useContext(UserContext);

  const editPage = location.state && location.state.type === "edit";
  const editData = location.state && location.state.data;
  // For non-admins the forms becomes view-only once the shipment status is no longer just planned
  // const viewOnly =
  //   !checkForGlobalAdmin(user) &&
  //   editPage &&
  //   editData &&
  //   editData.status &&
  //   _.lowerCase(editData.status) !== "planned";

  const [activeStep, setActiveStep] = React.useState(0);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [confirmModalFor, setConfirmModalFor] = useState("");

  const steps = getSteps();
  const maxSteps = steps.length;

  // let formTitle;
  // if (!editPage) {
  //   formTitle = "Add Shipment";
  // } else if (viewOnly) {
  //   formTitle = "View Shipment";
  // } else {
  //   formTitle = "Edit Shipment";
  // }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
    // if (checkIfFormEdited(activeStep)) {
    //   setConfirmModalFor(`step-${step}`);
    //   setConfirmModal(true);
    // } else {
    //   handleConfirmModal();
    // }
  };

  // const closeModal = () => {
  //   if (checkIfFormEdited(activeStep)) {
  //     setConfirmModalFor("close");
  //     setConfirmModal(true);
  //   } else {
  //     setFormModal(false);
  //     dispatch(saveShipmentFormData(null));
  //     history.push(routes.SHIPMENT);
  //   }
  // };

  const handleCancel = () => {
    if (checkIfFormEdited(activeStep)) {
      // setConfirmModalFor("close");
      // setConfirmModal(true);
    } else {
      // dispatch(saveShipmentFormData(null));
      // history.push(routes.SHIPMENT);
    }
  };

  // const handleConfirmModal = () => {
  //   setConfirmModal(false);
  //   if (confirmModalFor === "close") {
  //     dispatch(saveShipmentFormData(null));
  //     history.push(routes.SHIPMENT);
  //   } else if (confirmModalFor === "next") {
  //     handleNext();
  //   } else if (confirmModalFor.includes("step")) {
  //     // eslint-disable-next-line radix
  //     const step = parseInt(confirmModalFor.split("-")[1]);
  //     if (shipmentFormData !== null) {
  //       setActiveStep(step);
  //     }
  //   }
  // };

  const checkIfFormEdited = (currentStep) => {
    switch (currentStep) {
      case 0:
        return checkIfProjectSetupEdited();

      case 1:
        return checkIfApplicationMarketEdited();

      case 2:
        return checkIfBudgetTechnologyEdited();

      case 3:
        return checkIfTeamUserEdited();

      // case 4:
      //   return checkIfSensorGatewayEdited();

      // case 5:
      //   return checkIfEnvironmentLimitsEdited();

      default:
        return false;
    }
  };

  return (
    <div className={classes.root}>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item sm={10}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            nonLinear
            style={{ background: "transparent" }}
          >
            {_.map(steps, (label, index) => (
              <Step
                key={`step${index}:${label}`}
                className={`${shipmentFormData !== null && classes.step}`}
                onClick={handleStep(index)}
              >
                <StepLabel style={{ color: "white" }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
      </Grid>

      <div>
        <div>
          {getStepContent(
            activeStep,
            props,
            // viewOnly,
            handleNext,
            handleBack,
            maxSteps,
            handleCancel
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.optionsReducer,
});

export default connect(mapStateToProps)(NewProjectForm);
