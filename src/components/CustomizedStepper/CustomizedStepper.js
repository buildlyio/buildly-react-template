import React from 'react';
import {
  Stepper,
  Step,
  StepConnector,
  StepLabel,
  Stack,
  Typography,
  StepIcon,
} from '@mui/material';
import { CircleRounded as CircleIcon, CheckCircleRounded as CheckIcon } from '@mui/icons-material';
import './CustomizedStepperStyles.css';

const CustomizedSteppers = ({ steps }) => {
  const getIcon = (step) => {
    switch (true) {
      case step.active && !step.completed:
        return <CircleIcon className="customizedStepperActive" />;

      case step.active && step.completed:
        return <CheckIcon className="customizedStepperActive" />;

      case step.error && !step.completed:
        return <CircleIcon className="customizedStepperError" />;

      case step.error && step.completed:
        return <CheckIcon className="customizedStepperError" />;

      case step.info && !step.completed:
        return <CircleIcon className="customizedStepperInfo" />;

      case step.info && step.completed:
        return <CheckIcon className="customizedStepperInfo" />;

      default:
        return <CircleIcon className="customizedStepperDefault" />;
    }
  };

  return (
    <Stepper alternativeLabel connector={<StepConnector className="customizedStepperConnector" />} className="customizedStepperRoot">
      {steps.map((step, index) => (
        <Stack key={index} sx={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
            {step.titleIcon}
            <Typography className={step.titleIcon ? '' : 'notranslate'} textAlign="center" fontWeight={700} pb={2} pl={step.titleIcon ? 1 : 0} pr={1} fontSize={14} color={step.titleColor}>
              {step.title}
            </Typography>
          </div>
          <Step className={index === 0 ? 'customizedStepperNoLine' : ''}>
            <StepIcon icon={getIcon(step)} />
            <StepLabel>{step.label}</StepLabel>
            <Typography className="notranslate" textAlign="center" fontSize={14} style={{ width: 'max-content', margin: 'auto' }}>{step.content}</Typography>
            <Typography textAlign="center" fontSize={14}>{step.caption}</Typography>
          </Step>
        </Stack>
      ))}
    </Stepper>
  );
};

export default CustomizedSteppers;
