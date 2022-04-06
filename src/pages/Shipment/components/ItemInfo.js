import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  TextField,
  Box,
  Checkbox,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Chip,
  Autocomplete,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
} from '@mui/icons-material';
import DataTableWrapper from '../../../components/DataTableWrapper/DataTableWrapper';
import { UserContext } from '../../../context/User.context';
import { getFormattedRow } from '../../../pages/Items/ItemsConstants';
import { editShipment } from '../../../redux/shipment/actions/shipment.actions';
import { routes } from '../../../routes/routesConstants';
import { itemColumns } from '../ShipmentConstants';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: 'center',
    justifyContent: 'center',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  loadingWrapper: {
    position: 'relative',
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
}));

// eslint-disable-next-line import/no-mutable-exports
export let checkIfItemInfoEdited;

const ItemsInfo = ({
  itemData,
  itemTypeList,
  history,
  loading,
  handleNext,
  handleCancel,
  shipmentFormData,
  dispatch,
  unitsOfMeasure,
  viewOnly,
  setConfirmModal,
  setConfirmModalFor,
}) => {
  const classes = useStyles();
  const [itemIds, setItemIds] = useState(
    (shipmentFormData && shipmentFormData.items) || [],
  );
  const organization = useContext(UserContext).organization.organization_uuid;

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  let rows = [];

  if (itemData && itemData.length) {
    let selectedRows = [];
    _.forEach(itemData, (item) => {
      if (_.indexOf(itemIds, item.url) !== -1) {
        selectedRows = [...selectedRows, item];
      }
    });
    rows = getFormattedRow(selectedRows, itemTypeList, unitsOfMeasure);
  }

  const onInputChange = (value) => {
    switch (true) {
      case (value.length > itemIds.length):
        setItemIds([...itemIds, _.last(value).url]);
        break;

      case (value.length < itemIds.length):
        setItemIds(value);
        break;

      default:
        break;
    }
  };

  const submitDisabled = () => (
    itemIds.length === 0
    || itemData === null
  );

  checkIfItemInfoEdited = () => !!(itemIds.length !== shipmentFormData.items.length);
  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const shipmentFormValue = {
      ...{ ...shipmentFormData, items: itemIds },
    };
    dispatch(
      editShipment(
        shipmentFormValue,
        history,
        `${routes.SHIPMENT}/edit/:${shipmentFormData.id}`,
        organization,
      ),
    );
  };

  const onNextClick = (event) => {
    if (checkIfItemInfoEdited()) {
      handleSubmit(event);
    }
    handleNext();
  };

  const onCancelClick = () => {
    if (checkIfItemInfoEdited()) {
      setConfirmModalFor('close');
      setConfirmModal(true);
    } else {
      handleCancel();
    }
  };

  return (
    <Box mb={5} mt={3}>
      <form noValidate onSubmit={handleSubmit}>
        <Card variant="outlined" className={classes.form}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  disabled={viewOnly}
                  disableCloseOnSelect
                  options={
                    (
                      itemData
                      && _.orderBy(
                        itemData,
                        ['name'],
                        ['asc'],
                      )
                    ) || []
                  }
                  getOptionLabel={(option) => (
                    option
                    && option.name
                  )}
                  isOptionEqualToValue={(option, value) => (
                    option.url === value
                  )}
                  filterSelectedOptions
                  value={itemIds}
                  onChange={(event, newValue) => onInputChange(newValue)}
                  renderTags={(value, getTagProps) => (
                    _.map(value, (option, index) => (
                      <Chip
                        variant="default"
                        label={
                          itemData
                            ? _.find(itemData, { url: option })?.name
                            : ''
                        }
                        {...getTagProps({ index })}
                      />
                    ))
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8, color: '#fff' }}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      disabled={viewOnly}
                      variant="outlined"
                      label="Select items to be associated"
                      placeholder="Select an item"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box mt={3} mb={5}>
          {rows.length > 0 && (
          <Grid container>
            <Grid item xs={12}>
              <Box mt={5}>
                <Typography gutterBottom variant="h5">
                  Associated Items
                </Typography>
                <DataTableWrapper
                  loading={loading}
                  rows={rows}
                  columns={itemColumns}
                  hideAddButton
                  noOptionsIcon
                  noSpace
                />
              </Box>
            </Grid>
          </Grid>
          )}
        </Box>
        <Grid
          container
          spacing={3}
          className={classes.buttonContainer}
        >
          <Grid item xs={6} sm={2}>
            {viewOnly ? (
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onCancelClick}
              >
                Done
              </Button>
            ) : (
              <div className={classes.loadingWrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={loading || submitDisabled()}
                >
                  Save
                </Button>
                {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
                )}
              </div>
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onNextClick}
              className={classes.submit}
            >
              Save & Next: Custodians
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
  ...state.shipmentReducer,
  loading: (
    state.itemsReducer.loading
    || state.shipmentReducer.loading
  ),
});

export default connect(mapStateToProps)(ItemsInfo);
