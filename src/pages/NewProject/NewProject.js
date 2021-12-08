import React, { useState, useContext, useEffect } from 'react';
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
import { routes } from '@routes/routesConstants';
// import { checkForGlobalAdmin } from "@utils/utilMethods";
import {
  saveProductFormData,
} from '@redux/project/actions/project.actions';
import ProjectSetup, {
  checkIfProjectSetupEdited,
} from './components/ProjectSetup';
import ApplicationMarket, {
  checkIfApplicationMarketEdited,
} from './components/ApplicationMarket';
import BudgetTechnology, {
  checkIfBudgetTechnologyEdited,
} from './components/BudgetTechnology';
import TeamUser, { checkIfTeamUserEdited } from './components/TeamUser';
import ViewDetailsWrapper from './components/ViewDetailsWrapper';
import UsersInfo from './components/UsersInfo';
import MinimalFunctionality from './components/MinimalFunctionality';

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
  'Initial Configuration',
  'Application & Market',
  'Budget & Technology',
  'Team & Users',
  'Users Information',
  'Minimal Functionality',
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
  setConfirmModalFor,
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
      return 'Unknown stepIndex';
  }
};

const NewProjectForm = (props) => {
  const {
    location, history, productFormData, dispatch,
  } = props;
  const classes = useStyles();
  const user = useContext(UserContext);

  const editPage = location.state && location.state.type === 'edit';
  const editData = location.state && location.state.data;

  const [activeStep, setActiveStep] = React.useState(0);
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [confirmModalFor, setConfirmModalFor] = useState('');

  const steps = getSteps();
  const maxSteps = steps.length;

  useEffect(() => {
    if (editPage || productFormData === null) {
      dispatch(saveProductFormData(editData));
    }
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    if (checkIfFormEdited(activeStep)) {
      setConfirmModalFor(`step-${step}`);
      setConfirmModal(true);
    } else {
      handleConfirmModal();
      if (productFormData !== null) {
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
      // dispatch(saveProductFormData(null));
      history.push(routes.DASHBOARD);
    }
  };

  const handleCancel = () => {
    if (checkIfFormEdited(activeStep)) {
      setConfirmModalFor('close');
      setConfirmModal(true);
    } else {
      // dispatch(saveProductFormData(null));
      history.push(routes.DASHBOARD);
    }
  };

  const handleConfirmModal = () => {
    setConfirmModal(false);
    if (confirmModalFor === 'close') {
      // dispatch(saveProductFormData(null));
      history.push(routes.DASHBOARD);
    } else if (confirmModalFor === 'next') {
      handleNext();
    } else if (confirmModalFor.includes('step')) {
      // eslint-disable-next-line radix
      const step = parseInt(confirmModalFor.split('-')[1]);
      if (productFormData !== null) {
        setActiveStep(step);
      }
    }
  };

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
    <div>
      {openFormModal && (
      <FormModal
        open={openFormModal}
        handleClose={closeModal}
        title="New Project Setup"
        titleClass={classes.formTitle}
        maxWidth="md"
        openConfirmModal={openConfirmModal}
        setConfirmModal={setConfirmModal}
        handleConfirmModal={handleConfirmModal}
      >
        <div className={classes.root}>
          <Hidden xsDown>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item sm={10}>
                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                  nonLinear
                  style={{ background: 'transparent' }}
                >
                  {_.map(steps, (label, index) => (
                    <Step
                      key={`step${index}:${label}`}
                      className={classes.step}
                      onClick={handleStep(index)}
                    >
                      <StepLabel style={{ color: 'white' }}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
            </Grid>
          </Hidden>

          <div>
            {getStepContent(
              activeStep,
              props,
              // viewOnly,
              handleNext,
              handleBack,
              maxSteps,
              handleCancel,
            )}
          </div>
        </div>
      </FormModal>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.optionsReducer,
});

export default connect(mapStateToProps)(NewProjectForm);
