import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import CustomizedTooltips from '@components/ToolTip/ToolTip';

export default DatePickerComponent = ({
  selectedDate,
  handleDateChange,
  label,
  hasTime,
  helpText,
  disabled,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {hasTime ? (
          <KeyboardDateTimePicker
            variant='inline'
            inputVariant='outlined'
            ampm={false}
            fullWidth
            margin='normal'
            disabled={disabled}
            label={label}
            value={selectedDate}
            onChange={handleDateChange}
            format='MM/dd/yyyy HH:mm:ss'
          />
        ) : (
          <KeyboardDatePicker
            // disableToolbar
            autoOk
            fullWidth
            inputVariant='outlined'
            variant='inline'
            format='MM/dd/yyyy'
            margin='normal'
            disabled={disabled}
            id='date-picker-inline'
            label={label}
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        )}
      </MuiPickersUtilsProvider>
      {helpText && <CustomizedTooltips toolTipText={helpText} />}
    </div>
  );
}
