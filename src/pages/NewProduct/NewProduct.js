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
import { saveProductFormData } from '@redux/product/actions/product.actions';
import { routes } from '@routes/routesConstants';
import ProductSetup, {
  checkIfProductSetupEdited,
} from './components/ProductSetup';
import ApplicationMarket, {
  checkIfApplicationMarketEdited,
} from './components/ApplicationMarket';
import BudgetTechnology, {
  checkIfBudgetTechnologyEdited,
} from './components/BudgetTechnology';
import TeamUser, { checkIfTeamUserEdited } from './components/TeamUser';
import UseInfo, { checkIfUseInfoEdited } from './components/UseInfo';
import MinimalFunctionality, {
  checkIfMinimalFuncEdited,
} from './components/MinimalFunctionality';
import ViewDetailsWrapper from './components/ViewDetailsWrapper';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
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
          title="New Product Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <ProductSetup
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
          title="New Product Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <ApplicationMarket
            {...props}
            location={props.location}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </ViewDetailsWrapper>
      );

    case 2:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="New Product Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <BudgetTechnology
            {...props}
            location={props.location}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </ViewDetailsWrapper>
      );

    case 3:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="New Product Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <TeamUser
            {...props}
            location={props.location}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </ViewDetailsWrapper>
      );

    case 4:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="New Product Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <UseInfo
            {...props}
            location={props.location}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </ViewDetailsWrapper>
      );

    case 5:
      return (
        <ViewDetailsWrapper
          {...props}
          handleBack={handleBack}
          title="New Product Setup"
          maxSteps={maxSteps}
          activeStep={stepIndex}
        >
          <MinimalFunctionality
            {...props}
            location={props.location}
            handleBack={handleBack}
          />
        </ViewDetailsWrapper>
      );

    default:
      return 'Unknown stepIndex';
  }
};

const NewProductForm = (props) => {
  const { history, productFormData, dispatch } = props;
  const classes = useStyles();
  const steps = getSteps();
  const maxSteps = steps.length;

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
    if (checkIfFormEdited(activeStep)
      || (productFormData && !_.isEmpty(productFormData))
    ) {
      setConfirmModal(true);
      setConfirmModalFor(null);
    } else {
      setFormModal(false);
      history.push(routes.DASHBOARD);
    }
  };

  const handleConfirmModal = () => {
    if (_.isNumber(confirmModalFor)) {
      setConfirmModal(false);
      setActiveStep(confirmModalFor);
    } else {
      dispatch(saveProductFormData(null));
      history.push(routes.DASHBOARD);
    }
  };

  const checkIfFormEdited = (currentStep) => {
    switch (currentStep) {
      case 0:
        return checkIfProductSetupEdited();

      case 1:
        return checkIfApplicationMarketEdited();

      case 2:
        return checkIfBudgetTechnologyEdited();

      case 3:
        return checkIfTeamUserEdited();

      case 4:
        return checkIfUseInfoEdited();

      case 5:
        return checkIfMinimalFuncEdited();

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
        title="New Product Setup"
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
                  style={{ background: 'transparent' }}
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
  productFormData: state.productReducer.productFormData,
});

export default connect(mapStateToProps)(NewProductForm);
