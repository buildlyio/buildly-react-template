import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from '@material-ui/core/Typography';
import CustomizedTooltips from 'midgard/components/ToolTip/ToolTip';
import { useInput } from "midgard/hooks/useInput";
import { validators } from "midgard/utils/validators";
import { httpService } from "midgard/modules/http/http.service";
import { environment } from "environments/environment";
import {
  GET_ITEM_OPTIONS_SUCCESS,
  GET_ITEM_OPTIONS_FAILURE,
  GET_PRODUCTS_OPTIONS_SUCCESS,
  GET_PRODUCTS_OPTIONS_FAILURE,
} from "midgard/redux/items/actions/items.actions";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "90%",
    margin: "auto",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: "18px",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  loadingWrapper: {
    position: "relative",
  },
  title: {
    margin: theme.spacing(2, 0),
    textAlign: "center",
  },
  tableColumn: {
    backgroundColor: theme.palette.primary.dark,
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(3),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  mapCol: {
    marginBottom: theme.spacing(3),
  },
}));

const AddFromAPI = ({ loading, dispatch, itemOptions, productOptions }) => {
  const classes = useStyles();
  const dataTypes = [
    { name: "Items", option: itemOptions },
    { name: "Products", option: productOptions },
  ];
  const [tableColumns, setTableColumns] = useState({});
  const [mapColumns, setMapColumns] = useState([]);
  const [apiColumns, setAPIColumns] = useState({});
  const dataFor = useInput("", { required: true });
  const apiURL = useInput("", { required: true });
  const apiKey = useInput("", { required: true });
  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (itemOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          // `${environment.API_URL}shipment/item/`,
          "https://tp-dev-shipment.buildly.io/item/",
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_ITEM_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_ITEM_OPTIONS_FAILURE, error: err });
        });
    }

    if (productOptions === null) {
      httpService
        .makeOptionsRequest(
          "options",
          // `${environment.API_URL}shipment/product/`,
          "https://tp-dev-shipment.buildly.io/product/",
          true
        )
        .then((response) => response.json())
        .then((res) => {
          dispatch({ type: GET_PRODUCTS_OPTIONS_SUCCESS, data: res });
        })
        .catch((err) => {
          dispatch({ type: GET_PRODUCTS_OPTIONS_FAILURE, error: err });
        });
    }
  }, []);

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submit");
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input, parentId) => {
    let validateObj = validators(validation, input);
    let prevState = { ...formError };
    if (validateObj && validateObj.error)
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    else
      setFormError({
        ...prevState,
        [e.target.id || parentId]: {
          error: false,
          message: "",
        },
      });

    if (dataFor.hasChanged()) {
      const cols = input.value.actions.POST;
      let mapCols = {};
      _.forEach(cols, (col, key) => {
        mapCols = {
          ...mapCols,
          [key]: {
            label: col.label,
            name: key,
            value: "",
            required: col.required,
          }
        };
      });

      setTableColumns(cols);
      setMapColumns(mapCols);
      setAPIColumns(cols);
    };
  };

  const submitDisabled = () => {
    let errorKeys = Object.keys(formError);
    let errorExists = false;
    let mapColValues = "";
    _.forEach(mapColumns, (col, index) => {
      mapColValues = col.required 
        ? `${mapColValues} || !mapColumns[${index}].value`
        : mapColValues;
    });
    const check = `!dataFor.value || !apiURL.value || !apiKey.value${mapColValues}`;
    
    if (check) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  const handleMapColumn = (e, key) => {
    const present = _.find(mapColumns, { value: e.target.value });
    
    if (present) {
      setMapColumns({ 
        ...mapColumns, 
        [key]: { ...mapColumns[key], value: "" },
      });
      setFormError({
        ...formError,
        [key]: {
          error: true,
          message: `${apiColumns[e.target.value].label} is already mapped to ${present.label}`,
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
          message: "",
        },
      });
    };
  };

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit}>
      <Grid container spacing={2}>
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
              formError.dataFor ? formError.dataFor.message : ""
            }
            onBlur={(e) => handleBlur(e, "required", dataFor)}
            {...dataFor.bind}
          >
            <MenuItem value={""}>--------</MenuItem>
            {dataTypes.map((type, index) => (
              <MenuItem key={index} value={type.option}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="apiURL"
            label="API URL"
            name="apiURL"
            error={formError.apiURL && formError.apiURL.error}
            helperText={
              formError.apiURL ? formError.apiURL.message : ""
            }
            onBlur={(e) => handleBlur(e, "required", apiURL)}
            {...apiURL.bind}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="apiKey"
            label="API KEY"
            name="apiKey"
            error={formError.apiKey && formError.apiKey.error}
            helperText={
              formError.apiKey ? formError.apiKey.message : ""
            }
            onBlur={(e) => handleBlur(e, "required", apiKey)}
            {...apiKey.bind}
          />
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              className={classes.title}
              variant="h6"
            >
              Our Columns
            </Typography>
            {!_.isEmpty(tableColumns) && 
            _.map(tableColumns, (column, key) => (
              <div key={key} className={classes.tableColumn}>
                <Typography variant="body1">{column.label}</Typography>
                {column.help_text && 
                  <CustomizedTooltips toolTipText={column.help_text} />
                }
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
            {!_.isEmpty(mapColumns) && 
            _.map(mapColumns, (col, key) => (
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
                onChange={e => handleMapColumn(e, key)}
                error={formError[key] && formError[key].error}
                helperText={
                  formError[key] ? formError[key].message : ""
                }
              >
                <MenuItem value={""}>--------</MenuItem>
                {!_.isEmpty(apiColumns) && 
                _.map(apiColumns, (col, key) => (
                  <MenuItem key={key} value={key}>
                    {col.label}
                  </MenuItem>
                ))}
              </TextField>
            ))}
          </Grid>
        </Grid>
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
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(AddFromAPI);
