const validator = require("validator");


const signupDataValidator = (req) => {
  const {firstName, lastName, email, password, age, gender}  = req.body;

  if (!firstName) {
    throw new Error('Firstname field is missing !!!');
  }

  if(firstName.length < 4 || firstName.length > 25) {
    throw new Error('Firstname should be 4 - 25 characters !!!');
  }

  if (!lastName) {
    throw new Error('Lastname field is missing !!!');
  }

  if(lastName.length < 4 || lastName.length > 25) {
    throw new Error('Lastname should be 4 - 25 characters !!!');
  }

  if (!email) {
    throw new Error('Email field is missing !!!');
  }

  if (email && !validator.isEmail(email)) {
    throw new Error('Invalid email value !!!');
  }

  if (!password) {
    throw new Error('Password field is missing !!!');
  }

  if (password && !validator.isStrongPassword(password)) {
    throw new Error('Password is not strong !!!');
  }

  if (!age) {
    throw new Error('Age field is missing !!!');
  }

  if (age && age < 18) {
    throw new Error('User not permitted to register !!!');
  }

  if (!gender) {
    throw new Error('Gender field is missing !!!');
  }

}

module.exports = {
  signupDataValidator
}