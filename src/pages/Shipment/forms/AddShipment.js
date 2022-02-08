import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  Hidden,
  Grid,
} from '@material-ui/core';
import FormModal from '@components/Modal/FormModal';
import { UserContext } from '@context/User.context';
import { saveShipmentFormData } from '@redux/shipment/actions/shipment.actions';
import { routes } from '@routes/routesConstants';
import { checkForGlobalAdmin } from '@utils/utilMethods';
import ViewDetailsWrapper from '../components/ViewDetailsWrapper';
import EnvironmentalLimitsInfo, {
  checkIfEnvironmentLimitsEdited,
} from '../components/EnvironmentalLimitsInfo';
import CustodianInfo from '../components/custodian-info/CustodianInfo';
import ItemInfo, { checkIfItemInfoEdited } from '../components/ItemInfo';
import SensorsGatewayInfo, {
  checkIfSensorGatewayEdited,
} from '../components/Sensors&GatewayInfo';
import ShipmentInfo, {
  checkIfShipmentInfoEdited,
} from '../components/ShipmentInfo';
import ShipmentKeyInfo, {
  checkIfShipmentKeyEdited,
} from '../components/ShipmentKeyInfo';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
  step: {
    cursor: 'pointer',
  },
}));

const getSteps = () => [
  'Shipment Details',
  'Shipment Key',
  'Items',
  'Custodians',
  'Sensors & Gateways',
  'Environmental Limits',
];

const getStepContent = (
  stepIndex,
  props,
  viewOnly,
  handleNext,
  handleBack,
  maxSteps,
  handleCancel,
  setConfirmModal,
  setConfirmModalFor,
) => {
  switch (stepIndex) {
    case 0:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="Shipment Details"
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
            setConfirmModalFor={setConfirmModalFor}
          />
        </ViewDetailsWrapper>
      );

    case 1:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="Shipment Key"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <ShipmentKeyInfo
            {...props}
            viewOnly={viewOnly}
            handleNext={handleNext}
            handleCancel={handleCancel}
            setConfirmModal={setConfirmModal}
            setConfirmModalFor={setConfirmModalFor}
          />
        </ViewDetailsWrapper>
      );

    case 2:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="Items"
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
            setConfirmModal={setConfirmModal}
            setConfirmModalFor={setConfirmModalFor}
          />
        </ViewDetailsWrapper>
      );

    case 3:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="Custodians"
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
            setConfirmModal={setConfirmModal}
            setConfirmModalFor={setConfirmModalFor}
          />
        </ViewDetailsWrapper>
      );

    case 4:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="Sensors & Gateways"
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
            setConfirmModal={setConfirmModal}
            setConfirmModalFor={setConfirmModalFor}
          />
        </ViewDetailsWrapper>
      );

    case 5:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="Environmental Limits"
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
            setConfirmModalFor={setConfirmModalFor}
          />
        </ViewDetailsWrapper>
      );

    default:
      return 'Unknown stepIndex';
  }
};

const AddShipment = (props) => {
  const {
    location, history, shipmentFormData, dispatch,
  } = props;
  const classes = useStyles();
  const user = useContext(UserContext);

  const editPage = location.state && location.state.type === 'edit';
  const editData = location.state && location.state.data;
  // For non-admins the forms becomes view-only once the shipment status is no longer just planned
  const viewOnly = !checkForGlobalAdmin(user)
    && editPage
    && editData
    && editData.status
    && _.lowerCase(editData.status) !== 'planned';

  const [activeStep, setActiveStep] = React.useState(0);
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [confirmModalFor, setConfirmModalFor] = useState('');

  const steps = getSteps();
  const maxSteps = steps.length;

  let formTitle;
  if (!editPage) {
    formTitle = 'Add Shipment';
  } else if (viewOnly) {
    formTitle = 'View Shipment';
  } else {
    formTitle = 'Edit Shipment';
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    if (shipmentFormData && !_.isEmpty(shipmentFormData)) {
      if (checkIfFormEdited(activeStep)) {
        setConfirmModalFor(`step-${step}`);
        setConfirmModal(true);
      } else {
        handleConfirmModal();
        setActiveStep(step);
      }
    }
  };

  const closeModal = () => {
    if (checkIfFormEdited(activeStep)) {
      setConfirmModalFor('close');
      setConfirmModal(true);
    } else {
      setFormModal(false);
      dispatch(saveShipmentFormData(null));
      history.push(routes.SHIPMENT);
    }
  };

  const handleCancel = () => {
    if (checkIfFormEdited(activeStep)) {
      setConfirmModalFor('close');
      setConfirmModal(true);
    } else {
      dispatch(saveShipmentFormData(null));
      history.push(routes.SHIPMENT);
    }
  };

  const handleConfirmModal = () => {
    setConfirmModal(false);
    if (confirmModalFor === 'close') {
      dispatch(saveShipmentFormData(null));
      history.push(routes.SHIPMENT);
    } else if (confirmModalFor === 'next') {
      handleNext();
    } else if (confirmModalFor.includes('step')) {
      // eslint-disable-next-line radix
      const step = parseInt(confirmModalFor.split('-')[1]);
      if (shipmentFormData !== null) {
        setActiveStep(step);
      }
    }
  };

  const checkIfFormEdited = (currentStep) => {
    switch (currentStep) {
      case 0:
        return checkIfShipmentInfoEdited();

      case 1:
        return checkIfShipmentKeyEdited();

      case 2:
        return checkIfItemInfoEdited();

      case 3:
        return false; // Handled in Custody Info

      case 4:
        return checkIfSensorGatewayEdited();

      case 5:
        return checkIfEnvironmentLimitsEdited();

      default:
        return false;
    }
  };

  return (
    <div>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={closeModal}
          title={formTitle}
          titleClass={classes.formTitle}
          maxWidth="md"
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={handleConfirmModal}
        >
          <div className={classes.root}>
            <Hidden xsDown>
              <Grid
                container
                alignItems="center"
                justifyContent="center"
              >
                <Grid item sm={10}>
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    nonLinear
                  >
                    {_.map(steps, (label, index) => (
                      <Step
                        key={`step${index}:${label}`}
                        className={`${shipmentFormData !== null && classes.step
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
                  setConfirmModalFor,
                )}
              </div>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.optionsReducer,
});

export default connect(mapStateToProps)(AddShipment);
