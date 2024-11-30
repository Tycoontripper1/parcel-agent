// ----------------------- REGEX FOR NAMES ----------------------
const validateName = (name: string) => {
  const nameRegex = /^[A-z][A-z0-9-_]{3,23}$/;
  return nameRegex.test(name);
};
// ----------------------- REGEX FOR EMAIL ----------------------
const validateEmail = (email: string) => {
  const emailRegex =
    /^[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)+$/;
  return emailRegex.test(email);
};

// -------------------- REGEX FOR Phone Number ---------------
const validPhoneNumber = (phoneNumber: string) => {
  const phoneRegex = /^(?!0+$)\d{9,14}$/;
  return phoneRegex.test(phoneNumber);
};
// -------------------- REGEX FOR Nigeria Phone Number ---------------
const validNigeriaPhoneNumber = (phoneNumber: string) => {
  const phoneRegex = /^0\d{10}$/;
  return phoneRegex.test(phoneNumber);
};
// -------------------- REGEX FOR Phone Number ---------------
const validEmailPhone = (value: string) => {
  const emailPhone =
    /^[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)*$|(^[0-9]{9,14})+$/;
  return emailPhone.test(value);
};

// -------------------- REGEX FOR Password ---------------
// Password validation rules go here
// Example: Minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number
const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
  return passwordRegex.test(password);
};
const validatePasswordSimple = (password: string) => {
  const passwordRegex = /^.{6,16}$/;
  return passwordRegex.test(password);
};
const adminValidatePassword = (password: string) => {
  const adminPasswordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
  return adminPasswordRegex.test(password);
};
const otpValidation = (otp: string) => {
  const otpRegex = /(^[0-9]{6,8})+$/;
  return otpRegex.test(otp);
};

export const regexValidation = {
  validateEmail,
  validatePassword,
  adminValidatePassword,
  validPhoneNumber,
  validEmailPhone,
  otpValidation,
  validateName,
  validatePasswordSimple,
  validNigeriaPhoneNumber,
};
