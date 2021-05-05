import { useState } from 'react';

export const useInput = (
  initialValue = '',
  validators = {},
) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    required: validators.required,
    confirm: validators.confirm,
    ...(validators.confirm
      && validators.matchField
      && { matchField: validators.matchField.value }
    ),
    bind: {
      onChange: (e) => setValue(e.target.value),
      value,
      required: validators.required,
    },
    clear: () => setValue(''),
    reset: () => setValue(initialValue),
    hasChanged: () => (
      !!(initialValue !== value && value !== '')
    ),
  };
};
