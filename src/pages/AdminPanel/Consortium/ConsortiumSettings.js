import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import MappingOrg from './components/MappingOrg';
import Consortium from './components/Consortium';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(6),
  },
  accordion: {
    marginBottom: theme.spacing(4),
    overflowX: 'scroll',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}));

const Configuration = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordion}>
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
      <Accordion className={classes.accordion}>
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
};

export default Configuration;
