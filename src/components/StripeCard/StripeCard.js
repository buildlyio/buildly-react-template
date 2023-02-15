import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { FormControl, FormGroup, FormHelperText } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  formGroup: {
    margin: '0.3rem 0 1.8rem',
  },
  formControl: {
    padding: '1rem 8px',
    border: '1px dotted gray',
  },
  helperText: {
    marginLeft: '8px',
    color: 'red',
  },
}));

const StripeCard = ({ cardError, setCardError }) => {
  const classes = useStyles();

  const onCardChange = (elementData) => {
    if (elementData.error) {
      setCardError(elementData.error.message);
    } else if (!elementData.complete) {
      setCardError('Card details cannot be empty');
    } else {
      setCardError('');
    }
  };

  return (
    <FormGroup className={classes.formGroup}>
      <FormControl className={classes.formControl}>
        <CardElement onChange={onCardChange} />
      </FormControl>
      <FormHelperText className={classes.helperText}>
        {cardError}
      </FormHelperText>
    </FormGroup>
  );
};

export default StripeCard;
