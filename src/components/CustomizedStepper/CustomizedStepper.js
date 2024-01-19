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
        return <CircleIcon className="customizadStepperActive" />;

      case step.active && step.completed:
        return <CheckIcon className="customizadStepperActive" />;

      case step.error && !step.completed:
        return <CircleIcon className="customizadStepperError" />;

      case step.error && step.completed:
        return <CheckIcon className="customizadStepperError" />;

      case step.info && !step.completed:
        return <CircleIcon className="customizadStepperInfo" />;

      case step.info && step.completed:
        return <CheckIcon className="customizadStepperInfo" />;

      default:
        return <CircleIcon className="customizadStepperDefault" />;
    }
  };

  return (
    <Stepper alternativeLabel connector={<StepConnector className="customizadStepperConnector" />} className="customizadStepperRoot">
      {steps.map((step, index) => (
        <Stack key={index} sx={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {step.titleIcon}
            <Typography textAlign="center" fontWeight={700} pb={2} pl={step.titleIcon ? 1 : 0} pr={1} fontSize={14} color={step.titleColor}>
              {step.title}
            </Typography>
          </div>
          <Step className={index === 0 && 'customizadStepperNoLine'}>
            <StepIcon icon={getIcon(step)} />
            <StepLabel>{step.label}</StepLabel>
            <Typography textAlign="center" fontSize={14}>{step.content}</Typography>
          </Step>
        </Stack>
      ))}
    </Stepper>
  );
};

export default CustomizedSteppers;
