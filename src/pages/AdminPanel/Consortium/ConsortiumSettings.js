import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import MappingOrg from './components/MappingOrg';
import Consortium from './components/Consortium';
import '../AdminPanelStyles.css';

const Configuration = (props) => (
  <div className="adminPanelRoot">
    <Accordion className="adminPanelAccordion">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="mappingorg-content"
        id="mappingorg-header"
      >
        <Typography variant="h5">
          Mapping Custodian Organization
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MappingOrg {...props} />
      </AccordionDetails>
    </Accordion>
    <Accordion className="adminPanelAccordion">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="consortium-content"
        id="consortium-header"
      >
        <Typography variant="h5">
          Consortium
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Consortium {...props} />
      </AccordionDetails>
    </Accordion>
  </div>
);

export default Configuration;
