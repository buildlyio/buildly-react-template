import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton, Typography } from '@mui/material';
import {
  AddTask as AddTaskIcon,
  Close as CloseIcon,
  Comment as CommentIcon,
  Link as LinkIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { featureColumns, issueColumns } from '../DashboardConstants';

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
}) => {
  const classes = useStyles();
  const [featureRows, setFeatureRows] = useState([]);
  const [finalFeatCols, setFinalFeatCols] = useState([]);
  const [issueRows, setIssueRows] = useState([]);
  const [finalIssCols, setFinalIssCols] = useState([]);
  const [finalSugCols, setFinalSugCols] = useState([]);

  useEffect(() => {
    const featCols = [
      {
        name: 'Comments',
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRenderLite: (dataIndex) => (
            <IconButton onClick={() => commentItem(featureRows[dataIndex])}>
              <CommentIcon />
            </IconButton>
          ),
        },
      },
      {
        name: 'Convert to issue/ticket for dev team',
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRenderLite: (dataIndex) => {
            const issuePresent = !!(_.find(issueRows, {
              feature_uuid: featureRows[dataIndex]?.feature_uuid,
            }));

            return !issuePresent
              ? (
                <IconButton onClick={() => issueSuggestions(featureRows[dataIndex])}>
                  <TaskIcon />
                </IconButton>
              ) : '';
          },
        },
      },
      ...featureColumns,
    ];

    const issCols = [
      {
        name: 'Comments',
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRenderLite: (dataIndex) => (
            <IconButton onClick={() => commentItem(issueRows[dataIndex])}>
              <CommentIcon />
            </IconButton>
          ),
        },
      },
      {
        name: 'View linked feature',
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRenderLite: (dataIndex) => (
            <IconButton
              onClick={() => {
                const feat = _.find(features, { feature_uuid: issueRows[dataIndex]?.feature_uuid });
                editItem(feat, 'feat', true);
              }}
            >
              <LinkIcon />
            </IconButton>
          ),
        },
      },
      ...issueColumns,
    ];

    setFinalFeatCols(featCols);
    setFinalIssCols(issCols);
  }, [featureRows, issueRows]);

  useEffect(() => {
    const featRows = _.map(features, (feat) => ({
      ...feat,
      _status: _.find(statuses, { status_uuid: feat.status })?.name,
    }));

    const issRows = _.map(issues, (iss) => ({
      ...iss,
      _status: _.find(statuses, { status_uuid: iss.status })?.name,
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
            columns={finalFeatCols}
            filename="FeaturesList"
            hideAddButton={!selectedProduct || (!!selectedProduct && upgrade)}
            addButtonHeading="Add Feature"
            onAddButtonClick={(e) => addItem('feat')}
            editAction={(feat) => editItem(feat, 'feat')}
            deleteAction={(feat) => deleteItem(feat, 'feat')}
            tableHeader="Features"
          />
        </div>
      )}

      {!!selectedProduct && (
        <div className={`${classes.tabular} ${classes.tabular2}`}>
          <DataTableWrapper
            loading={loading}
            rows={issueRows}
            columns={finalIssCols}
            filename="IssuesList"
            hideAddButton={!selectedProduct || (!!selectedProduct && upgrade)}
            addButtonHeading="Add Issue"
            onAddButtonClick={(e) => addItem('issue')}
            editAction={(issue) => editItem(issue, 'issue')}
            deleteAction={(issue) => deleteItem(issue, 'issue')}
            tableHeader="Issues"
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
});

export default connect(mapStateToProps)(Tabular);
