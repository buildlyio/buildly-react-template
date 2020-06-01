export const validators = (type, input) => {
  switch (type) {
    case "required":
      return requiredValidator(input);
    // case "email":
    //   return emailValidator(props);
    // case "confirm":
    //   return confirmValidator(props);
    default:
      return { error: false, message: "" };
  }
};

const requiredValidator = (input) => {
  let { value, required } = input;
  if (!value && required)
    return {
      error: true,
      message: "This field is required",
    };
  return { error: false, message: "" };
};
