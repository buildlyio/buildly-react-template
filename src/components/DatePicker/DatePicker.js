import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
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
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {hasTime ? (
          <KeyboardDateTimePicker
            variant="inline"
            inputVariant="outlined"
            ampm={false}
            fullWidth
            margin="normal"
            disabled={disabled}
            label={label}
            value={selectedDate}
            onChange={handleDateChange}
            format="MM/dd/yyyy HH:mm:ss"
          />
        ) : (
          <KeyboardDatePicker
            autoOk
            fullWidth
            inputVariant="outlined"
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            disabled={disabled}
            id="date-picker-inline"
            label={label}
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        )}
      </MuiPickersUtilsProvider>
      {helpText && (
        <CustomizedTooltips toolTipText={helpText} />
      )}
    </div>
  );
};

export default DatePickerComponent;
