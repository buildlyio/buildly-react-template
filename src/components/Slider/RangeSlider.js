import React from 'react';
import {
  makeStyles,
  Typography,
  Slider,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '250px',
    maxHeight: '250px',
    textAlign: 'center',
  },
}));

const RangeSlider = ({
  value,
  rangeText,
  disabled,
  handleSliderChange,
  marks,
  orientation,
  step,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Slider
        value={value}
        orientation={orientation}
        aria-labelledby="range-slider"
        valueLabelDisplay="auto"
        disabled={disabled}
        marks={marks}
        step={step}
        onChange={handleSliderChange}
      />
      <Typography id="range-slider" gutterBottom>
        {rangeText}
      </Typography>
    </div>
  );
};

export default RangeSlider;
