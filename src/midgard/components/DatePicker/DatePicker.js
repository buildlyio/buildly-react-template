import React, { useState } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  DateTimePicker,
} from "@material-ui/pickers";
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
          autoOk
          variant="inline"
          inputVariant="outlined"
          id="time-picker-inline"
          label={label}
          format="MM/DD/yyyy hh:mm a"
          value={selectedDate}
          onChange={handleDateChange}
          // onError={console.log("error")}
        />
      ) : (
        <KeyboardDatePicker
          disableToolbar
          autoOk
          fullWidth
          inputVariant="outlined"
          variant="inline"
          format="MM/DD/yyyy"
          margin="normal"
          id="date-picker-inline"
          label={label}
          disablePast
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
