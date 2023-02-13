import React from 'react';
import { makeStyles } from '@mui/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  TimePicker,
  LocalizationProvider,
} from '@mui/lab';
import { TextField } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    margin: '0px',
    marginLeft: '10px',
  },
}));

const TimePickerComponent = ({
  selectedTime,
  handleTimeChange,
  label,
  disabled,
  required,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          fullWidth
          inputVariant="outlined"
          variant="inline"
          views={['hours', 'minutes']}
          inputFormat="HH:mm"
          mask="__:__"
          ampm={false}
          margin="normal"
          disabled={disabled}
          required={required}
          id="time-picker-inline"
          label={label}
          value={selectedTime}
          onChange={handleTimeChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
          renderInput={(props) => <TextField {...props} />}
        />
      </LocalizationProvider>
      {/* {helpText && (
        <CustomizedTooltips toolTipText={helpText} />
      )} */}
    </div>
  );
};

export default TimePickerComponent;
