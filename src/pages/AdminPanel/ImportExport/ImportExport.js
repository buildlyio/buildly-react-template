import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import AddFromFile from './forms/AddFromFile';
import AddFromAPI from './forms/AddFromAPI';
import ExportData from './forms/ExportData';
import '../AdminPanelStyles.css';

const ImportExport = (props) => (
  <div className="root">
    <Accordion className="accordion">
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
        <AddFromFile {...props} />
      </AccordionDetails>
    </Accordion>
    <Accordion className="accordion">
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
        <AddFromAPI {...props} />
      </AccordionDetails>
    </Accordion>
    <Accordion className="accordion">
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
        <ExportData {...props} />
      </AccordionDetails>
    </Accordion>
  </div>
);

export default ImportExport;
