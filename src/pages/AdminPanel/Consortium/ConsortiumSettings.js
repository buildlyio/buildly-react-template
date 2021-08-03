import React from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import CustomizedTooltips from '@components/ToolTip/ToolTip';
import {
  MAPPING_TOOLTIP,
  CONSORTIUM_TOOLTIP,
} from './ConsortiumConstant';
import Consortium from './components/Consortium';
import MappingOrg from './components/MappingOrg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(6),
  },
  accordian: {
    backgroundColor: '#4F4D4D',
    marginBottom: theme.spacing(4),
    overflowX: 'scroll',
  },
}));

const Configuration = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="mappingorg-content"
          id="mappingorg-header"
        >
          <Typography variant="h5">
            Mapping Custodian Organization
            <CustomizedTooltips toolTipText={MAPPING_TOOLTIP} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MappingOrg {...props} />
        </AccordionDetails>
      </Accordion>

      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="consortium-content"
          id="consortium-header"
        >
          <Typography variant="h5">
            Consortium
            <CustomizedTooltips toolTipText={CONSORTIUM_TOOLTIP} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Consortium {...props} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(Configuration);
