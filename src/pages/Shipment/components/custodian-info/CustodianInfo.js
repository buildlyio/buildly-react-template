import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles, Box, Typography, Grid, Button,
} from '@material-ui/core';
import Modal from '@components/Modal/Modal';
import DataTable from '@components/Table/Table';
import { UserContext } from '@context/User.context';
import { editShipment } from '@redux/shipment/actions/shipment.actions';
import { routes } from '@routes/routesConstants';
import ConfirmModal from '@components/Modal/ConfirmModal';
import AddCustodyForm, { checkIfCustodianInfoEdited } from './AddCustodyForm';
import {
  getFormattedCustodyRows,
  custodyColumns,
} from '../../ShipmentConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: 'center',
    justifyContent: 'center',
  },
  alignRight: {
    marginLeft: 'auto',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
    },
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
    custodianData,
    history,
    handleNext,
    handleCancel,
    shipmentFormData,
    dispatch,
    custodyData,
    viewOnly,
  } = props;
  const classes = useStyles();
  const [itemIds, setItemIds] = useState(
    (shipmentFormData && shipmentFormData.custodian_ids) || [],
  );
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (
      custodyData
      && custodyData.length
      && custodianData
      && custodianData.length
      && shipmentFormData
    ) {
      const filteredCustodyData = custodyData.filter(
        (data) => data.shipment_id === shipmentFormData.shipment_uuid,
      );
      const customizedRows = getFormattedCustodyRows(
        filteredCustodyData,
        custodianData,
      );
      setRows(customizedRows);
    }
  }, [custodyData, custodianData, shipmentFormData]);

  const submitDisabled = () => !itemIds || custodianData === null;

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const shipmentFormValue = {
      ...{ ...shipmentFormData, custodian_ids: itemIds },
    };
    dispatch(
      editShipment(
        shipmentFormValue,
        history,
        `${routes.SHIPMENT}/edit/:${shipmentFormData.id}`,
        organization,
      ),
    );
    setOpenModal(false);
  };

  const deleteItem = (item) => {
    const index = itemIds.indexOf(item.custodian_uuid);
    const newArr = itemIds.filter((value, idx) => idx !== index);
    const shipmentFormValue = {
      ...{ ...shipmentFormData, custodian_ids: newArr },
    };
    dispatch(
      editShipment(
        shipmentFormValue,
        history,
        `${routes.SHIPMENT}/edit/:${shipmentFormData.id}`,
        organization,
      ),
    );
    setItemIds(newArr);
  };

  const handleConfirmModal = () => {
    setConfirmModal(false);
    setOpenModal(false);
  };

  const oncloseModal = () => {
    if (checkIfCustodianInfoEdited()) {
      setConfirmModal(true);
    } else {
      setEditItem(null);
      setOpenModal(false);
    }
  };

  const editCustody = (item) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const actionsColumns = [
    // { id: 'unlink', type: 'unlink', action: deleteItem, label: 'Unassociate' },
    {
      id: 'edit',
      type: viewOnly ? 'view' : 'edit',
      action: editCustody,
      label: viewOnly ? 'View' : 'Edit',
    },
  ];

  return (
    <Box mb={5} mt={3}>
      <Button
        variant="contained"
        color="primary"
        disabled={viewOnly}
        onClick={() => setOpenModal(true)}
        className={classes.submit}
      >
        Add Custody
      </Button>
      <Box mt={3} mb={5}>
        <Grid container>
          {rows.length > 0 && (
            <Grid item xs={12}>
              <Box mt={5}>
                <Typography gutterBottom variant="h5">
                  Associated Custodians
                </Typography>
                <DataTable
                  rows={rows || []}
                  columns={custodyColumns}
                  actionsColumns={actionsColumns}
                  hasSearch={false}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        {openModal && (
          <Modal
            open={openModal}
            setOpen={() => oncloseModal()}
            title={
              !editItem
                ? 'Add Custody'
                : `${viewOnly ? 'View' : 'Edit'} Custody`
            }
            titleClass={classes.formTitle}
            maxWidth="md"
          >
            <AddCustodyForm
              setItemIds={setItemIds}
              itemIds={itemIds}
              setOpenModal={() => oncloseModal()}
              rows={rows}
              viewOnly={viewOnly}
              editItem={editItem}
              {...props}
            />
          </Modal>
        )}
      </Box>
      <Grid container spacing={3} className={classes.buttonContainer}>
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
      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title="Your changes are unsaved and will be discarded. Are you sure to leave?"
        submitText="Yes"
      />
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.custodianReducer,
  ...state.shipmentReducer,
  ...state.authReducer,
});

export default connect(mapStateToProps)(CustodianInfo);
