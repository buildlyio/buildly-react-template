/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  AddRounded,
  EditRounded,
  DeleteRounded,
  TrendingFlatRounded,
} from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  noProduct: {
    marginTop: theme.spacing(12),
    textAlign: 'center',
  },
  container: {
    marginBottom: theme.spacing(4),
  },
  swimlane: {
    backgroundColor: theme.palette.secondary.main,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    borderBottom: `1px solid ${theme.palette.secondary.contrastText}`,
    padding: '16px',
    fontWeight: 600,
  },
  card: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.neutral.main,
    color: theme.palette.neutral.contrastText,
    '& span.MuiCardHeader-subheader': {
      color: theme.palette.neutral.contrastText,
    },
  },
  chip: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('lg')]: {
      marginTop: theme.spacing(1),
    },
  },
  moment: {
    marginTop: theme.spacing(3),
    textAlign: 'right',
  },
  iconButton: {
    padding: 0,
    marginLeft: theme.spacing(1),
  },
}));

const Kanban = ({
  statuses,
  product,
  productFeatures,
  productIssues,
  addItem,
  editItem,
  convertIssue,
  deleteItem,
}) => {
  const classes = useStyles();
  const [columns, setColumns] = useState({});

  useEffect(() => {
    let cols = {};
    if (statuses && !_.isEmpty(statuses)) {
      _.forEach(statuses, (sts) => {
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
      });
      setColumns(cols);
    }
  }, [statuses, productFeatures, productIssues]);

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
                <div>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {_.map(column.items, (item, itemIndex) => (
                          <Draggable
                            key={item.issue_uuid
                              ? item.issue_uuid
                              : item.feature_uuid}
                            draggableId={item.issue_uuid
                              ? item.issue_uuid
                              : item.feature_uuid}
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
                                  backgroundColor: snapshot.isDragging
                                    ? '#F6F8FA'
                                    : '#FFFFFF',
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <CardHeader
                                  subheader={item.name}
                                  action={(
                                    <div>
                                      {index === 0 && (
                                        <IconButton
                                          aria-label="convert-ticket"
                                          aria-controls="menu-card"
                                          aria-haspopup="false"
                                          color="secondary"
                                          onClick={(e) => convertIssue(item, 'convert')}
                                          size="large"
                                          className={classes.iconButton}
                                        >
                                          <TrendingFlatRounded fontSize="small" />
                                        </IconButton>
                                      )}
                                      <IconButton
                                        aria-label="edit-ticket"
                                        aria-controls="menu-card"
                                        aria-haspopup="false"
                                        color="secondary"
                                        onClick={(e) => editItem(item, item.featureUUID ? 'issue' : 'feat')}
                                        size="large"
                                        className={classes.iconButton}
                                      >
                                        <EditRounded fontSize="small" />
                                      </IconButton>
                                      <IconButton
                                        aria-label="delete-ticket"
                                        aria-controls="menu-card"
                                        aria-haspopup="false"
                                        color="secondary"
                                        onClick={(e) => deleteItem(item, item.featureUUID ? 'issue' : 'feat')}
                                        size="large"
                                        className={classes.iconButton}
                                      >
                                        <DeleteRounded fontSize="small" />
                                      </IconButton>
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
                                      className={classes.chip}
                                    />
                                  ))}
                                  <Typography
                                    className={classes.moment}
                                    component="div"
                                    variant="body2"
                                  >
                                    {moment(item.create_date).fromNow()}
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

export default Kanban;
