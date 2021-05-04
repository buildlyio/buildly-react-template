import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import {
  makeStyles,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import ConfirmModal from '@components/Modal/ConfirmModal';
import Loader from '@components/Loader/Loader';
import { UserContext } from '@context/User.context';
import {
  getItems,
  deleteItem,
  getItemType,
  getUnitsOfMeasure,
  getProducts,
  getProductType,
} from '@redux/items/actions/items.actions';
import {
  getItemsOptions,
  getProductsOptions,
} from '@redux/options/actions/options.actions';
import { routes } from '@routes/routesConstants';
import { itemColumns, getFormattedRow } from './ItemsConstants';
import AddItems from './forms/AddItems';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
  iconButton: {
    padding: theme.spacing(1.5, 0),
  },
  dataTableBody: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#4F4D4D',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#383636',
    },
    '&:hover': {
      backgroundColor: '#000 !important',
    },
  },
  dataTable: {
    '& .MuiPaper-root': {
      backgroundColor: '#383636',
    },
    '& tr > th': {
      backgroundColor: '#383636',
    },
  },
}));

const Items = ({
  dispatch,
  history,
  itemData,
  loading,
  itemTypeList,
  redirectTo,
  unitsOfMeasure,
  products,
  itemOptions,
  productOptions,
}) => {
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState('');
  const [rows, setRows] = useState([]);
  const organization = useContext(UserContext).organization.organization_uuid;

  const addItemPath = redirectTo
    ? `${redirectTo}/items`
    : `${routes.ITEMS}/add`;

  const editItemPath = redirectTo
    ? `${redirectTo}/items`
    : `${routes.ITEMS}/edit`;

  const options = {
    filter: true,
    filterType: 'multiselect',
    responsive: 'standard',
    selectableRows: 'none',
    selectToolbarPlacement: 'none',
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: {
      filename: 'ItemData.csv',
      separator: ',',
    },
    textLabels: {
      body: {
        noMatch: 'No data to display',
      },
    },
    setRowProps: (row, dataIndex, rowIndex) => ({
      className: classes.dataTableBody,
    }),
  };

  useEffect(() => {
    if (itemData === null) {
      dispatch(getItems(organization));
      dispatch(getItemType(organization));
    }
    if (!unitsOfMeasure) {
      dispatch(getUnitsOfMeasure());
    }
    if (products === null) {
      dispatch(getProducts(organization));
      dispatch(getProductType(organization));
    }
    if (itemOptions === null) {
      dispatch(getItemsOptions());
    }
    if (productOptions === null) {
      dispatch(getProductsOptions());
    }
  }, []);

  useEffect(() => {
    if (
      itemData
      && itemData.length
      && itemTypeList
      && itemTypeList.length
      && unitsOfMeasure
      && unitsOfMeasure.length
    ) {
      setRows(getFormattedRow(
        itemData,
        itemTypeList,
        unitsOfMeasure,
      ));
    }
  }, [itemData, itemTypeList, unitsOfMeasure]);

  const editItem = (item) => {
    history.push(`${editItemPath}/:${item.id}`, {
      type: 'edit',
      from: redirectTo || routes.ITEMS,
      data: item,
    });
  };

  const deleteItems = (item) => {
    setDeleteItemId(item.id);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteItem(deleteItemId, organization));
    setConfirmModal(false);
  };

  const columns = [
    {
      name: 'Edit',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => (
          <IconButton
            className={classes.iconButton}
            onClick={() => editItem(rows[dataIndex])}
          >
            <EditIcon />
          </IconButton>
        ),
      },
    },
    {
      name: 'Delete',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => (
          <IconButton
            onClick={() => deleteItems(rows[dataIndex])}
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
    },
    ...itemColumns,
  ];

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <div>
        <Box mb={3} mt={2}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() => history.push(addItemPath, {
              from: redirectTo || routes.ITEMS,
            })}
          >
            <AddIcon />
            {' '}
            Add Item
          </Button>
        </Box>
        {!redirectTo && (
          <Typography
            className={classes.dashboardHeading}
            variant="h4"
          >
            Items
          </Typography>
        )}
        <Grid
          className={classes.dataTable}
          container
          spacing={2}
        >
          <Grid item xs={12}>
            <MUIDataTable
              data={rows}
              columns={columns}
              options={options}
            />
          </Grid>
        </Grid>
        <Route path={`${addItemPath}`} component={AddItems} />
        <Route path={`${editItemPath}/:id`} component={AddItems} />
      </div>

      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title="Are you sure you want to delete this item?"
        submitText="Delete"
      />
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
  ...state.optionsReducer,
  loading: state.itemsReducer.loading || state.optionsReducer.loading,
});
export default connect(mapStateToProps)(Items);
