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
} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CommentIcon from '@mui/icons-material/Comment';
import {
  AddRounded,
  TrendingFlatRounded,
  MoreHoriz,
} from '@mui/icons-material';
import {
  getAllStatuses,
} from '@redux/decision/actions/decision.actions';
import { updateFeature, updateIssue } from '@redux/decision/actions/decision.actions';

const useStyles = makeStyles((theme) => ({
  noProduct: {
    marginTop: theme.spacing(12),
    textAlign: 'center',
  },
  container: {
    marginBottom: theme.spacing(4),
    flexWrap: 'inherit',
  },
  swimlane: {
    backgroundColor: theme.palette.secondary.main,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '22%',
    height: '100%',
  },
  title: {
    borderBottom: `1px solid ${theme.palette.secondary.contrastText}`,
    padding: '16px',
    fontWeight: 600,
  },
  card: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.neutral.main,
    color: theme.palette.neutral.contrastText,
    '& span.MuiCardHeader-subheader': {
      color: theme.palette.neutral.contrastText,
    },
  },
  chip: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  tag: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
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
    maxHeight: '56vh',
    overflowY: 'auto',
  },
}));

const options = [
  'Edit',
  'Delete',
];

const Kanban = ({
  statuses,
  product,
  productFeatures,
  productIssues,
  addItem,
  editItem,
  issueSuggestions,
  deleteItem,
  commentItem,
  dispatch,
  credentials,
}) => {
  const classes = useStyles();
  const [columns, setColumns] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(null);
  const open = Boolean(anchorEl);
  const [status, setStatus] = useState('');

  const handleClick = (event, number) => {
    setAnchorEl(event.currentTarget);
    setCurrentNumber(number);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentNumber(null);
  };

  useEffect(() => {
    if (!status || _.isEmpty(status)) {
      dispatch(getAllStatuses());
    }
  }, []);

  useEffect(() => {
    const sta = _.filter(statuses, { product_uuid: product });
    setStatus(sta);
  }, [statuses, product]);

  useEffect(() => {
    let cols = {};
    if (status && !_.isEmpty(status)) {
      _.forEach(status, (sts) => {
        const features = _.filter(
          productFeatures,
          { status: sts.status_uuid },
        );
        const issues = _.filter(
          productIssues,
          { status: sts.status_uuid },
        );
        const items = [...features, ...issues];
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
  }, [status, productFeatures, productIssues]);

  const featCred = _.find(
    credentials,
    { product_uuid: product, auth_detail: { tool_type: 'Feature' } },
  );
  const issueCred = _.find(
    credentials,
    { product_uuid: product, auth_detail: { tool_type: 'Issue' } },
  );
  const currentStat = _.filter(statuses, { product_uuid: product });

  const onDragEnd = (result, columns, setColumns) => {
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
      const currentStatData = _.find(currentStat, { status_uuid: destination.droppableId });
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
      {!product && (
        <Typography
          className={classes.noProduct}
          component="div"
          variant="body1"
        >
          No product selected yet. Please select a product
          to view related features and/or issues.
        </Typography>
      )}
      {!!product && (
        <DragDropContext
          onDragEnd={(result) => {
            onDragEnd(result, columns, setColumns);
          }}
        >
          <Grid
            container
            rowGap={2}
            columnGap={2}
            className={classes.container}
          >
            {_.map(Object.entries(columns), ([columnId, column], index) => (
              <Grid
                key={columnId}
                item
                xs={2.6}
                sm={2.75}
                lg={2.85}
                className={classes.swimlane}
              >
                <div>
                  <Typography
                    className={classes.title}
                    component="div"
                    variant="body1"
                  >
                    {column.name}
                  </Typography>
                  <IconButton onClick={(e) => addItem(index === 0 ? 'feat' : 'issue')} size="large">
                    <AddRounded fontSize="small" />
                  </IconButton>
                </div>
                <div className={classes.columnBody}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
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
                                      {!item.issue_uuid && _.filter(productIssues, (issue) => (
                                        issue.feature_uuid === item.feature_uuid)).length === 0
                                        && (
                                        <IconButton
                                          aria-label="issue-suggestion"
                                          aria-controls="menu-card"
                                          aria-haspopup="false"
                                          color="secondary"
                                          onClick={(e) => issueSuggestions(item, 'show')}
                                          size="large"
                                          className={classes.iconButton}
                                        >
                                          <TrendingFlatRounded fontSize="small" />
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
                                        <MoreHoriz />
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
                                  {item.estimate
                                  && (
                                  <Chip
                                    variant="outlined"
                                    color="primary"
                                    className={classes.chip}
                                    icon={<UpdateIcon fontSize="small" />}
                                    label={`${item.estimate}:00 Hrs`}
                                  />
                                  )}
                                  {item.end_date
                                    && (
                                    <Chip
                                      variant="outlined"
                                      color="primary"
                                      className={classes.chip}
                                      icon={<DateRangeIcon fontSize="small" />}
                                      label={(item.end_date).slice(0, 10)}
                                    />
                                    )}

                                  {item.issue_uuid && productFeatures
                                    .filter((feat) => (feat.feature_uuid === item.feature_uuid))
                                    .map((feat, ind) => (
                                      <Chip
                                        key={ind}
                                        variant="outlined"
                                        color="primary"
                                        className={classes.chip}
                                        icon={<AltRouteIcon fontSize="small" />}
                                        label={feat.name}
                                        onClick={() => editItem(feat, 'feat', true)}
                                      />
                                    ))}
                                  <Typography
                                    className={classes.moment}
                                    component="div"
                                    variant="body2"
                                  >
                                    {moment(item.create_date).fromNow()}
                                    <CommentIcon
                                      className={classes.comment}
                                      onClick={(e) => commentItem()}
                                    />
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
  ...state.decisionReducer,
});

export default connect(mapStateToProps)(Kanban);
