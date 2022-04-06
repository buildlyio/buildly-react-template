import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Box,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FormModal from '../../../../components/Modal/FormModal';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import Loader from '../../../../components/Loader/Loader';
import AddCustodyForm, {
  checkIfCustodianInfoEdited,
} from './AddCustodyForm';
import {
  getFormattedCustodyRows,
  custodyColumns,
} from '../../ShipmentConstants';
import {
  deleteCustody,
} from '../../../../redux/custodian/actions/custodian.actions';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: 'center',
    justifyContent: 'center',
  },
  submit: {
    borderRadius: '18px',
    fontSize: 11,
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
}));

const CustodianInfo = (props) => {
  const {
    dispatch,
    custodianData,
    handleNext,
    handleCancel,
    shipmentFormData,
    custodyData,
    viewOnly,
    loading,
    timezone,
  } = props;
  const classes = useStyles();
  const [itemIds, setItemIds] = useState(
    (shipmentFormData && shipmentFormData.custodian_ids) || [],
  );
  const [openFormModal, setFormModal] = useState(false);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    if ((
      custodyData
      && custodyData.length
      && custodianData
      && custodianData.length
      && shipmentFormData
    ) || (_.isEmpty(custodyData) && custodianData && custodianData.length && shipmentFormData)) {
      const filteredCustodyData = _.filter(
        custodyData,
        { shipment_id: shipmentFormData.shipment_uuid },
      );
      const customizedRows = getFormattedCustodyRows(
        filteredCustodyData,
        custodianData,
      );
      setRows(customizedRows);
    }
  }, [custodyData, custodianData, shipmentFormData]);

  const handleConfirmModal = () => {
    setConfirmModal(false);
    setFormModal(false);
  };

  const oncloseModal = () => {
    if (checkIfCustodianInfoEdited()) {
      setConfirmModal(true);
    } else {
      setEditItem(null);
      setFormModal(false);
    }
  };

  const editCustody = (item) => {
    setEditItem(item);
    setFormModal(true);
  };

  const deleteCustodyItem = (item) => {
    setDeleteItem(item.id);
    setDeleteModal(true);
  };

  const handleDeleteModal = () => {
    dispatch(deleteCustody(deleteItem, shipmentFormData.id, shipmentFormData.organization_uuid));
    setDeleteModal(false);
  };

  return (
    <Box mb={5} mt={3}>
      <Button
        variant="contained"
        color="primary"
        disabled={viewOnly}
        onClick={() => setFormModal(true)}
        className={classes.submit}
      >
        Add Custody
      </Button>
      <Box mt={3} mb={5}>
        {loading && <Loader open={loading} />}
        {rows.length > 0 && (
        <Grid container>
          <Grid item xs={12}>
            <Box mt={5}>
              <Typography gutterBottom variant="h5">
                Associated Custodians
              </Typography>
              <DataTableWrapper
                loading={loading}
                rows={rows}
                columns={custodyColumns(timezone)}
                editAction={editCustody}
                deleteAction={deleteCustodyItem}
                openDeleteModal={openDeleteModal}
                setDeleteModal={setDeleteModal}
                handleDeleteModal={handleDeleteModal}
                deleteModalTitle="Are you sure you want to Delete this Custody?"
                hideAddButton
                noOptionsIcon
                noSpace
              />
            </Box>
          </Grid>
        </Grid>
        )}
        {openFormModal && (
          <FormModal
            open={openFormModal}
            handleClose={oncloseModal}
            title={
              !editItem
                ? 'Add Custody'
                : `${viewOnly ? 'View' : 'Edit'} Custody`
            }
            titleClass={classes.formTitle}
            maxWidth="md"
            openConfirmModal={openConfirmModal}
            setConfirmModal={setConfirmModal}
            handleConfirmModal={handleConfirmModal}
          >
            <AddCustodyForm
              setItemIds={setItemIds}
              itemIds={itemIds}
              setOpenModal={oncloseModal}
              rows={rows}
              viewOnly={viewOnly}
              editItem={editItem}
              {...props}
            />
          </FormModal>
        )}
      </Box>
      <Grid
        container
        spacing={3}
        className={classes.buttonContainer}
      >
        {viewOnly && (
          <Grid item xs={6} sm={2}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleCancel}
            >
              Done
            </Button>
          </Grid>
        )}
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleNext}
            className={classes.submit}
          >
            Save & Next: Sensors & Gateways
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.custodianReducer,
  ...state.shipmentReducer,
  ...state.authReducer,
  ...state.optionsReducer,
  loading: (
    state.custodianReducer.loading
    || state.shipmentReducer.loading
    || state.authReducer.loading
    || state.optionsReducer.loading
  ),
});

export default connect(mapStateToProps)(CustodianInfo);
