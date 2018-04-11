/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS

// Validate Function to check name length
let nameLengthChecker = (name) => {
  // Check if e-mail exists
  if (!name) {
    return false; // Return error
  } else {
    // Check the length of name string
    if (name.length < 5 || name.length > 30) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid name
    }
  }
};

// Validate Function to check if valid name format
let validNameChecker = (name) => {
  // Check if name exists
  if (!name) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid name
    const regExp = new RegExp(/^[a-z ,.'-]+$/i);
    return regExp.test(name); // Return regular expression test results (true or false)
  }
};

// Array of name Validators
const nameValidators = [
  // First name Validator
  {
    validator: nameLengthChecker,
    message: 'Name must be at least 5 characters but no more than 30'
  },
  // Second name Validator
  {
    validator: validNameChecker,
    message: 'Must be a valid name'
  }
];

// Validate Function to check surname length
let surnameLengthChecker = (surname) => {
  // Check if surname exists
  if (!surname) {
    return false; // Return error
  } else {
    // Check length of surname string
    if (surname.length < 5 || surname.length > 30) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid surname
    }
  }
};

// Validate Function to check if valid surname format
let validSurname = (surname) => {
  // Check if surname exists
  if (!surname) {
    return false; // Return error
  } else {
    // Regular expression to test if surname format is valid
    const regExp = new RegExp(/^[a-z ,.'-]+$/i);
    return regExp.test(surname); // Return regular expression test result (true or false)
  }
};

// Array of surname validators
const surnameValidators = [
  // First surname validator
  {
    validator: surnameLengthChecker,
    message: 'Surname must be at least 5 characters but no more than 30'
  },
  // Second surname validator
  {
    validator: validSurname,
    message: 'Surname must be a valid surname'
  }
];

// Validate Function to check city length
let cityLengthChecker = (city) => {
  // Check if city exists
  if (!city) {
    return false; // Return error
  } else {
    // Check city length
    if (city.length < 2 || city.length > 35) {
      return false; // Return error if passord length requirement is not met
    } else {
      return true; // Return city as valid
    }
  }
};

// Validate Function to check if valid city format
let validCity = (city) => {
  // Check if city exists
  if (!city) {
    return false; // Return error
  } else {
    // Regular Expression to test if city is valid format
    const regExp = new RegExp(/^[a-z ,.'-]+$/i);
    return regExp.test(city); // Return regular expression test result (true or false)
  }
};

// Array of city validators
const cityValidators = [
  // First city validator
  {
    validator: cityLengthChecker,
    message: 'City must be at least 2 characters but no more than 35'
  },
  // Second city validator
  {
    validator: validCity,
    message: 'City must be a valid city'
  }
];



// User Model Definition
const teacherSchema = new Schema({
  user: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true, validate: nameValidators },
  surname: { type: String, required: true, validate: surnameValidators },
  class: {type: String, required:true},   //change class value whith value id of class table
  city: {type: String, required:true, validate: cityValidators}
});



// Export Module/Schema
module.exports = mongoose.model('Teachers', teacherSchema);