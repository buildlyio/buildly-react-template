import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Modal from "../../../components/Modal/Modal";
import ShipmentInfo, {checkIfShipmentInfoEdited} from "../components/ShipmentInfo";
import { Hidden, Grid } from "@material-ui/core";
import ViewDetailsWrapper from "../components/ViewDetailsWrapper";
import { routes } from "../../../routes/routesConstants";
import ItemInfo from "../components/ItemInfo";
import { saveShipmentFormData } from "../../../redux/shipment/actions/shipment.actions";
import { connect } from "react-redux";
import SensorsGatewayInfo from "../components/Sensors&GatewayInfo";
import EnvironmentalLimitsInfo, { checkIfEnvironmentLimitsEdited } from "../components/EnvironmentalLimitsInfo";
import CustodianInfo from "../components/custodian-info/CustodianInfo";
import { checkForGlobalAdmin } from "midgard/utils/utilMethods";
import { UserContext } from "midgard/context/User.context";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import ShipmentKeyInfo from "../components/ShipmentKeyInfo";

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
    "Shipment Key",
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
  viewOnly,
  handleNext,
  handleBack,
  maxSteps,
  handleCancel,
  setConfirmModal,
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
            viewOnly={viewOnly}
            location={props.location}
            handleNext={handleNext}
            handleBack={handleBack}
            handleCancel={handleCancel}
            redirectTo={`${routes.SHIPMENT}`}
            setConfirmModal={setConfirmModal}
          />
        </ViewDetailsWrapper>
      );

    case 1:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title={"Shipment Key"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <ShipmentKeyInfo
            {...props}
            viewOnly={viewOnly}
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
          title={"Items"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <ItemInfo
            {...props}
            viewOnly={viewOnly}
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
          title={"Custodians"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <CustodianInfo
            {...props}
            viewOnly={viewOnly}
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
          title={"Sensors & Gateways"}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <SensorsGatewayInfo
            {...props}
            viewOnly={viewOnly}
            history={props.history}
            redirectTo={`${routes.SHIPMENT}/add`}
            handleNext={handleNext}
            handleCancel={handleCancel}
          />
        </ViewDetailsWrapper>
      );

    case 5:
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
            viewOnly={viewOnly}
            history={props.history}
            redirectTo={`${routes.SHIPMENT}/add`}
            handleNext={handleNext}
            handleCancel={handleCancel}
            setConfirmModal={setConfirmModal}
          />
        </ViewDetailsWrapper>
      );

    default:
      return "Unknown stepIndex";
  }
};

function AddShipment(props) {
  const { location, history, shipmentFormData, dispatch } = props;
  const editPage = location.state && location.state.type === "edit";
  const editData = location.state && location.state.data;
  const user = useContext(UserContext);
  // For non-admins the forms becomes view-only once the shipment status is no longer just planned
  const viewOnly = !(checkForGlobalAdmin(user)) && editPage && editData && editData.status && editData.status.toLowerCase() !== "planned";
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [openModal, toggleModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const steps = getSteps();
  const maxSteps = steps.length;
  const formTitle = editPage
    ? viewOnly
      ? "View Shipment"
      : "Edit Shipment"
    : "Add Shipment";

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
    if (checkIfFormEdited(activeStep))
      setConfirmModal(true);
    else {
      handleConfirmModal();
      toggleModal(false);
    }
  };

  const handleCancel = () => {
    if (checkIfFormEdited(activeStep))
      setConfirmModal(true);
    else {
      handleConfirmModal();
    }
  };

  const handleConfirmModal = () => {
    setConfirmModal(false);
    dispatch(saveShipmentFormData(null));
    history.push(routes.SHIPMENT);
  };

  const checkIfFormEdited = (activeStep) => {
    switch (activeStep) {
      case 0:
        return checkIfShipmentInfoEdited();
      case 1:
        return false;
      case 2:
        return false;
      case 3:
        return false;
      case 4:
        return false;
      case 5:
        return checkIfEnvironmentLimitsEdited();
    }
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
                  viewOnly,
                  handleNext,
                  handleBack,
                  maxSteps,
                  handleCancel,
                  setConfirmModal,
                )}
              </div>
              <ConfirmModal
                open={openConfirmModal}
                setOpen={setConfirmModal}
                submitAction={handleConfirmModal}
                title={"Your changes are unsaved and will be discarded. Are you sure to leave?"}
                submitText={"Yes"}
              />
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
