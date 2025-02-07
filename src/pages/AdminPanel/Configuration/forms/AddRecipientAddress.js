/* eslint-disable no-console */
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
import { useAddRecipientAddressMutation } from '@react-query/mutations/recipientaddress/addRecipientAddressMutation';
import { useEditRecipientAddressMutation } from '@react-query/mutations/recipientaddress/editRecipientAddressMutation';
import { validators } from '@utils/validators';
import { isDesktop } from '@utils/mediaQuery';
import '../../AdminPanelStyles.css';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import Geocode from 'react-geocode';

const AddRecipientAddress = ({ history, location }) => {
  const { organization_uuid } = getUser().organization;
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const { displayAlert } = useAlert();

  Geocode.setApiKey(window.env.GEO_CODE_API);
  Geocode.setLanguage('en');

  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: window.env.MAP_API_KEY,
  });

  const editPage = location.state && location.state.type === 'edit';
  const editData = (editPage && location.state.data) || {};

  const name = useInput((editData && editData.name) || '', { required: true });
  const country = useInput((editData && editData.country) || '', { required: true });
  const state = useInput((editData && editData.state) || '', { required: true });
  const [address1, setAddress1] = useState((editData && editData.address1) || '');
  const address_2 = useInput((editData && editData.address2) || '');
  const city = useInput((editData && editData.city) || '', { required: true });
  const zip = useInput((editData && editData.postal_code) || '', { required: true });
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Recipient Address';
  const formTitle = editPage ? 'Edit Recipient Address' : 'Add Recipient Address';

  const closeFormModal = () => {
    const dataHasChanged = (
      name.hasChanged()
      || country.hasChanged()
      || state.hasChanged()
      || !_.isEqual(address1, '')
      || address_2.hasChanged()
      || city.hasChanged()
      || zip.hasChanged()
    );
    if (dataHasChanged) {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      ...editData,
      name: name.value,
      country: country.value,
      state: state.value,
      address1,
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
    if (
      !name.value
      || !country.value
      || !state.value
      || _.isEqual(address1, '')
      || !address_2.value
      || !city.value
      || !zip.value
    ) {
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

  const handleSelectAddress = (address) => {
    const addressDesc = address.description.split(', ');
    Geocode.fromAddress(address.description)
      .then(({ results }) => {
        const { lat, lng } = results[0].geometry.location;
        Geocode.fromLatLng(lat, lng)
          .then((response) => {
            const addressComponents = response.results[0].address_components;
            let locality = addressComponents.find((component) => component.types.includes('administrative_area_level_3'))?.long_name;
            if (!locality) {
              locality = addressComponents.find((component) => component.types.includes('locality'))?.long_name;
            }
            const zipCode = addressComponents.find((component) => component.types.includes('postal_code'))?.long_name;
            let filteredAddressDesc = addressDesc.slice(0, -2);
            filteredAddressDesc = filteredAddressDesc.filter((item) => item !== locality);
            const add1 = _.size(filteredAddressDesc) > 1 ? filteredAddressDesc.slice(0, -1).join(', ') : filteredAddressDesc[0] || '';
            const add2 = filteredAddressDesc.length > 1 ? filteredAddressDesc[filteredAddressDesc.length - 1] : '';
            setAddress1(add1);
            address_2.setValue(add2);
            city.setValue(locality);
            state.setValue(addressDesc[_.size(addressDesc) - 2]);
            country.setValue(addressDesc[_.size(addressDesc) - 1]);
            zip.setValue(zipCode);
          })
          .catch(console.error);
      })
      .catch(console.error);
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
          {(isAddingRecipientAddress || isEditingRecipientAddress) && (
            <Loader open={isAddingRecipientAddress || isEditingRecipientAddress} />
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
                  helperText={formError.name ? formError.name.message : ''}
                  onBlur={(e) => handleBlur(e, 'required', name)}
                  {...name.bind}
                />
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
                  value={address1}
                  onChange={(e) => {
                    getPlacePredictions({
                      input: e.target.value,
                    });
                    setAddress1(e.target.value);
                  }}
                />
              </Grid>
              <div className={!_.isEmpty(placePredictions) ? 'recipientAddressPredictions' : ''}>
                {placePredictions && _.map(placePredictions, (value, index) => (
                  <MenuItem
                    className="recipientAddressPredictionsItem notranslate"
                    key={`recipientState${index}${value}`}
                    value={value.description}
                    onClick={() => {
                      handleSelectAddress(value);
                      getPlacePredictions({ input: '' });
                    }}
                  >
                    {value.description}
                  </MenuItem>
                ))}
              </div>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="address_2"
                  label="Address Line 2"
                  name="address_2"
                  autoComplete="address_2"
                  disabled
                  {...address_2.bind}
                />
              </Grid>
              <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  autoComplete="city"
                  disabled
                  {...city.bind}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="state"
                  label="State/Province"
                  name="state"
                  autoComplete="state"
                  disabled
                  {...state.bind}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="country"
                  label="Country"
                  name="country"
                  autoComplete="country"
                  disabled
                  {...country.bind}
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
                  disabled
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
                    disabled={isAddingRecipientAddress || isEditingRecipientAddress || submitDisabled()}
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
