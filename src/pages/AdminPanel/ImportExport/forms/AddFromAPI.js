import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  makeStyles,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import ConfirmModal from '@components/Modal/ConfirmModal';
import CustomizedTooltips from '@components/ToolTip/ToolTip';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import {
  getItemsOptions,
  getProductsOptions,
  getGatewayOptions,
  getSensorOptions,
} from '@redux/options/actions/options.actions';
import {
  getApiResponse,
  addApiSetup,
} from '@redux/importExport/actions/importExport.actions';
import { UserContext } from '@context/User.context';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '90%',
    margin: 'auto',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: '18px',
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
  title: {
    margin: theme.spacing(2, 0),
    textAlign: 'center',
  },
  apiResponse: {
    width: '100%',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    overflow: 'wrap',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  tableColumn: {
    backgroundColor: theme.palette.primary.dark,
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  mapCol: {
    marginBottom: theme.spacing(3),
  },
  apiMenuItem: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const AddFromAPI = ({
  loading,
  dispatch,
  itemOptions,
  productOptions,
  sensorOptions,
  gatewayOptions,
  apiResponse,
}) => {
  const classes = useStyles();
  const dataTypes = [
    {
      name: 'Items',
      value: 'item',
      option: itemOptions,
      externalProvider: [],
    },
    {
      name: 'Products',
      value: 'product',
      option: productOptions,
      externalProvider: [],
    },
    {
      name: 'Sensors',
      value: 'sensor',
      option: sensorOptions,
      externalProvider: [],
    },
    {
      name: 'Gateways',
      value: 'gateway',
      option: gatewayOptions,
      externalProvider: ['Tive'],
    },
  ];

  const organization = useContext(UserContext).organization.organization_uuid;

  const [tableColumns, setTableColumns] = useState({});
  const [mapColumns, setMapColumns] = useState({});
  const [apiColumns, setAPIColumns] = useState({});
  const apiURL = useInput('', { required: true });
  const keyParamName = useInput('', { required: true });
  const keyParamPlace = useInput('', { required: true });
  const apiKey = useInput('', { required: true });
  const apiResponseData = useInput('');
  const dataFor = useInput('', { required: true });
  const [formError, setFormError] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [finalUrl, setFinalUrl] = useState('');
  const [reqHeader, setReqHeader] = useState('');
  const [provider, setProvider] = useState({
    name: null,
    dataTypes: [],
    apiResponseData: '',
  });

  useEffect(() => {
    if (itemOptions === null) {
      dispatch(getItemsOptions());
    }
    if (productOptions === null) {
      dispatch(getProductsOptions());
    }
    if (gatewayOptions === null) {
      dispatch(getGatewayOptions());
    }
    if (sensorOptions === null) {
      dispatch(getSensorOptions());
    }
  }, []);

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const mapping = {};
    if (provider.name) {
      if (provider.name === 'Tive' && dataFor.value === 'gateway') {
        _.forEach(mapColumns, (col, key) => {
          mapping[key] = '';
        });
        mapping.name = 'name';
        mapping.imei_number = 'id';
      }
    } else {
      _.forEach(mapColumns, (col, key) => {
        mapping[key] = col.value;
      });
    }

    if ('organization_uuid' in mapping) {
      mapping.organization_uuid = organization;
    }

    dispatch(addApiSetup(
      apiURL.value,
      keyParamName.value,
      keyParamPlace.value,
      apiKey.value,
      apiResponseData.value
        ? apiResponseData.value
        : provider.apiResponseData,
      dataFor.value,
      mapping,
      provider.name ? provider.name : 'Default',
    ));
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input, parentId = '') => {
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

    if (parentId === 'dataFor') {
      const table = _.find(dataTypes, { value: input.value });
      const cols = table.option.actions.POST;
      let mapCols = {};
      _.forEach(cols, (col, key) => {
        mapCols = {
          ...mapCols,
          [key]: {
            label: col.label,
            name: key,
            value: '',
            required: col.required,
          },
        };
      });

      if (_.isEmpty(apiColumns) && !provider.name) {
        setAPIColumns(apiResponse[0]);
      }

      setTableColumns(cols);
      setMapColumns(mapCols);
    }

    if (
      apiURL.value
      && keyParamName.value
      && keyParamPlace.value
      && apiKey.value
    ) {
      const url = _.endsWith(apiURL.value, '/')
        ? apiURL.value
        : `${apiURL.value}/`;
      if (_.includes(url, 'tive.co')) {
        const providerDataType = _.filter(
          dataTypes,
          (item) => _.includes(item.externalProvider, 'Tive'),
        );
        setProvider({
          name: 'Tive',
          dataTypes: providerDataType,
          apiResponseData: 'result',
        });
      } else {
        setProvider({
          name: null,
          dataTypes: [],
          apiResponseData: '',
        });
      }
      const queryUrl = (
        <>
          <Typography variant="body1">
            Is the below URL correct?
          </Typography>
          <Typography variant="body1" style={{ marginTop: '8px' }}>
            <strong>
              <em>
                {`'${url}?${keyParamName.value}=${apiKey.value}'`}
              </em>
            </strong>
          </Typography>
        </>
      );
      const headerUrl = (
        <>
          <Typography variant="body1">
            Is the below URL and Header correct?
          </Typography>
          <Typography variant="body1" style={{ marginTop: '8px' }}>
            <em>
              <strong>URL:  </strong>
              {`'${url}'`}
            </em>
          </Typography>
          <Typography variant="body1">
            <em>
              <strong>Header:  </strong>
              {`${keyParamName.value}='${apiKey.value}'`}
            </em>
          </Typography>
        </>
      );
      const final = keyParamPlace.value === 'queryParam'
        ? {
          url: `${url}?${keyParamName.value}=${apiKey.value}`,
          title: queryUrl,
          header: '',
        }
        : {
          url,
          title: headerUrl,
          header: `${keyParamName.value}: ${apiKey.value}`,
        };

      if (
        (finalUrl !== final.url)
        || (reqHeader !== final.header)
      ) {
        setFinalUrl(final.url);
        setReqHeader(final.header);
        setModalTitle(final.title);
        setOpenModal(true);
      }
    }

    if (e.target.id === 'apiResponseData' && input.value) {
      const cols = apiResponse[input.value][0];

      if (_.isEmpty(apiColumns) || (apiColumns !== cols)) {
        setAPIColumns(cols);
      }
    }
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    let check = (
      !apiURL.value
      || !keyParamName.value
      || !keyParamPlace.value
      || !apiKey.value
      || !dataFor.value
    );
    _.forEach(mapColumns, (col, index) => {
      if (col.required) {
        check = check || !mapColumns[index].value;
      }
    });

    if (check) {
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

  const handleConfirmModal = () => {
    if (!provider.name) {
      dispatch(getApiResponse(finalUrl, reqHeader));
    }
    setOpenModal(false);
  };

  const handleMapColumn = (e, key) => {
    const present = _.find(mapColumns, { value: e.target.value });

    if (present) {
      setMapColumns({
        ...mapColumns,
        [key]: { ...mapColumns[key], value: '' },
      });
      setFormError({
        ...formError,
        [key]: {
          error: true,
          message: `${_.startCase(e.target.value)} is already mapped to ${present.label}`,
        },
      });
    } else {
      setMapColumns({
        ...mapColumns,
        [key]: { ...mapColumns[key], value: e.target.value },
      });
      setFormError({
        ...formError,
        [key]: {
          error: false,
          message: '',
        },
      });
    }
  };

  return (
    <>
      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="apiURL"
              label="API Url to get data"
              name="apiURL"
              error={formError.apiURL && formError.apiURL.error}
              helperText={
                formError.apiURL ? formError.apiURL.message : ''
              }
              onBlur={(e) => handleBlur(e, 'required', apiURL)}
              {...apiURL.bind}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="keyParamName"
              label="API Key Param Name"
              name="keyParamName"
              error={
                formError.keyParamName
                && formError.keyParamName.error
              }
              helperText={
                formError.keyParamName
                  ? formError.keyParamName.message
                  : ''
              }
              onBlur={(e) => handleBlur(e, 'required', keyParamName)}
              {...keyParamName.bind}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="keyParamPlace"
              label="API Key Param Placement"
              select
              error={
                formError.keyParamPlace
                && formError.keyParamPlace.error
              }
              helperText={
                formError.keyParamPlace
                  ? formError.keyParamPlace.message
                  : ''
              }
              onBlur={(e) => handleBlur(e, 'required', keyParamPlace, 'keyParamPlace')}
              {...keyParamPlace.bind}
            >
              <MenuItem value="">--------</MenuItem>
              <MenuItem value="queryParam">Query Parameter</MenuItem>
              <MenuItem value="header">Header</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="apiKey"
              label="API Key Value"
              name="apiKey"
              error={formError.apiKey && formError.apiKey.error}
              helperText={
                formError.apiKey ? formError.apiKey.message : ''
              }
              onBlur={(e) => handleBlur(e, 'required', apiKey)}
              {...apiKey.bind}
            />
          </Grid>
          {provider.name
          && (
          <Grid item xs={12}>
            <Typography variant="body1">
              External Provider :
              {' '}
              {provider.name}
            </Typography>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                id="dataFor"
                label="Import Provider Data For"
                select
                error={formError.dataFor && formError.dataFor.error}
                helperText={
                  formError.dataFor ? formError.dataFor.message : ''
                }
                onBlur={(e) => handleBlur(e, 'required', dataFor, 'dataFor')}
                {...dataFor.bind}
              >
                <MenuItem value="">--------</MenuItem>
                {_.map(
                  provider.dataTypes,
                  (type, index) => (
                    <MenuItem
                      key={index}
                      value={type.value}
                    >
                      {type.name}
                    </MenuItem>
                  ),
                )}
              </TextField>
            </Grid>
          </Grid>
          )}
          {apiResponse
            && (
            <Grid item xs={12}>
              <Typography variant="h6">API Response</Typography>
              <pre className={classes.apiResponse}>
                {JSON.stringify(apiResponse)}
              </pre>
            </Grid>
            )}
          {apiResponse
            && (
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                id="apiResponseData"
                label="Pick only this from response (Optional)"
                name="apiResponseData"
                error={
                  formError.apiResponseData
                  && formError.apiResponseData.error
                }
                helperText={
                  formError.apiResponseData
                    ? formError.apiResponseData.message
                    : ''
                }
                onBlur={(e) => handleBlur(e, '', apiResponseData)}
                {...apiResponseData.bind}
              />
            </Grid>
            )}
          {apiResponse
            && (
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                id="dataFor"
                label="Import Data For"
                select
                error={formError.dataFor && formError.dataFor.error}
                helperText={
                  formError.dataFor ? formError.dataFor.message : ''
                }
                onBlur={(e) => handleBlur(e, 'required', dataFor, 'dataFor')}
                {...dataFor.bind}
              >
                <MenuItem value="">--------</MenuItem>
                {_.map(dataTypes, (type, index) => (
                  <MenuItem key={index} value={type.value}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            )}
          {!_.isEmpty(tableColumns)
            && !_.isEmpty(mapColumns)
            && !_.isEmpty(apiColumns)
            && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  className={classes.title}
                  variant="h6"
                >
                  Our Columns
                </Typography>
                {_.map(tableColumns, (column, key) => (
                  <div key={key} className={classes.tableColumn}>
                    <Typography variant="body1">
                      {column.label}
                    </Typography>
                    {column.help_text
                      && (
                      <CustomizedTooltips
                        toolTipText={column.help_text}
                      />
                      )}
                  </div>
                ))}
              </Grid>
              <Grid item xs={6}>
                <Typography
                  className={classes.title}
                  variant="h6"
                >
                  Mapping (From API Response)
                </Typography>
                {_.map(mapColumns, (col, key) => (
                  <TextField
                    key={key}
                    className={classes.mapCol}
                    variant="outlined"
                    fullWidth
                    required={col.required}
                    id={col.name}
                    label={col.label}
                    select
                    value={col.value}
                    onChange={(e) => handleMapColumn(e, key)}
                    error={formError[key] && formError[key].error}
                    helperText={
                      formError[key] ? formError[key].message : ''
                    }
                  >
                    <MenuItem value="">--------</MenuItem>
                    {_.map(apiColumns, (column, keyVal) => (
                      <MenuItem key={keyVal} value={keyVal}>
                        <div className={classes.apiMenuItem}>
                          {_.startCase(keyVal)}
                        </div>
                      </MenuItem>
                    ))}
                  </TextField>
                ))}
              </Grid>
            </Grid>
            )}
          <Grid container spacing={2} justify="center">
            <Grid item xs={6} sm={4}>
              <div className={classes.loadingWrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={loading || submitDisabled()}
                >
                  Set Mapping and Import
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <ConfirmModal
        open={openModal}
        setOpen={setOpenModal}
        submitAction={handleConfirmModal}
        title={modalTitle}
        submitText="Correct"
      />
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
  ...state.importExportReducer,
  ...state.sensorsGatewayReducer,
  loading: (
    state.itemsReducer.loading
    || state.importExportReducer.loading
    || state.sensorsGatewayReducer.loading
  ),
});

export default connect(mapStateToProps)(AddFromAPI);
