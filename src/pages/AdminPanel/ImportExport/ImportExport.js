import React from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import AddFromFile from './forms/AddFromFile';
import AddFromAPI from './forms/AddFromAPI';
import ExportData from './forms/ExportData';

const useStyles = makeStyles((theme) => ({
  accordion: {
    backgroundColor: theme.palette.background.dark,
    marginBottom: theme.spacing(4),
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  form: {
    width: '100%',
    margin: theme.spacing(1),
    backgroundColor: theme.palette.common.darkGrey2,
    padding: theme.spacing(1, 2),
  },
}));

const ImportExport = () => {
  const classes = useStyles();

  return (
    <Box mt={5} mb={5}>
      <Accordion className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="import-file-content"
          id="import-file-header"
        >
          <Typography variant="h5">
            Import from File
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.form}>
            <AddFromFile />
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="import-api-content"
          id="import-api-header"
        >
          <Typography variant="h5">
            Import from API
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.form}>
            <AddFromAPI />
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="export-content"
          id="export-header"
        >
          <Typography variant="h5">
            Export Data
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.form}>
            <ExportData />
          </div>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ImportExport;
