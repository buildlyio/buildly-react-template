import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  AddRounded as AddRoundedIcon,
  EditRounded as EditRoundedIcon,
  DeleteRounded as DeleteRoundedIcon,
  TrendingFlatRounded as TrendingFlatRoundedIcon,
} from '@material-ui/icons';

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

const List = (props) => {
  const {
    products,
    requirements,
    issues,
    proj,
    setProj,
    projReqs,
    setProjReqs,
    projIssues,
    setProjIssues,
    addItem,
    editItem,
    convertIssue,
    deleteItem,
  } = props;
  const classes = useStyles();

  return (
    <div>
      <div className={classes.section2}>
        <Typography
          className={classes.actionTitle}
          variant="h6"
        >
          Requirements
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
          <AddRoundedIcon
            className={classes.addIcon}
            fontSize="large"
            onClick={(e) => addItem('req')}
          />
          {proj === 0 && (
            <Typography
              className={classes.noData}
              variant="body1"
            >
              No Project selected. Please select the product.
            </Typography>
          )}
          {proj !== 0 && projReqs && projReqs.length === 0
                        && (
                        <Typography
                          className={classes.noData}
                          variant="body1"
                        >
                          No Requirements yet.
                        </Typography>
                        )}
          {proj !== 0 && projReqs && projReqs.length > 0
                        && _.map(projReqs, (req) => (
                          <div
                            key={`req-${req.projectID}-${req.id}`}
                            className={classes.boxEntry}
                          >
                            <Typography
                              className={classes.entryTitle}
                              variant="body1"
                            >
                              {req.name}
                            </Typography>
                            <TrendingFlatRoundedIcon
                              className={classes.entryIcon}
                              onClick={(e) => convertIssue(req, 'convert')}
                            />
                            <EditRoundedIcon
                              className={classes.entryIcon}
                              onClick={(e) => editItem(req, 'req')}
                            />
                            <DeleteRoundedIcon
                              className={classes.icon}
                              onClick={(e) => deleteItem(req, 'req')}
                            />
                          </div>
                        ))}

        </div>

        <div className={`${classes.boxSection} ${classes.rightBox}`}>
          <AddRoundedIcon
            className={classes.addIcon}
            fontSize="large"
            onClick={(e) => addItem('issue')}
          />
          {proj === 0 && (
            <Typography
              className={classes.noData}
              variant="body1"
            >
              No Project selected. Please select the product.
            </Typography>
          )}
          {proj !== 0 && projIssues && projIssues.length === 0
                        && (
                        <Typography
                          className={classes.noData}
                          variant="body1"
                        >
                          No Issues yet.
                        </Typography>
                        )}
          {proj !== 0 && projIssues && projIssues.length > 0
                        && _.map(projIssues, (issue) => (
                          <div
                            key={`issue-${issue.projectID}-${issue.id}`}
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

    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.dashboardReducer,
});

export default connect(mapStateToProps)(List);
