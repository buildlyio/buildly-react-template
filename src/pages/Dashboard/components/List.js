import React, { useState } from 'react';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import { styled } from '@mui/material/styles';
import {
  Grid, Paper, Popover, Typography,
} from '@mui/material';
import {
  AddRounded as AddRoundedIcon,
  EditRounded as EditRoundedIcon,
  DeleteRounded as DeleteRoundedIcon,
  TrendingFlatRounded as TrendingFlatRoundedIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import {
  Chip,
} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CommentIcon from '@mui/icons-material/Comment';
import AltRouteIcon from '@mui/icons-material/AltRoute';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'auto',
    width: '100%',
  },
  section2: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    color: theme.palette.secondary.contrastText,
  },
  actionTitle: {
    flex: 1,
    marginLeft: theme.spacing(2),
  },
  section3: {
    display: 'flex',
    color: theme.palette.secondary.contrastText,
    flex: 1,
  },
  boxSection: {
    flex: 1,
    marginTop: theme.spacing(2),
    border: `1px solid ${theme.palette.secondary.contrastText}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1, 1, 8, 1),
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'auto',
  },
  addIcon: {
    marginLeft: 'auto',
    marginBottom: theme.spacing(3),
    cursor: 'pointer',
  },
  noData: {
    width: '100%',
    textAlign: 'center',
  },
  boxEntry: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(1, 1, 2, 1),
  },
  entryTitle: {
    flex: 1,
    whiteSpace: 'nowrap',
    marginRight: theme.spacing(1),
  },
  entryIcon: {
    marginRight: theme.spacing(1),
    cursor: 'pointer',
  },
  chip: {
    width: '20%',
  },
  issueDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
  },
  issueBox: {
    backgroundColor: theme.palette.primary.main,
    border: '1px solid #121212',
    margin: theme.spacing(1),
    padding: theme.spacing(0.3, 0.7),
  },
}));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const List = ({
  product,
  productFeatures,
  productIssues,
  addItem,
  editItem,
  deleteItem,
  commentItem,
  issueSuggestions,
}) => {
  const classes = useStyles();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueDetailsAnchorEl, setIssueDetailsAnchorEl] = useState(null);

  const handleIssueDetailsOpenClick = (event, issue) => {
    setSelectedIssue(issue);
    setIssueDetailsAnchorEl(event.currentTarget);
  };

  const handleIssueDetailsCloseClick = () => {
    setIssueDetailsAnchorEl(null);
    setSelectedIssue(null);
  };

  const open = Boolean(issueDetailsAnchorEl);
  const id = open ? 'issue-details-popover' : undefined;

  const [expanded, setExpanded] = React.useState('');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={6} className={classes.gridItem}>
          <div className={classes.section2}>
            <Typography
              className={classes.actionTitle}
              variant="h6"
            >
              Features
            </Typography>
          </div>
          <div className={classes.section3}>
            <div className={classes.boxSection}>
              {product !== 0 && (
              <AddRoundedIcon
                className={classes.addIcon}
                fontSize="large"
                onClick={(e) => addItem('feat')}
              />
              )}
              {product === 0 && (
              <Typography
                className={classes.noData}
                variant="body1"
                style={{ marginTop: '56px' }}
              >
                No Product selected. Please select the product.
              </Typography>
              )}
              {product !== 0 && productFeatures && productFeatures.length === 0 && (
              <Typography
                className={classes.noData}
                variant="body1"
              >
                No features yet.
              </Typography>
              )}
              {product !== 0 && productFeatures && productFeatures.length > 0
                  && _.map(productFeatures, (feat) => (
                    <div
                      key={`feature-${feat.product_uuid}-${feat.feature_uuid}`}
                      className={classes.boxEntry}
                    >
                      <Typography
                        className={classes.entryTitle}
                        variant="body1"
                      >
                        {feat.name}
                      </Typography>
                      {_.filter(productIssues, (issue) => (
                        issue.feature_uuid === feat.feature_uuid)).length === 0
                      && (
                      <TrendingFlatRoundedIcon
                        className={classes.entryIcon}
                        onClick={(e) => issueSuggestions(feat, 'show')}
                      />
                      )}
                      <EditRoundedIcon
                        className={classes.entryIcon}
                        onClick={(e) => editItem(feat, 'feat')}
                      />
                      <DeleteRoundedIcon
                        className={classes.entryIcon}
                        onClick={(e) => deleteItem(feat, 'feat')}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </Grid>

        <Grid item lg={6} className={classes.gridItem}>
          <div className={classes.section2}>
            <Typography
              className={classes.actionTitle}
              variant="h6"
            >
              Issues
            </Typography>
          </div>
          <div className={classes.section3}>
            <div className={classes.boxSection}>
              {product !== 0 && (
              <AddRoundedIcon
                className={classes.addIcon}
                fontSize="large"
                onClick={(e) => addItem('issue')}
              />
              )}
              {product === 0 && (
              <Typography
                className={classes.noData}
                variant="body1"
                style={{ marginTop: '56px' }}
              >
                No Product selected. Please select the product.
              </Typography>
              )}
              {product !== 0 && productIssues && productIssues.length === 0 && (
              <Typography
                className={classes.noData}
                variant="body1"
              >
                No Issues yet.
              </Typography>
              )}
              <div>
                {product !== 0 && productIssues && productIssues.length > 0
                && productFeatures && productFeatures.length > 0
                    && _.map(productFeatures, (feat, ind) => (
                      <Accordion expanded={expanded === feat} onChange={handleChange(feat)} key={`feat-${ind}`}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                          <Typography>{feat.name}</Typography>
                        </AccordionSummary>
                        {productIssues
                          .filter((iss) => (iss.feature_uuid === feat.feature_uuid))
                          .map((issue, index) => (
                            <AccordionDetails>
                              <div
                                className={classes.boxEntry}
                                key={index}
                              >
                                <Typography
                                  className={classes.entryTitle}
                                  variant="body1"
                                >
                                  {issue.name }
                                  <span className={classes.issueBox}>{issue.issue_type}</span>
                                </Typography>
                                <EditRoundedIcon
                                  className={classes.entryIcon}
                                  onClick={(e) => editItem(issue, 'issue')}
                                />
                                <DeleteRoundedIcon
                                  className={classes.entryIcon}
                                  onClick={(e) => deleteItem(issue, 'issue')}
                                />
                                <CommentIcon
                                  className={classes.entryIcon}
                                  onClick={(e) => commentItem()}
                                />
                                <InfoIcon
                                  className={classes.entryIcon}
                                  onClick={(e) => handleIssueDetailsOpenClick(e, issue)}
                                  aria-describedby={id}
                                />
                              </div>
                            </AccordionDetails>
                          ))}
                      </Accordion>
                    ))}
              </div>
            </div>
          </div>
        </Grid>
        {
          selectedIssue
          && (
          <Popover
            id={id}
            open={open}
            anchorEl={issueDetailsAnchorEl}
            onClose={handleIssueDetailsCloseClick}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Paper elevation={3} className={classes.issueDetails}>
              {
                selectedIssue.estimate
                  && (
                  <Chip
                    variant="outlined"
                    icon={<UpdateIcon fontSize="small" />}
                    label={`${selectedIssue.estimate}:00 Hrs`}
                  />
                  )
              }
              {
                selectedIssue.end_date
                  && (
                    <Chip
                      variant="outlined"
                      icon={<DateRangeIcon fontSize="small" />}
                      label={(selectedIssue.end_date).slice(0, 10)}
                    />
                  )
              }
              {productFeatures
                .filter((feat) => (feat.feature_uuid === selectedIssue.feature_uuid))
                .map((feat, ind) => (
                  <Chip
                    key={ind}
                    variant="outlined"
                    icon={<AltRouteIcon fontSize="small" />}
                    label={feat.name}
                    onClick={() => editItem(feat, 'feat', true)}
                  />
                ))}
            </Paper>
          </Popover>
          )
        }
      </Grid>
    </>
  );
};

export default List;
