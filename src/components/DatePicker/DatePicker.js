import React from 'react';
import { makeStyles } from '@mui/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomizedTooltips from '../../components/ToolTip/ToolTip';
import { TextField } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    margin: '0px',
  },
  popperSx: {
    '& .MuiPaper-root': {
      border: '1px solid black',
      padding: 2,
      marginTop: 1,
      backgroundColor: 'rgba(120, 120, 120, 0.2)',
    },
    '& .MuiCalendarPicker-root': {
      backgroundColor: 'rgba(45, 85, 255, 0.4)',
    },
    '& .PrivatePickersSlideTransition-root': {},
    '& .MuiPickersDay-dayWithMargin': {
      color: 'rgb(229,228,226)',
      backgroundColor: 'rgba(50, 136, 153)',
    },
    '& .MuiTabs-root': { backgroundColor: 'rgba(120, 120, 120, 0.4)' },
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
  dateFormat,
  timeFormat,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            onChange={(value, keyInput) => handleDateChange(value.$d)}
            inputFormat={`${dateFormat} ${timeFormat}`}
            PopperProps={{
              sx: classes.popperSx,
            }}
            renderInput={(props) => <TextField {...props} />}
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
            PopperProps={{
              sx: classes.popperSx,
            }}
            renderInput={(props) => <TextField {...props} />}
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
