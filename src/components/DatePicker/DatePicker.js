import React from 'react';
import _ from 'lodash';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField } from '@mui/material';
import './DatePickerStyles.css';

const popperProps = {
  className: 'popperSx',
  popperOptions: {
    modifiers: [
      {
        name: 'preventTranslation',
        enabled: true,
        phase: 'write',
        fn: ({ state }) => {
          state.elements.popper.setAttribute('translate', 'no');
        },
      },
    ],
  },
};

const DatePickerComponent = ({
  selectedDate,
  handleDateChange,
  label,
  hasTime,
  disabled,
  required,
  dateFormat,
  timeFormat,
}) => (
  <div className="datePickerRoot">
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {hasTime ? (
        <DateTimePicker
          variant="inline"
          inputVariant="outlined"
          ampm={!!(timeFormat && _.includes(timeFormat, ' A'))}
          fullWidth
          margin="normal"
          required={required}
          disabled={disabled}
          label={label}
          value={selectedDate}
          onChange={(value, keyInput) => handleDateChange(value.$d)}
          inputFormat={`${dateFormat} ${timeFormat}`}
          PopperProps={popperProps}
          renderInput={(props) => (
            <TextField {...props} />
          )}
        />
      ) : (
        <DatePicker
          autoOk
          fullWidth
          inputVariant="outlined"
          variant="inline"
          inputFormat={`${dateFormat}`}
          margin="normal"
          disabled={disabled}
          required={required}
          id="date-picker-inline"
          label={label}
          value={selectedDate}
          onChange={(value, keyInput) => handleDateChange(value.$d)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          PopperProps={popperProps}
          renderInput={(props) => (
            <TextField {...props} />
          )}
        />
      )}
    </LocalizationProvider>
  </div>
);

export default DatePickerComponent;
