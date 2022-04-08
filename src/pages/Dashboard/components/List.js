import React from 'react';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import {
  AddRounded as AddRoundedIcon,
  EditRounded as EditRoundedIcon,
  DeleteRounded as DeleteRoundedIcon,
  TrendingFlatRounded as TrendingFlatRoundedIcon,
} from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
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
  },
  rightBox: {
    marginLeft: theme.spacing(2),
  },
  boxSection: {
    flex: 1,
    marginTop: theme.spacing(2),
    border: `1px solid ${theme.palette.secondary.contrastText}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1, 1, 8, 1),
    display: 'flex',
    flexDirection: 'column',
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
  },
  entryIcon: {
    marginRight: theme.spacing(2),
    cursor: 'pointer',
  },
  icon: {
    cursor: 'pointer',
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
}) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.section2}>
        <Typography
          className={classes.actionTitle}
          variant="h6"
        >
          Features
        </Typography>
        <Typography
          className={`${classes.actionTitle} ${classes.rightBox}`}
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
                  className={classes.icon}
                  onClick={(e) => deleteItem(feat, 'feat')}
                />
              </div>
            ))}
        </div>

        <div className={`${classes.boxSection} ${classes.rightBox}`}>
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
                  className={classes.icon}
                  onClick={(e) => deleteItem(issue, 'issue')}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default List;
