import React from 'react';
import MUIDataTable from 'mui-datatables';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid,
  Button,
  IconButton,
  Box,
  Typography,
  MenuItem,
  Menu,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import Loader from '@components/Loader/Loader';
import ConfirmModal from '@components/Modal/ConfirmModal';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    placeContent: 'center space-between',
    alignItems: 'center',
  },
  roadmapHeading: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
  iconButton: {
    padding: theme.spacing(1.5, 0.5),
  },
  addButton: {
    backgroundColor: theme.palette.contrast.text,
    '&:hover': {
      backgroundColor: theme.palette.contrast.text,
    },
  },
}));

const DataTableWrapper = ({
  loading,
  rows,
  columns,
  filename,
  addButtonHeading,
  onAddButtonClick,
  children,
  editAction,
  roadmapAction,
  menuActions,
  deleteAction,
  openDeleteModal,
  setDeleteModal,
  handleDeleteModal,
  deleteModalTitle,
  tableHeight,
  tableHeader,
  hideAddButton,
  selectable,
  selected,
  customSort,
  noCustomTheme,
  noSpace,
  noOptionsIcon,
  menuIndex,
  setMenuIndex,
}) => {
  const classes = useStyles();
  // dropdown menu variables
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event, dataIndex) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(dataIndex);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let finalColumns = [];

  finalColumns = [
    ...finalColumns,
    ...columns,
  ];

  if (editAction || deleteAction || menuActions || roadmapAction) {
    finalColumns = [
      ...finalColumns,
      {
        name: 'Actions',
        options: {
          sort: false,
          filter: false,
          empty: true,
          customBodyRenderLite: (dataIndex) => (
            <>
              <IconButton onClick={(e) => handleClick(e, dataIndex)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={
                  {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }
                }
                transformOrigin={{
                  horizontal: 'right',
                  vertical: 'top',
                }}
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'bottom',
                }}
              >
                {
                  editAction && (
                    <MenuItem onClick={(e) => editAction(rows[menuIndex])}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      Edit
                    </MenuItem>
                  )
                }
                {
                  roadmapAction && (
                  <MenuItem onClick={(e) => roadmapAction(rows[menuIndex])}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    Roadmap
                  </MenuItem>
                  )
                }
                { menuActions }
                {
                  deleteAction && (
                    <div>
                      <Divider />
                      <MenuItem onClick={() => deleteAction(rows[menuIndex])}>
                        <ListItemIcon>
                          <DeleteIcon style={{ color: 'red' }} fontSize="small" />
                        </ListItemIcon>
                        <span style={{ color: 'red' }}>Delete</span>
                      </MenuItem>
                    </div>
                  )
                }
              </Menu>
            </>
          ),
        },
      },
    ];
  }

  const options = {
    download: !noOptionsIcon,
    print: !noOptionsIcon,
    search: !noOptionsIcon,
    viewColumns: !noOptionsIcon,
    filter: !noOptionsIcon,
    filterType: 'multiselect',
    responsive: 'standard',
    tableBodyHeight: tableHeight || '',
    selectableRows: selectable && selectable.rows
      ? selectable.rows
      : 'none',
    selectToolbarPlacement: 'none',
    selectableRowsHeader: selectable && selectable.rowsHeader
      ? selectable.rowsHeader
      : true,
    selectableRowsHideCheckboxes: selectable && selectable.rowsHideCheckboxes
      ? selectable.rowsHideCheckboxes
      : false,
    rowsSelected: selected || [],
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: noOptionsIcon
      ? {
        filename: 'nothing.csv',
        separator: ',',
      }
      : {
        filename: `${filename}.csv`,
        separator: ',',
      },
    textLabels: {
      body: {
        noMatch: 'No data to display',
      },
    },
    setRowProps: (row, dataIndex, rowIndex) => !noCustomTheme && ({
      className: classes.dataTableBody,
    }),
    customSort,
  };

  return (
    <Box mt={noSpace ? 0 : 5} mb={noSpace ? 0 : 5}>
      {loading && <Loader open={loading} />}
      <div>
        <section className={classes.header}>
          {tableHeader && (
          <Typography className={classes.roadmapHeading} variant="h4">
            {tableHeader}
          </Typography>
          )}

          {!hideAddButton && (
          <Box mb={3} mt={2}>
            <Button
              type="button"
              variant="outlined"
              className={classes.addButton}
              onClick={onAddButtonClick}
            >
              <AddIcon />
              {` ${addButtonHeading}`}
            </Button>
          </Box>
          )}
        </section>

        <Grid className={`${!noCustomTheme && classes.dataTable}`} container spacing={2}>
          <Grid item xs={12}>
            <MUIDataTable
              data={rows}
              columns={finalColumns}
              options={options}
            />
          </Grid>
        </Grid>

        {children}
      </div>

      {deleteAction && openDeleteModal && setDeleteModal && handleDeleteModal
      && deleteModalTitle && (
        <ConfirmModal
          open={openDeleteModal}
          setOpen={setDeleteModal}
          submitAction={handleDeleteModal}
          title={deleteModalTitle}
          submitText="Delete"
        />
      )}
    </Box>
  );
};

export default DataTableWrapper;
