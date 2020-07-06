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
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";

export default function DatePickerComponent({
  selectedDate,
  handleDateChange,
  label,
  hasTime,
}) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {hasTime ? (
        <KeyboardDateTimePicker
          variant="inline"
          inputVariant="outlined"
          ampm={false}
          fullWidth
          margin="normal"
          label={label}
          value={selectedDate}
          onChange={handleDateChange}
          format="yyyy/MM/dd HH:mm:ss"
        />
      ) : (
        <KeyboardDatePicker
          // disableToolbar
          autoOk
          fullWidth
          inputVariant="outlined"
          variant="inline"
          format="MM/dd/yyyy"
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
