/* eslint-disable no-use-before-define */
import React from "react";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    "& > * + *": {
      marginTop: theme.spacing(3),
    },
  },
}));

export default function SearchModal({
  open,
  setOpen,
  title,
  submitAction,
  submitText,
  listOfItems,
  searchFieldLabel,
  searchFieldPlaceHolder,
  selectedList,
}) {
  const classes = useStyles();
  const [list, setList] = useState({});
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"md"}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent className={classes.root}>
        <Autocomplete
          id="tags-outlined"
          options={listOfItems}
          getOptionLabel={(option) =>
            option && `${option.name}:${option.gateway_uuid}`
          }
          onChange={(event, newValue) => {
            setList(newValue);
          }}
          defaultValue={selectedList}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={searchFieldLabel}
              placeholder={searchFieldPlaceHolder}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            submitAction(list);
            setOpen(false);
          }}
          color="primary"
          autoFocus
        >
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
