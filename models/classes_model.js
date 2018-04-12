/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS



// Validate Function to check year range
let yearRangeChecker = (year) => {
  // Check if year exists
  if (!year) {
    return false; // Return error
  } else {
    // Check year length
    if (year < 1 || year > 5) {
      return false; // Return error if year range requirement is not met
    } else {
      return true; // Return year as valid
    }
  }
};

// Validate Function to check if valid year format
let validYear = (year) => {
  // Check if year exists
  if (!year) {
    return false; // Return error
  } else {
    // Regular Expression to test if year is valid format
    const regExp = new RegExp(/^[0-9]*$/);
    return regExp.test(year); // Return regular expression test result (true or false)
  }
};

// Array of year validators
const yearValidators = [
  // First year validator
  {
    validator: yearRangeChecker,
    message: 'Year must be a number between 1 and 5'
  },
  // Second year validator
  {
    validator: validYear,
    message: 'Year must be a number'
  }
];



// Validate Function to check section range
let sectionLengthChecker = (section) => {
    // Check if section exists
    if (!section) {
      return false; // Return error
    } else {
      // Check section length
      if (section.length < 1 || section.length > 1) {
        return false; // Return error if section range requirement is not met
      } else {
        return true; // Return section as valid
      }
    }
  };
  
  // Validate Function to check if valid section format
  let validSection = (section) => {
    // Check if section exists
    if (!section) {
      return false; // Return error
    } else {
      // Regular Expression to test if section is valid format
      const regExp = new RegExp(/^[A-Z]*$/);
      return regExp.test(section); // Return regular expression test result (true or false)
    }
  };
  
  // Array of section validators
  const sectionValidators = [
    // First section validator
    {
      validator: sectionLengthChecker,
      message: 'Section must be only one charachter'
    },
    // Second section validator
    {
      validator: validSection,
      message: 'Section must be a charachter between A and Z'
    }
  ];



// Class Model Definition
const classSchema = new Schema({
  year: { type: Number, required: true , validate:yearValidators},
  section: { type: String, required:true, uppercase:true, validate: sectionValidators}
});



// Export Module/Schema
module.exports = mongoose.model('Classes', classSchema);