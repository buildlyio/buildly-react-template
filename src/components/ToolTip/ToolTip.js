import React from 'react';
import {
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import { Info as InfoIcon } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  infoToolTip: {
    fontSize: '16px',
    marginLeft: theme.spacing(1),
    cursor: 'pointer',
    color: theme.palette.secondary.main,
  },
}));

const StyledToolTip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.darkGrey,
    color: theme.palette.secondary.main,
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
  },
  arrow: {
    color: theme.palette.common.arrow,
  },
}))(Tooltip);

const CustomizedTooltips = ({ toolTipText }) => {
  const classes = useStyles();

  return (
    <StyledToolTip
      arrow
      title={(
        <Typography color="inherit">
          {toolTipText}
        </Typography>
      )}
    >
      <InfoIcon
        color="action"
        fontSize="small"
        className={classes.infoToolTip}
      />
    </StyledToolTip>
  );
};

export default CustomizedTooltips;
