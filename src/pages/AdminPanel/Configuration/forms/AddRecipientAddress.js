import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import {
  Grid,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import Loader from '@components/Loader/Loader';
import FormModal from '@components/Modal/FormModal';
import { getUser } from '@context/User.context';
import useAlert from '@hooks/useAlert';
import { useInput } from '@hooks/useInput';
import { getCountriesQuery } from '@react-query/queries/shipments/getCountriesQuery';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { useAddRecipientAddressMutation } from '@react-query/mutations/recipientaddress/addRecipientAddressMutation';
import { useEditRecipientAddressMutation } from '@react-query/mutations/recipientaddress/editRecipientAddressMutation';
import { validators } from '@utils/validators';
import { isDesktop } from '@utils/mediaQuery';
import '../../AdminPanelStyles.css';

const AddRecipientAddress = ({ history, location }) => {
  const { organization_uuid } = getUser().organization;
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const { displayAlert } = useAlert();

  const editPage = location.state && location.state.type === 'edit';
  const editData = (editPage && location.state.data) || {};

  const name = useInput((editData && editData.name) || '', { required: true });
  const country = useInput((editData && editData.country) || '', {
    required: true,
  });
  const state = useInput((editData && editData.state) || '', {
    required: true,
  });
  const address_1 = useInput((editData && editData.address1) || '', {
    required: true,
  });
  const address_2 = useInput((editData && editData.address2) || '');
  const city = useInput((editData && editData.city) || '', {
    required: true,
  });
  const zip = useInput((editData && editData.postal_code) || '', {
    required: true,
  });
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Recipient Address';
  const formTitle = editPage ? 'Edit Recipient Address' : 'Add Recipient Address';

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery(
    ['countries'],
    () => getCountriesQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization_uuid],
    () => getUnitQuery(organization_uuid, displayAlert),
    { refetchOnWindowFocus: false },
  );

  useEffect(() => {
    const defaultCountry = !_.isEmpty(unitData) && _.find(
      unitData,
      (unit) => _.toLower(unit.unit_of_measure_for) === 'country',
    ).unit_of_measure;
    if (!country.value && defaultCountry && !_.isEmpty(countriesData)) {
      const found = _.find(countriesData, { country: defaultCountry });
      if (found) {
        country.setValue(found.iso3);
      }
    }
  }, [unitData, countriesData]);

  const closeFormModal = () => {
    if (name.hasChanged() || country.hasChanged() || state.hasChanged() || address_1.hasChanged() || address_2.hasChanged() || city.hasChanged() || state.hasChanged()) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      if (location && location.state) {
        history.push(location.state.from);
      }
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    if (location && location.state) {
      history.push(location.state.from);
    }
  };

  const { mutate: addRecipientAddressMutation, isLoading: isAddingRecipientAddress } = useAddRecipientAddressMutation(history, location.state.from, displayAlert);

  const { mutate: editRecipientAddressMutation, isLoading: isEditingRecipientAddress } = useEditRecipientAddressMutation(history, location.state.from, displayAlert);

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      ...editData,
      name: name.value,
      country: country.value,
      state: state.value,
      address1: address_1.value,
      address2: address_2.value,
      city: city.value,
      postal_code: zip.value,
      organization_uuid,
    };
    if (editPage) {
      editRecipientAddressMutation(data);
    } else {
      addRecipientAddressMutation(data);
    }
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input, parentId) => {
    const validateObj = validators(validation, input);
    const prevState = { ...formError };
    if (validateObj && validateObj.error) {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    } else {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: {
          error: false,
          message: '',
        },
      });
    }
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (!name.value || !country.value || !state.value || !address_1.value || !city.value || !zip.value) {
      return true;
    }
    let errorExists = false;
    _.forEach(errorKeys, (key) => {
      if (formError[key].error) {
        errorExists = true;
      }
    });
    return errorExists;
  };

  return (
    <div>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={closeFormModal}
          title={formTitle}
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={discardFormData}
        >
          {(isLoadingCountries || isLoadingUnits || isAddingRecipientAddress || isEditingRecipientAddress) && (
            <Loader open={isLoadingCountries || isLoadingUnits || isAddingRecipientAddress || isEditingRecipientAddress} />
          )}
          <form
            className="adminPanelFormContainer"
            noValidate
            onSubmit={handleSubmit}
          >
            <Grid container spacing={isDesktop() ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="recipient-name"
                  label="Recipient Name"
                  name="recipient-name"
                  autoComplete="recipient-name"
                  error={formError.name && formError.name.error}
                  helperText={
                    formError.name ? formError.name.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', name)}
                  {...name.bind}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  className="notranslate"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="country"
                  select
                  required
                  label={<span className="translate">Country</span>}
                  error={formError.country && formError.country.error}
                  helperText={
                    formError.country ? formError.country.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', country, 'country')}
                  value={country.value}
                  onChange={(e) => {
                    country.setValue(e.target.value);
                    state.setValue('');
                    address_1.setValue('');
                    address_2.setValue('');
                    city.setValue('');
                    zip.setValue('');
                  }}
                >
                  <MenuItem value="">Select</MenuItem>
                  {countriesData && _.map(_.sortBy(_.map(countriesData, (c) => _.pick(c, 'country', 'iso3'))),
                    (value, index) => (
                      <MenuItem
                        className="notranslate"
                        key={`custodianCountry${index}${value.country}`}
                        value={value.iso3}
                      >
                        {value.country}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="state"
                  select
                  required
                  label="State/Province"
                  error={formError.state && formError.state.error}
                  helperText={
                    formError.state ? formError.state.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', state, 'state')}
                  {...state.bind}
                  disabled={countriesData && !country.value}
                  placeholder={
                    countriesData && !country.value
                      ? 'Select country for states options'
                      : ''
                  }
                >
                  <MenuItem value="">Select</MenuItem>
                  {countriesData && country.value && _.map(_.sortBy(_.find(countriesData, { iso3: country.value }).states),
                    (value, index) => (
                      <MenuItem
                        key={`custodianState${index}${value}`}
                        value={value.state_code}
                      >
                        {value.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="address_1"
                  label="Address Line 1"
                  name="address_1"
                  autoComplete="address_1"
                  disabled={!country.value || !state.value}
                  error={formError.address_1 && formError.address_1.error}
                  helperText={
                    formError.address_1 ? formError.address_1.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', address_1)}
                  {...address_1.bind}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="address_2"
                  label="Address Line 2"
                  name="address_2"
                  autoComplete="address_2"
                  disabled={!country.value || !state.value}
                  {...address_2.bind}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  autoComplete="city"
                  disabled={!country.value || !state.value}
                  error={formError.city && formError.city.error}
                  helperText={formError.city ? formError.city.message : ''}
                  onBlur={(e) => handleBlur(e, 'required', city)}
                  {...city.bind}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="zip"
                  label="ZIP/Postal Code"
                  name="zip"
                  autoComplete="zip"
                  disabled={!country.value || !state.value}
                  error={formError.zip && formError.zip.error}
                  helperText={formError.zip ? formError.zip.message : ''}
                  onBlur={(e) => handleBlur(e, 'required', zip)}
                  {...zip.bind}
                />
              </Grid>

              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={5.15} md={4}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="adminPanelSubmit"
                    disabled={isLoadingCountries || isLoadingUnits || isAddingRecipientAddress || isEditingRecipientAddress || submitDisabled()}
                  >
                    {buttonText}
                  </Button>
                </Grid>
                <Grid item xs={6} sm={5.15} md={4}>
                  <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={discardFormData}
                    className="adminPanelSubmit"
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormModal>
      )}
    </div>
  );
};

export default AddRecipientAddress;
