import React from 'react';
import {
  makeStyles,
  Typography,
  Slider,
  Tooltip,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '250px',
    maxHeight: '250px',
    textAlign: 'center',
  },
  valueLabel: {
    width: '20px',
    height: '20px',
    background: 'red',
  },
  arrow: {
    color: theme.palette.common.black,
    zIndex: 1,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    zIndex: 1,
  },
}));

const valuetext = (value) => {
  return `${value}°C`;
}

const ValueLabelComponent = (props) => {
  const classes = useStyles();
  const { children, open, value } = props;

  return (
    <Tooltip
      open={true}
      // enterTouchDelay={0}
      placement='left'
      title={value}
      classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
      arrow
    >
      {children}
    </Tooltip>
  );
}

export default RangeSlider = ({
  value,
  setValue,
  rangeText,
  max,
  min,
  disabled,
  handleSliderChange,
  marks,
  orientation,
}) => {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <div className={classes.root}>
      <Slider
        value={value}
        // track={false}
        orientation={orientation}
        aria-labelledby='range-slider'
        valueLabelDisplay='auto'
        // ValueLabelComponent={ValueLabelComponent}
        disabled={disabled}
        marks={marks}
        onChange={handleSliderChange}
      />
      <Typography id='range-slider' gutterBottom>
        {rangeText}
      </Typography>
    </div>
  );
}
