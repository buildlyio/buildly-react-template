import React from 'react';
import { makeStyles } from '@mui/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/lab';
import CustomizedTooltips from '../../components/ToolTip/ToolTip';
import { TextField } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    margin: '0px',
  },
}));

const DatePickerComponent = ({
  selectedDate,
  handleDateChange,
  label,
  hasTime,
  helpText,
  disabled,
  required,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {hasTime ? (
          <DateTimePicker
            variant="inline"
            inputVariant="outlined"
            ampm={false}
            fullWidth
            margin="normal"
            required={required}
            disabled={disabled}
            label={label}
            value={selectedDate}
            onChange={handleDateChange}
            format="MM/dd/yyyy HH:mm:ss"
            renderInput={(props) => <TextField fullWidth {...props} />}
          />
        ) : (
          <DatePicker
            autoOk
            fullWidth
            inputVariant="outlined"
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            disabled={disabled}
            required={required}
            id="date-picker-inline"
            label={label}
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            renderInput={(props) => <TextField fullWidth {...props} />}
          />
        )}
      </LocalizationProvider>
      {/* {helpText && (
        <CustomizedTooltips toolTipText={helpText} />
      )} */}
    </div>
  );
};

export default DatePickerComponent;
