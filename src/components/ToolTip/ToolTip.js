import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Info as InfoIcon } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  infoToolTip: {
    fontSize: '16px',
    marginLeft: theme.spacing(1),
    cursor: 'pointer',
  },
}));

const StyledToolTip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.primary.light,
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
