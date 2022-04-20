import React from 'react';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import { Grid, Typography } from '@mui/material';
import {
  AddRounded as AddRoundedIcon,
  EditRounded as EditRoundedIcon,
  DeleteRounded as DeleteRoundedIcon,
  TrendingFlatRounded as TrendingFlatRoundedIcon,
} from '@mui/icons-material';
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
}));

const List = ({
  product,
  productFeatures,
  productIssues,
  addItem,
  editItem,
  convertIssue,
  deleteItem,
  commentItem,
}) => {
  const classes = useStyles();

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
                      <TrendingFlatRoundedIcon
                        className={classes.entryIcon}
                        onClick={(e) => convertIssue(feat, 'convert')}
                      />
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
                    && _.map(productIssues, (issue) => (
                      <div
                        key={`issue-${issue.product_uuid}-${issue.issue_uuid}`}
                        className={classes.boxEntry}
                      >
                        <Typography
                          className={classes.entryTitle}
                          variant="body1"
                        >
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
                        <Chip
                          variant="outlined"
                          icon={<UpdateIcon fontSize="small" />}
                          label={`${issue.estimate}:00 Hrs`}
                        />
                        <Chip
                          variant="outlined"
                          icon={<DateRangeIcon fontSize="small" />}
                          label={(issue.end_date).slice(0, 10)}
                        />
                        {productFeatures
                          .filter((feat) => (feat.feature_uuid === issue.feature_uuid))
                          .map((feat, ind) => (
                            <Chip
                              key={ind}
                              variant="outlined"
                              className={classes.chip}
                              icon={<AltRouteIcon fontSize="small" />}
                              label={feat.name}
                              onClick={() => editItem(feat, 'feat', true)}
                            />
                          ))}
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default List;
