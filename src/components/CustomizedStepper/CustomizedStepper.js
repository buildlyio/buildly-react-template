import React from 'react';
import {
  Stepper,
  Step,
  StepConnector,
  StepLabel,
  styled,
  Stack,
  Typography,
  StepIcon,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { stepConnectorClasses } from '@mui/material/StepConnector';
import { CircleRounded as CircleIcon, CheckCircleRounded as CheckIcon } from '@mui/icons-material';

const CustomizedConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.background.light,
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)} 0`,
  },
  noLine: {
    '& .MuiStepConnector-root:first-of-type': {
      display: 'none',
    },
  },
  default: {
    fill: `${theme.palette.background.light} !important`,
    width: '100% !important',
  },
  active: {
    fill: `${theme.palette.success.main} !important`,
    width: '100% !important',
  },
  error: {
    fill: `${theme.palette.error.main} !important`,
    width: '100% !important',
  },
  info: {
    fill: `${theme.palette.info.main} !important`,
    width: '100% !important',
  },
}));

const CustomizedSteppers = ({ steps }) => {
  const classes = useStyles();

  const getIcon = (step) => {
    switch (true) {
      case step.active && !step.completed:
        return <CircleIcon className={classes.active} />;

      case step.active && step.completed:
        return <CheckIcon className={classes.active} />;

      case step.error && !step.completed:
        return <CircleIcon className={classes.error} />;

      case step.error && step.completed:
        return <CheckIcon className={classes.error} />;

      case step.info && !step.completed:
        return <CircleIcon className={classes.info} />;

      case step.info && step.completed:
        return <CheckIcon className={classes.info} />;

      default:
        return <CircleIcon className={classes.default} />;
    }
  };

  return (
    <Stepper alternativeLabel connector={<CustomizedConnector />} className={classes.root}>
      {steps.map((step, index) => (
        <Stack key={index} sx={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {step.titleIcon}
            <Typography textAlign="center" fontWeight={700} pb={2} pl={step.titleIcon ? 1 : 0} pr={1} fontSize={14} color={step.titleColor}>
              {step.title}
            </Typography>
          </div>
          <Step className={index === 0 ? classes.noLine : ''}>
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
