import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import CustomizedTooltips from '@components/ToolTip/ToolTip';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const DatePickerComponent = ({
  selectedDate,
  handleDateChange,
  label,
  hasTime,
  helpText,
  disabled,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {hasTime ? (
          <DateTimePicker
            ampm={false}
            disabled={disabled}
            value={selectedDate}
            onChange={handleDateChange}
            format="MM/dd/yyyy HH:mm:ss"
            renderInput={(props) => <TextField {...props} label={label} fullWidth margin="normal" />}
          />
        ) : (
          <DatePicker
            format="MM/dd/yyyy"
            disabled={disabled}
            id="date-picker-inline"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(props) => <TextField {...props} label={label} fullWidth margin="normal" />}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />

        )}
      </LocalizationProvider>
      {helpText && <CustomizedTooltips toolTipText={helpText} />}
    </div>
  );
};

export default DatePickerComponent;
