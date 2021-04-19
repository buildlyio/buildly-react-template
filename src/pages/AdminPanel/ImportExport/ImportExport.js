import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddFromFile from "./forms/AddFromFile";
import AddFromAPI from "./forms/AddFromAPI";
import ExportData from "./forms/ExportData";

const useStyles = makeStyles((theme) => ({
  accordian: {
    backgroundColor: "#393636",
    marginBottom: theme.spacing(4),
  },
  form: {
    width: "100%",
    margin: theme.spacing(1),
    backgroundColor: "#424242",
    padding: theme.spacing(1, 2),
  },
}));

const ImportExport = () => {
  const classes = useStyles();

  return (
    <Box mt={5} mb={5}>
      <Accordion className={classes.accordian}>
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
      <Accordion className={classes.accordian}>
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
      <Accordion className={classes.accordian}>
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
  )
}

export default ImportExport;
