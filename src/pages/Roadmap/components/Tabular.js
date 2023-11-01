import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Divider, IconButton, ListItemIcon, MenuItem, Typography,
} from '@mui/material';
import {
  AddTask as AddTaskIcon,
  CallSplit as CallSplitIcon,
  Close as CloseIcon,
  Comment as CommentIcon,
  Link as LinkIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { featureColumns, issueColumns } from '../RoadmapConstants';

const useStyles = makeStyles((theme) => ({
  upgrade: {},
  tabular: {
    padding: theme.spacing(5),
    paddingTop: 0,
  },
  tabular2: {
    marginTop: `-${theme.spacing(5)}`,
  },
  noProduct: {
    marginTop: theme.spacing(12),
    textAlign: 'center',
  },
}));

const Tabular = ({
  loading,
  selectedProduct,
  statuses,
  features,
  issues,
  addItem,
  editItem,
  deleteItem,
  commentItem,
  issueSuggestions,
  upgrade,
  suggestedFeatures,
  createSuggestedFeature,
  removeSuggestedFeature,
  comments,
  showRelatedIssues,
}) => {
  const classes = useStyles();
  const [featureRows, setFeatureRows] = useState([]);
  const [featMenuActions, setFeatMenuActions] = useState([]);
  const [issueRows, setIssueRows] = useState([]);
  const [issueMenuActions, setIssueMenuActions] = useState([]);
  const [finalSugCols, setFinalSugCols] = useState([]);
  const [menuIndex, setMenuIndex] = useState(0);

  useEffect(() => {
    const fma = (
      <div>
        <Divider />
        <MenuItem onClick={(e) => commentItem(featureRows[menuIndex])}>
          <ListItemIcon>
            <CommentIcon fontSize="small" />
          </ListItemIcon>
          Comments (
          {_.size(_.filter(comments, { feature: featureRows[menuIndex]?.feature_uuid }))}
          )
        </MenuItem>

        <Divider />
        <MenuItem onClick={(e) => issueSuggestions(featureRows[menuIndex])}>
          <ListItemIcon>
            <TaskIcon fontSize="small" />
          </ListItemIcon>
          Convert to issue/ticket for dev team
        </MenuItem>

        <Divider />
        <MenuItem onClick={(e) => showRelatedIssues(featureRows[menuIndex]?.feature_uuid)}>
          <ListItemIcon>
            <CallSplitIcon fontSize="small" />
          </ListItemIcon>
          Show Related Issues
        </MenuItem>
      </div>
    );
    setFeatMenuActions(fma);
  }, [featureRows, menuIndex, comments]);

  useEffect(() => {
    const ima = (
      <div>
        <Divider />
        <MenuItem onClick={(e) => commentItem(issueRows[menuIndex])}>
          <ListItemIcon>
            <CommentIcon fontSize="small" />
          </ListItemIcon>
          Comments
        </MenuItem>

        {!!issueRows[menuIndex] && !!issueRows[menuIndex].feature_uuid && (
          <>
            <Divider />
            <MenuItem
              onClick={(e) => {
                const feat = _.find(features, { feature_uuid: issueRows[menuIndex].feature_uuid });
                editItem(feat, 'feat', true);
              }}
            >
              <ListItemIcon>
                <LinkIcon fontSize="small" />
              </ListItemIcon>
              View linked feature
            </MenuItem>
          </>
        )}
      </div>
    );
    setIssueMenuActions(ima);
  }, [features, issueRows, menuIndex, comments]);

  useEffect(() => {
    const featRows = _.map(features, (feat) => ({
      ...feat,
      _status: _.find(statuses, { status_uuid: feat.status })?.name,
      _url: feat.feature_detail?.url || '',
    }));

    const issRows = _.map(issues, (iss) => ({
      ...iss,
      _status: _.find(statuses, { status_uuid: iss.status })?.name,
      _url: iss.issue_detail?.url || '',
    }));

    setFeatureRows(featRows);
    setIssueRows(issRows);
  }, [statuses, features, issues]);

  useEffect(() => {
    if (suggestedFeatures && !_.isEmpty(suggestedFeatures)) {
      const cols = [
        {
          name: 'suggested_feature',
          label: 'Suggested Feature',
          options: {
            sort: true,
            sortThirdClickReset: true,
            filter: true,
            customBodyRender: (value) => value || '',
          },
        },
        {
          name: 'Accept this suggestion',
          options: {
            filter: false,
            sort: false,
            empty: true,
            setCellProps: (value) => ({
              style: { width: 200 },
            }),
            setCellHeaderProps: (value) => ({
              style: { width: 200 },
            }),
            customBodyRenderLite: (dataIndex) => (
              <IconButton onClick={() => createSuggestedFeature(suggestedFeatures[dataIndex])}>
                <AddTaskIcon />
              </IconButton>
            ),
          },
        },
        {
          name: 'Discard this suggestion',
          options: {
            filter: false,
            sort: false,
            empty: true,
            setCellProps: (value) => ({
              style: { width: 200 },
            }),
            setCellHeaderProps: (value) => ({
              style: { width: 200 },
            }),
            customBodyRenderLite: (dataIndex) => (
              <IconButton onClick={() => removeSuggestedFeature(suggestedFeatures[dataIndex])}>
                <CloseIcon />
              </IconButton>
            ),
          },
        },
      ];
      setFinalSugCols(cols);
    }
  }, [suggestedFeatures]);

  return (
    <>
      {!selectedProduct && (
        <Typography className={classes.noProduct} component="div" variant="body1">
          No product selected yet. Please select a product to view related features and/or issues.
        </Typography>
      )}

      {!!selectedProduct && upgrade && (
        <Typography variant="h6" align="center">
          Upgrade to be able to create more features
        </Typography>
      )}

      {!!selectedProduct && suggestedFeatures && !_.isEmpty(suggestedFeatures) && (
        <div className={classes.tabular}>
          <DataTableWrapper
            loading={loading}
            rows={suggestedFeatures}
            columns={finalSugCols}
            filename="SuggestedFeaturesList"
            hideAddButton
            tableHeader="Suggested Features"
          />
        </div>
      )}

      {!!selectedProduct && (
        <div
          className={
            suggestedFeatures && !_.isEmpty(suggestedFeatures)
              ? `${classes.tabular} ${classes.tabular2}`
              : classes.tabular
          }
        >
          <DataTableWrapper
            loading={loading}
            rows={featureRows}
            columns={featureColumns}
            filename="FeaturesList"
            hideAddButton={!selectedProduct || (!!selectedProduct && upgrade)}
            addButtonHeading="Add Feature"
            onAddButtonClick={(e) => addItem('feat')}
            editAction={(feat) => editItem(feat, 'feat')}
            deleteAction={(feat) => deleteItem(feat, 'feat')}
            tableHeader="Features"
            menuActions={featMenuActions}
            menuIndex={menuIndex}
            setMenuIndex={setMenuIndex}
          />
        </div>
      )}

      {!!selectedProduct && (
        <div className={`${classes.tabular} ${classes.tabular2}`}>
          <DataTableWrapper
            loading={loading}
            rows={issueRows}
            columns={issueColumns}
            filename="IssuesList"
            hideAddButton={!selectedProduct || (!!selectedProduct && upgrade)}
            addButtonHeading="Add Issue"
            onAddButtonClick={(e) => addItem('issue')}
            editAction={(issue) => editItem(issue, 'issue')}
            deleteAction={(issue) => deleteItem(issue, 'issue')}
            tableHeader="Issues"
            menuActions={issueMenuActions}
            menuIndex={menuIndex}
            setMenuIndex={setMenuIndex}
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  features: state.releaseReducer.features,
  issues: state.releaseReducer.issues,
  statuses: state.releaseReducer.statuses,
  comments: state.releaseReducer.comments,
  releases: state.releaseReducer.releases,
});

export default connect(mapStateToProps)(Tabular);
