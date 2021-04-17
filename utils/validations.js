import validator from "validator";

export const trim = (value) => value.toString().replace(/\s/gi, "");
export const validateUser = (user) => {
  const errors = [];
  if (!validator.isMobilePhone(user.phone)) {
    errors.push("Invalid phone number");
  }
  if (errors.length) {
    return { errors, isError: true };
  } else {
    return { errors, isError: false };
  }
};
