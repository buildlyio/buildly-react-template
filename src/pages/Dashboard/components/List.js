import React, { useState } from 'react';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Chip,
  Divider,
  FormHelperText,
  Grid,
  Paper,
  Popover,
  Typography,
} from '@mui/material';
import {
  AddRounded as AddRoundedIcon,
  AddTask as AddTaskIcon,
  AltRoute as AltRouteIcon,
  Close as CloseIcon,
  Comment as CommentIcon,
  DateRange as DateRangeIcon,
  DeleteRounded as DeleteRoundedIcon,
  EditRounded as EditRoundedIcon,
  Info as InfoIcon,
  TrendingFlatRounded as TrendingFlatRoundedIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';

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
  },
  actionTitle: {
    flex: 1,
    marginLeft: theme.spacing(2),
  },
  section3: {
    display: 'flex',
    flex: 1,
  },
  boxSection: {
    flex: 1,
    marginTop: theme.spacing(2),
    border: '1px solid',
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

const List = ({
  product,
  productFeatures,
  productIssues,
  addItem,
  editItem,
  deleteItem,
  commentItem,
  issueSuggestions,
  upgrade,
  productSuggestions,
  createSuggestedFeature,
  removeSuggestedFeature,
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

  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={6} className={classes.gridItem}>
          <div className={classes.section2}>
            <Typography className={classes.actionTitle} variant="h6">
              Features
            </Typography>

            {!!product && upgrade && (
              <FormHelperText error>
                Upgrade to be able to create more features
              </FormHelperText>
            )}
          </div>

          <div className={classes.section3}>
            <div className={classes.boxSection}>
              {!!product && !upgrade && (
                <AddRoundedIcon
                  className={classes.addIcon}
                  fontSize="large"
                  onClick={(e) => addItem('feat')}
                />
              )}

              {product === 0 && (
                <Typography className={classes.noData} variant="body1" style={{ marginTop: '56px' }}>
                  No Product selected. Please select the product.
                </Typography>
              )}

              {!!product && productFeatures && _.isEmpty(productFeatures)
              && productSuggestions && _.isEmpty(productSuggestions) && (
              <Typography className={classes.noData} variant="body1">
                No features yet.
              </Typography>
              )}

              {!!product && productSuggestions && !_.isEmpty(productSuggestions)
              && _.map(productSuggestions, (sug) => (
                <div key={`suggestion-${sug.suggestion_uuid}`} className={classes.boxEntry}>
                  <Typography className={classes.entryTitle} variant="body1">
                    {sug.suggested_feature}
                    {' '}
                    (Suggested Feature)
                  </Typography>

                  <AddTaskIcon
                    className={classes.entryIcon}
                    onClick={(e) => createSuggestedFeature(sug)}
                  />

                  <CloseIcon
                    className={classes.entryIcon}
                    onClick={(e) => removeSuggestedFeature(sug)}
                  />
                </div>
              ))}

              {!!product && productSuggestions && !_.isEmpty(productSuggestions)
              && productFeatures && !_.isEmpty(productFeatures) && <Divider />}

              {!!product && productFeatures && !_.isEmpty(productFeatures)
              && _.map(productFeatures, (feat) => (
                <div key={`feature-${feat.product_uuid}-${feat.feature_uuid}`} className={classes.boxEntry}>
                  <Typography className={classes.entryTitle} variant="body1">
                    {feat.name}
                  </Typography>

                  {_.isEmpty(_.filter(productIssues, (issue) => (
                    issue.feature_uuid === feat.feature_uuid
                  ))) && (
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
            <Typography className={classes.actionTitle} variant="h6">
              Issues
            </Typography>
          </div>

          <div className={classes.section3}>
            <div className={classes.boxSection}>
              {!!product && (
                <AddRoundedIcon
                  className={classes.addIcon}
                  fontSize="large"
                  onClick={(e) => addItem('issue')}
                />
              )}

              {product === 0 && (
                <Typography className={classes.noData} variant="body1" style={{ marginTop: '56px' }}>
                  No Product selected. Please select the product.
                </Typography>
              )}

              {!!product && productIssues && _.isEmpty(productIssues) && (
                <Typography className={classes.noData} variant="body1">
                  No Issues yet.
                </Typography>
              )}

              <div>
                {!!product && productIssues && !_.isEmpty(productIssues)
                && _.map(productIssues, (issue) => (
                  <div key={`issue-${issue.product_uuid}-${issue.issue_uuid}`} className={classes.boxEntry}>
                    <Typography className={classes.entryTitle} variant="body1">
                      {issue.name}
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
                      aria-describedby={issueDetailsAnchorEl ? 'issue-details-popover' : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Grid>

        {selectedIssue && (
          <Popover
            id={issueDetailsAnchorEl ? 'issue-details-popover' : undefined}
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
              {selectedIssue.estimate && (
                <Chip
                  variant="outlined"
                  icon={<UpdateIcon fontSize="small" />}
                  label={`${selectedIssue.estimate}:00 Hrs`}
                />
              )}

              {selectedIssue.end_date && (
                <Chip
                  variant="outlined"
                  icon={<DateRangeIcon fontSize="small" />}
                  label={(selectedIssue.end_date).slice(0, 10)}
                />
              )}

              {_.map(
                _.filter(productFeatures, (feat) => (
                  feat.feature_uuid === selectedIssue.feature_uuid
                )),
                (feat, ind) => (
                  <Chip
                    key={ind}
                    variant="outlined"
                    icon={<AltRouteIcon fontSize="small" />}
                    label={feat.name}
                    onClick={() => editItem(feat, 'feat', false)}
                  />
                ),
              )}
            </Paper>
          </Popover>
        )}
      </Grid>
    </>
  );
};

export default List;
