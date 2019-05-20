import { useState } from 'react';

export const useInput = (initialValue = '', validators = {}) => {
  const [value, setValue] = useState(initialValue);

  // Validators
  let requiredValid = !validators.required || value && value.trim() !== '';
  let maxLengthValid = !validators.maxLength || value && value.length <= validators.maxLength;
  let minLengthValid = !validators.minLength || value && value.length >= validators.minLength;
  let customValidatorValid = !validators.customValidator || value && customValidator(value);
  const valid = requiredValid && maxLengthValid && minLengthValid && customValidatorValid;

  return {
    value,
    valid,
    required: validators.required,
    bind: {
      onChange: e => setValue(e.target.value),
      value,
      required: validators.required
    },
    clear: () => setValue(''),
    reset: () => setValue(initialValue)
  };
};
