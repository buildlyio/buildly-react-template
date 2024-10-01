import _ from 'lodash';

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
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
  const { value, required, password } = input;
  if (!value && required) {
    return {
      error: true,
      message: 'This field is required',
    };
  }
  if (value && value !== password) {
    return {
      error: true,
      message: 'Field does not match!',
    };
  }
  return { error: false, message: '' };
};

const duplicateEmailValidator = (input) => {
  const { value, required, extra } = input;
  // eslint-disable-next-line no-useless-escape
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (value[0] === '' && required) {
    return {
      error: true,
      message: 'This field is required',
    };
  }
  if (value.some((element) => !pattern.test(element))) {
    return {
      error: true,
      message: 'You have entered an invalid email address!',
    };
  }
  const lowerCaseValue = value.map((email) => email.toLowerCase());
  const lowerCaseExtra = extra.map((email) => email.toLowerCase());
  const hasDuplicateInValue = lowerCaseValue.some((email, index) => lowerCaseValue.indexOf(email) !== index);
  const hasDuplicateInExtra = lowerCaseValue.some((email) => lowerCaseExtra.includes(email));

  if (hasDuplicateInValue) {
    return {
      error: true,
      message: 'Duplicate email found within the entered values!',
    };
  }
  if (hasDuplicateInExtra) {
    return {
      error: true,
      message: 'User already registered with entered email!',
    };
  }
  return { error: false, message: '' };
};

const duplicateOrgNameValidator = (input) => {
  const { value, required, extra } = input;
  if (!value && required) {
    return {
      error: true,
      message: 'This field is required',
    };
  }
  if (_.includes(extra, value.value)) {
    return {
      error: true,
      message: 'Duplicate organization name!',
    };
  }
  return { error: false, message: '' };
};

const duplicateOrgAbbValidator = (input) => {
  const { value, required, extra } = input;
  if (!value && required) {
    return {
      error: true,
      message: 'This field is required',
    };
  }
  if (_.includes(extra, value.value)) {
    return {
      error: true,
      message: 'Duplicate organization abbreviation!',
    };
  }
  return { error: false, message: '' };
};

export const validators = (type, input) => {
  switch (type) {
    case 'required':
      return requiredValidator(input);

    case 'email':
      return emailValidator(input);

    case 'confirm':
      return confirmValidator(input);

    case 'duplicateEmail':
      return duplicateEmailValidator(input);

    case 'duplicateOrgName':
      return duplicateOrgNameValidator(input);

    case 'duplicateOrgAbb':
      return duplicateOrgAbbValidator(input);

    default:
      return { error: false, message: '' };
  }
};
