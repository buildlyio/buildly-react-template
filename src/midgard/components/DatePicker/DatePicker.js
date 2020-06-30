import React, { useState } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  DateTimePicker,
} from "@material-ui/pickers";
import EventIcon from "@material-ui/icons/Event";
import AlarmIcon from "@material-ui/icons/AddAlarm";
import { IconButton, InputAdornment } from "@material-ui/core";
import MomentUtils from "@date-io/moment";

export default function DatePickerComponent({
  selectedDate,
  handleDateChange,
  label,
  hasTime,
}) {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      {hasTime ? (
        <DateTimePicker
          hideTabs
          autoOk
          ampm={false}
          inputVariant="outlined"
          variant="inline"
          format="yyyy/MM/DD HH:mm:ss"
          value={selectedDate}
          onChange={(date) => handleDateChange(date)}
          allowKeyboardControl={false}
          fullWidth
          label={label}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <EventIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <KeyboardDatePicker
          // disableToolbar
          autoOk
          fullWidth
          inputVariant="outlined"
          variant="inline"
          format="MM/DD/yyyy"
          margin="normal"
          id="date-picker-inline"
          label={label}
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      )}
    </MuiPickersUtilsProvider>
  );
}
