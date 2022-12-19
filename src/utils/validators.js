import _ from 'lodash';

export const validators = (type, input) => {
  switch (type) {
    case 'required':
      return requiredValidator(input);

    case 'email':
      return emailValidator(input);

    case 'confirm':
      return confirmValidator(input);

    case 'duplicate':
      return duplicateValidator(input);

    default:
      return { error: false, message: '' };
  }
};

const requiredValidator = (input) => {
  const { value, required } = input;
  if (!value && required) {
    return {
      error: true,
      message: 'This field is required',
    };
  }
  return { error: false, message: '' };
};

const emailValidator = (input) => {
  // eslint-disable-next-line no-useless-escape
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
  const { value, required } = input;
  if (!value && required) {
    return {
      error: true,
      message: 'This field is required',
    };
  }
  if (value && !pattern.test(value)) {
    return {
      error: true,
      message: 'You have entered an invalid email address!',
    };
  }
  return { error: false, message: '' };
};

const confirmValidator = (input) => {
  const { value, required, matchField } = input;
  if (!value && required) {
    return {
      error: true,
      message: 'This field is required',
    };
  }
  if (value && value !== matchField) {
    return {
      error: true,
      message: 'Field does not match!',
    };
  }
  return { error: false, message: '' };
};

const duplicateValidator = (input) => {
  const { value, required, productFeatures } = input;
  console.log('In duplicate check', value, required, productFeatures);
  if (!value && required) {
    return {
      error: true,
      message: 'This field is required',
    };
  }
  const dupli = _.filter(productFeatures, (feat) => (
    feat.name === value)).length > 0;
  if (value && dupli) {
    return {
      error: true,
      message: 'Feature exists, enter new feature',
    };
  }
  return { error: false, message: '' };
};
