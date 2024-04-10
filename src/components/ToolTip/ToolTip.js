import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import './TooltipStyles.css';

const CustomizedTooltips = ({ toolTipText }) => (
  <Tooltip
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
      className="infoToolTip"
    />
  </Tooltip>
);

export default CustomizedTooltips;
