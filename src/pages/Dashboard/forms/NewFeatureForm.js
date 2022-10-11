import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Stepper,
  Step,
  StepLabel,
  Hidden,
  Grid,
} from '@mui/material';
import FormModal from '@components/Modal/FormModal';
import { saveFeatureFormData } from '@redux/decision/actions/decision.actions';
import AddFeatures, { checkIfAddFeaturesEdited } from './AddFeatures';
import DescribeProcess, { checkIfDescribeProcessEdited } from './DescribeProcess';
import ViewDetailsWrapper from '../../NewProduct/components/ViewDetailsWrapper';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& .MuiStepLabel-label': {
      color: theme.palette.neutral.text.light,
    },
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
}));

const getSteps = () => [
  'Initial Setup',
  'Describe Process',
];

const getStepContent = (
  stepIndex,
  props,
  handleNext,
  handleBack,
  maxSteps,
) => {
  switch (stepIndex) {
    case 0:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <AddFeatures
            {...props}
            location={props.location}
            handleNext={handleNext}
          />
        </ViewDetailsWrapper>
      );

    case 1:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <DescribeProcess
            {...props}
            location={props.location}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </ViewDetailsWrapper>
      );

    default:
      return 'Unknown stepIndex';
  }
};

const NewFeatureForm = (props) => {
  const {
    history, dispatch, location,
  } = props;
  const classes = useStyles();
  const steps = getSteps();
  const maxSteps = steps.length;
  const redirectTo = location.state && location.state.from;

  const editPage = location.state && (location.state.type === 'edit' || location.state.type === 'view');
  const viewPage = (location.state && location.state.viewOnly) || false;
  // eslint-disable-next-line no-nested-ternary
  const formTitle = viewPage ? 'View Feature' : editPage ? 'Edit Feature' : 'Add Feature';

  const [activeStep, setActiveStep] = React.useState(0);
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [confirmModalFor, setConfirmModalFor] = useState(null);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    if (checkIfFormEdited(activeStep)) {
      setConfirmModal(true);
      setConfirmModalFor(activeStep - 1);
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const handleClose = () => {
    if (checkIfFormEdited(activeStep)) {
      setConfirmModal(true);
      setConfirmModalFor(null);
    } else {
      setFormModal(false);
      dispatch(saveFeatureFormData(null));
      if (location && location.state) {
        history.push(redirectTo);
      }
    }
  };

  const handleConfirmModal = () => {
    if (_.isNumber(confirmModalFor)) {
      setConfirmModal(false);
      setActiveStep(confirmModalFor);
    } else {
      dispatch(saveFeatureFormData(null));
      if (location && location.state) {
        history.push(redirectTo);
      }
    }
  };

  const checkIfFormEdited = (currentStep) => {
    switch (currentStep) {
      case 0:
        return checkIfAddFeaturesEdited();

      case 1:
        return checkIfDescribeProcessEdited();

      default:
        return false;
    }
  };

  return (
    <div>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={handleClose}
          title={formTitle}
          titleClass={classes.formTitle}
          maxWidth="md"
          wantConfirm
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={handleConfirmModal}
        >
          <div className={classes.root}>
            <Hidden smDown>
              <Grid container alignItems="center" justifyContent="center">
                <Grid item sm={10}>
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    nonLinear
                    style={{ background: 'transparent', marginBottom: '40px' }}
                  >
                    {_.map(steps, (label, index) => (
                      <Step key={`step${index}:${label}`}>
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
                handleNext,
                handleBack,
                maxSteps,
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

export default connect(mapStateToProps)(NewFeatureForm);
