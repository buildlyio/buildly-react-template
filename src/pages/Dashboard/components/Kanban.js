/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  DragDropContext,
  Draggable,
  Droppable,
} from 'react-beautiful-dnd';
import { makeStyles } from '@mui/styles';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  AddRounded as AddRoundedIcon,
  AddTask as AddTaskIcon,
  AltRoute as AltRouteIcon,
  Comment as CommentIcon,
  Close as CloseIcon,
  DateRange as DateRangeIcon,
  MoreHoriz as MoreHorizIcon,
  Task as TaskIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { updateFeature, updateIssue } from '@redux/release/actions/release.actions';

const useStyles = makeStyles((theme) => ({
  noProduct: {
    marginTop: theme.spacing(12),
    textAlign: 'center',
  },
  container: {
    flexWrap: 'nowrap',
    overflowX: 'auto',
    paddingBottom: theme.spacing(4),
  },
  swimlane: {
    backgroundColor: theme.palette.secondary.main,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '22%',
    height: '100%',
  },
  title: {
    color: theme.palette.contrast.text,
    borderBottom: `1px solid ${theme.palette.contrast.text}`,
    padding: '16px',
    fontWeight: 600,
  },
  addIcon: {
    color: theme.palette.contrast.text,
  },
  card: {
    margin: theme.spacing(1),
  },
  chip: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  tag: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.neutral.text,
  },
  moment: {
    marginTop: theme.spacing(3),
    textAlign: 'left',
  },
  iconButton: {
    padding: 0,
    marginLeft: theme.spacing(1),
  },
  comment: {
    float: 'right',
    cursor: 'pointer',
  },
  columnBody: {
    [theme.breakpoints.up('lg')]: {
      height: '63vh',
    },
    overflowY: 'auto',
  },
}));

const options = [
  'Edit',
  'Delete',
];

const Kanban = ({
  dispatch,
  selectedProduct,
  features,
  issues,
  statuses,
  credentials,
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
  const [columns, setColumns] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(null);

  const handleClick = (event, number) => {
    setAnchorEl(event.currentTarget);
    setCurrentNumber(number);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentNumber(null);
  };

  useEffect(() => {
    let cols = {};
    if (statuses && !_.isEmpty(statuses)) {
      _.forEach(statuses, (sts) => {
        const feats = _.filter(features, { status: sts.status_uuid });
        const iss = _.filter(issues, { status: sts.status_uuid });
        const items = [...feats, ...iss];
        cols = {
          ...cols,
          [sts.status_uuid]: {
            name: sts.name,
            items: _.orderBy(items, 'create_date', 'desc'),
          },
        };
        if (sts.name === 'No Status' && !items.length) {
          delete cols[sts.status_uuid];
        }
      });

      setColumns(cols);
    }
  }, [statuses, features, issues]);

  const onDragEnd = (result, columns, setColumns) => {
    const featCred = _.find(credentials, { auth_detail: { tool_type: 'Feature' } });
    const issueCred = _.find(credentials, { auth_detail: { tool_type: 'Issue' } });

    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      // Update status of the card on drag and drop to other column
      removed.status = destination.droppableId;
      const currentStatData = _.find(statuses, { status_uuid: destination.droppableId });
      removed.column_id = currentStatData.status_tracking_id;

      let updateData = {};
      if (removed.issue_uuid) {
        updateData = {
          ...removed,
          ...issueCred?.auth_detail,
        };
        dispatch(updateIssue(updateData));
      } else {
        updateData = {
          ...removed,
          ...featCred?.auth_detail,
        };
        dispatch(updateFeature(updateData));
      }
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <>
      {!selectedProduct && (
        <Typography className={classes.noProduct} component="div" variant="body1">
          No product selected yet. Please select a product to view related features and/or issues.
        </Typography>
      )}

      {!!selectedProduct && upgrade && (
        <FormHelperText error style={{ marginBottom: '16px' }}>
          Upgrade to be able to create more features
        </FormHelperText>
      )}

      {!!selectedProduct && (
        <DragDropContext
          onDragEnd={(result) => {
            onDragEnd(result, columns, setColumns);
          }}
        >
          <Grid container rowGap={2} columnGap={4} className={classes.container}>
            {!!selectedProduct && suggestedFeatures && !_.isEmpty(suggestedFeatures) && (
              <Grid item xs={2.6} sm={2.75} lg={2.85} className={classes.swimlane}>
                <div>
                  <Typography className={classes.title} component="div" variant="body1">
                    Feature Suggestions
                  </Typography>
                </div>

                <div className={classes.columnBody}>
                  {_.map(suggestedFeatures, (sug, idx) => (
                    <Card key={`suggestion-${sug.suggestion_uuid}`} className={classes.card} variant="outlined">
                      <CardHeader
                        subheader={sug.suggested_feature}
                        action={(
                          <div>
                            <IconButton
                              aria-label="product-suggestion-add"
                              aria-haspopup="false"
                              color="secondary"
                              onClick={(e) => createSuggestedFeature(sug)}
                              size="large"
                              className={classes.iconButton}
                            >
                              <AddTaskIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                              aria-label="product-suggestion-remove"
                              aria-haspopup="false"
                              color="secondary"
                              onClick={(e) => removeSuggestedFeature(sug)}
                              size="large"
                              className={classes.iconButton}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </div>
                        )}
                      />
                    </Card>
                  ))}
                </div>
              </Grid>
            )}

            {_.map(Object.entries(columns), ([columnId, column], index) => (
              <Grid key={columnId} item xs={2.6} sm={2.75} lg={2.85} className={classes.swimlane}>
                <div>
                  <Typography className={classes.title} component="div" variant="body1">
                    {column.name}
                  </Typography>

                  <IconButton onClick={(e) => addItem(index === 0 ? 'feat' : 'issue')} size="large">
                    <AddRoundedIcon fontSize="small" className={classes.addIcon} />
                  </IconButton>
                </div>

                <div className={classes.columnBody}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {_.map(column.items, (item, itemIndex) => (
                          <Draggable
                            key={
                              item.issue_uuid
                                ? item.issue_uuid
                                : item.feature_uuid
                            }
                            draggableId={
                              item.issue_uuid
                                ? item.issue_uuid
                                : item.feature_uuid
                            }
                            index={itemIndex}
                          >
                            {(provided, snapshot) => (
                              <Card
                                className={classes.card}
                                variant="outlined"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: 'none',
                                  backgroundColor: item?.feature_detail?.is_imported
                                  || item?.issue_detail?.is_imported
                                    ? '#e0e0e0'
                                    : '#FFFFFF',
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <CardHeader
                                  subheader={item.name}
                                  action={(
                                    <div>
                                      {!item.issue_uuid && _.filter(issues, (issue) => (
                                        issue.feature_uuid === item.feature_uuid
                                      )).length === 0 && (
                                        <IconButton
                                          aria-label="issue-suggestion"
                                          aria-controls="menu-card"
                                          aria-haspopup="false"
                                          color="secondary"
                                          onClick={(e) => issueSuggestions(item, 'show')}
                                          size="large"
                                          className={classes.iconButton}
                                        >
                                          <TaskIcon fontSize="small" />
                                        </IconButton>
                                      )}

                                      <IconButton
                                        id="menu-button"
                                        aria-label="column-options"
                                        aria-controls="menu-column"
                                        aria-haspopup="true"
                                        color="secondary"
                                        aria-expanded
                                        onClick={(e) => handleClick(e, item)}
                                      >
                                        <MoreHorizIcon />
                                      </IconButton>

                                      <Menu
                                        id="long-menu"
                                        MenuListProps={{
                                          'aria-labelledby': 'long-button',
                                        }}
                                        anchorEl={anchorEl}
                                        open={currentNumber === item}
                                        PaperProps={{
                                          style: {
                                            maxHeight: 48 * 4.5,
                                            width: '20ch',
                                          },
                                        }}
                                        onClick={handleClose}
                                      >
                                        {_.map(options, (option, optInd) => (
                                          <MenuItem
                                            key={optInd}
                                            selected={option === 'Edit'}
                                            onClick={(e) => {
                                              const type = item.issue_uuid ? 'issue' : 'feat';
                                              if (option === 'Edit') {
                                                editItem(item, type);
                                              } else {
                                                deleteItem(item, type);
                                              }
                                            }}
                                          >
                                            {option}
                                          </MenuItem>
                                        ))}
                                      </Menu>
                                    </div>
                                  )}
                                />

                                <CardContent style={{ paddingBottom: '16px' }}>
                                  {_.map(item.tags, (tag) => (
                                    <Chip
                                      key={item.issue_uuid
                                        ? `tag-${item.issue_uuid}-${tag}`
                                        : `tag-${item.feature_uuid}-${tag}`}
                                      label={tag}
                                      variant="outlined"
                                      color="primary"
                                      className={classes.tag}
                                    />
                                  ))}

                                  {item.estimate && (
                                    <Chip
                                      variant="outlined"
                                      color="primary"
                                      className={classes.chip}
                                      icon={<UpdateIcon fontSize="small" />}
                                      label={`${item.estimate}:00 Hrs`}
                                    />
                                  )}

                                  {item.end_date && (
                                    <Chip
                                      variant="outlined"
                                      color="primary"
                                      className={classes.chip}
                                      icon={<DateRangeIcon fontSize="small" />}
                                      label={(item.end_date).slice(0, 10)}
                                    />
                                  )}

                                  {item.issue_uuid && _.map(
                                    _.filter(features, (feat) => (
                                      feat.feature_uuid === item.feature_uuid
                                    )),
                                    (feat, ind) => (
                                      <Chip
                                        key={ind}
                                        variant="outlined"
                                        color="primary"
                                        className={classes.chip}
                                        icon={<AltRouteIcon fontSize="small" />}
                                        label={feat.name}
                                        onClick={() => editItem(feat, 'feat', true)}
                                      />
                                    ),
                                  )}

                                  <Typography className={classes.moment} component="div" variant="body2">
                                    {moment(item.create_date).fromNow()}
                                    {/* <CommentIcon
                                      className={classes.comment}
                                      onClick={(e) => commentItem()}
                                    /> */}
                                  </Typography>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  features: state.releaseReducer.features,
  issues: state.releaseReducer.issues,
  statuses: state.releaseReducer.statuses,
  credentials: state.productReducer.credentials,
});

export default connect(mapStateToProps)(Kanban);
