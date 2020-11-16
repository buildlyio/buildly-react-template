import React, { useState, useEffect, useRef } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  nonEditMode: {
    display: "flex",
    "&:hover": {
      "& $editIcon": {
        visibility: "visible"
      }
    }
  },
  editIcon: {
    visibility: "hidden",
    cursor: "pointer",
    marginLeft: theme.spacing(1)
  },
  typography: {
    margin: theme.spacing(0)
  },
  placeholder: {
    color: '#aaa'
  }
}));

/**
 * Component for inline editing.
 */
export function InlineEditor({id, tag, value, placeholder, onChange}) {
  const classes = useStyles();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const node = useRef();

  useEffect(() => {
    if (editing) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keyup', handleKeyup);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keyup', handleKeyup);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keyup', handleKeyup);
    };
  }, [editing, text]);

  /**
   * Handles the keyup events for enter and escape.
   */
  const handleKeyup = event => {
    switch (event.keyCode) {
      case 13: // Enter pressed
        update(event); // Update the text
        break;
      case 27: // Escape pressed
        setText(value); // Reset the text
        setEditing(false); // Close the input
        break;
      default:
        return;
    }
  }

  /**
   * Handles the click event based on whether it is inside the reference node.
   */
  const handleClickOutside = event => {
    if (node.current.contains(event.target)) {
      return;
    }
    update(event);
  };

  /**
   * Updates the text value.
   */
  const update = event => {
    onChange(text);
    setEditing(false);
  }

  return (
    <Box onClick={event => event.stopPropagation()}>
      {editing ? (
        <TextField
          tag={tag}
          size="small"
          variant="outlined"
          autoFocus={true}
          ref={node}
          name={`${id}`}
          type="text"
          placeholder={placeholder}
          value={text}
          onChange={event => setText(event.target.value)} />
      ) : (
        <Grid container="true" direction="row" alignItems="center" className={`${classes.nonEditMode} ${!value && classes.placeholder}`} onDoubleClick={() => setEditing(true)}>
          <Grid item="true">
            <Typography className={classes.typography} variant={tag}>{value || placeholder}</Typography>
          </Grid>
          <Grid item="true">
            <EditIcon className={classes.editIcon} color="action" onClick={() => setEditing(true)}></EditIcon>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}