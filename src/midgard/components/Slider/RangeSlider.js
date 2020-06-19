import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "250px",
    maxHeight: "250px",
    textAlign: "center",
  },
  valueLabel: {
    width: "20px",
    height: "20px",
    background: "red",
  },
  arrow: {
    color: theme.palette.common.black,
    zIndex: "-1",
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    zIndex: "-1",
  },
}));

function valuetext(value) {
  return `${value}°C`;
}

function ValueLabelComponent(props) {
  const { children, open, value } = props;
  const classes = useStyles();
  return (
    <Tooltip
      open={true}
      // enterTouchDelay={0}
      placement="left"
      title={value}
      classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
      arrow
    >
      {children}
    </Tooltip>
  );
}

export default function RangeSlider({
  value,
  setValue,
  rangeText,
  max,
  min,
  handleSliderChange,
  marks,
  orientation,
}) {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log("value", value);

  return (
    <div className={classes.root}>
      <Slider
        value={value}
        // track={false}
        orientation={orientation}
        aria-labelledby="range-slider"
        valueLabelDisplay="on"
        ValueLabelComponent={ValueLabelComponent}
        marks={marks}
        onChange={handleSliderChange}
      />
      <Typography id="range-slider" gutterBottom>
        {rangeText}
      </Typography>
    </div>
  );
}
