import React from 'react';
import {
  withStyles,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Info as InfoIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  infoToolTip: {
    fontSize: '16px',
    marginLeft: theme.spacing(1),
    cursor: 'pointer',
  },
}));

const StyledToolTip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
  arrow: {
    color: '#f5f5f9',
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
