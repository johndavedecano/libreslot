// @ts-nocheck
export function isValidEmail(email) {
  // Regular expression for validating an Email
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the pattern
  return emailPattern.test(email);
}

export function isValidPassword(password, strict = false) {
  let valid = { success: true, message: "" };
  // Regular expressions for password criteria
  var lengthRegex = /^.{6,}$/; // Minimum 6 characters
  var uppercaseRegex = /[A-Z]/; // At least one uppercase letter
  var lowercaseRegex = /[a-z]/; // At least one lowercase letter
  var numberRegex = /\d/; // At least one number
  var specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

  if (!lengthRegex.test(password)) {
    valid.success = false;
    valid.message = "Password must be atleast 6 characters";
  }

  if (strict) {
    if (!uppercaseRegex.test(password)) {
      valid.success = false;
      valid.message = "Password must contain atleast one uppercase";
    }

    if (!lowercaseRegex.test(password)) {
      valid.success = false;
      valid.message = "Password must contain atleast one lowercase";
    }

    if (!numberRegex.test(password)) {
      valid.success = false;
      valid.message = "Password must contain atleast one number";
    }

    if (!specialCharRegex.test(password)) {
      valid.success = false;
      valid.message = "Password must contain atleast one special character";
    }
  }

  // Check if the password meets all criteria
  return valid;
}

export function isValidMobile(text) {
  // Regular expression for a string with exactly 11 digits
  var textPattern = /^\d{11}$/;

  // Test the text against the pattern
  return textPattern.test(text);
}

export function generateAppointmentCode() {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
}

export function formatNumberWithK(number) {
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "k";
  }
  return number.toString();
}

export function getQrUrl(id) {
  return `${window.location.protocol}://${window.location.host}/admin/appointments/${id}`;
}
