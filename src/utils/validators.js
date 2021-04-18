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
  const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
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

export const validators = (type, input) => {
  switch (type) {
    case 'required':
      return requiredValidator(input);
    case 'email':
      return emailValidator(input);
    case 'confirm':
      return confirmValidator(input);
    default:
      return { error: false, message: '' };
  }
};
