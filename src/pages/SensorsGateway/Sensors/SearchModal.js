import React, { useState } from 'react';
import {
  makeStyles,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CustomizedTooltips from '@components/ToolTip/ToolTip';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));

const SearchModal = ({
  open,
  setOpen,
  title,
  submitAction,
  submitText,
  listOfItems,
  searchFieldLabel,
  searchFieldPlaceHolder,
  selectedList,
  helpText,
}) => {
  const classes = useStyles();
  const [list, setList] = useState({});

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent className={classes.root}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Autocomplete
            id="tags-outlined"
            options={listOfItems}
            getOptionLabel={(option) => option && `${option.name}:${option.gateway_uuid}`}
            getOptionSelected={(option, value) => `${option.name}:${option.gateway_uuid}` === `${value.name}:${value.gateway_uuid}`}
            onChange={(event, newValue) => setList(newValue)}
            defaultValue={selectedList}
            style={{ flex: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={searchFieldLabel}
                placeholder={searchFieldPlaceHolder}
              />
            )}
          />
          {helpText
          && <CustomizedTooltips toolTipText={helpText} />}
        </div>
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
};

export default SearchModal;
