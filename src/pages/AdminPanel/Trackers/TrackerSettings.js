import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import Devices from './forms/Devices';
import '../AdminPanelStyles.css';

const Configuration = (props) => (
  <div className="adminPanelRoot">
    <Accordion className="adminPanelAccordion">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="new-tracker-content"
        id="new-tracker-header"
      >
        <Typography variant="h5">
          New Devices
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Devices isNewDevices />
      </AccordionDetails>
    </Accordion>
    <Accordion className="adminPanelAccordion">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="reuse-tracker-content"
        id="reuse-tracker-header"
      >
        <Typography variant="h5">
          Reuse Devices
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Devices isNewDevices={false} />
      </AccordionDetails>
    </Accordion>
  </div>
);

export default Configuration;
