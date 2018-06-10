/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS

// Validate Function to check e-mail length
let emailLengthChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (email.length < 5 || email.length > 30) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
let validEmailChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email); // Return regular expression test results (true or false)
  }
};

// Array of Email Validators
const emailValidators = [
  // First Email Validator
  {
    validator: emailLengthChecker,
    message: 'E-mail must be at least 5 characters but no more than 30'
  },
  // Second Email Validator
  {
    validator: validEmailChecker,
    message: 'Must be a valid e-mail'
  }
];

// Validate Function to check username length
let usernameLengthChecker = (username) => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Check length of username string
    if (username.length < 3 || username.length > 15) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

// Validate Function to check if valid username format
let validUsername = (username) => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Regular expression to test if username format is valid
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username); // Return regular expression test result (true or false)
  }
};

// Array of Username validators
const usernameValidators = [
  // First Username validator
  {
    validator: usernameLengthChecker,
    message: 'Username must be at least 3 characters but no more than 15'
  },
  // Second username validator
  {
    validator: validUsername,
    message: 'Username must not have any special characters'
  }
];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Check password length
    if (password.length < 8 || password.length > 35) {
      return false; // Return error if passord length requirement is not met
    } else {
      return true; // Return password as valid
    }
  }
};

// Validate Function to check if valid password format
let validPassword = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Regular Expression to test if password is valid format
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password); // Return regular expression test result (true or false)
  }
};

// Array of Password validators
const passwordValidators = [
  // First password validator
  {
    validator: passwordLengthChecker,
    message: 'Password must be at least 8 characters but no more than 35'
  },
  // Second password validator
  {
    validator: validPassword,
    message: 'Must have at least one uppercase, lowercase, special character, and number'
  }
];

let typeLengthChecker=(type)=>{
  //check if type exists
  if(!type){
    return false;   //Return error
  }else{
    // Check type length
    if (type.length < 1 || type.length > 1) {
      return false; // Return error if type length requirement is not met
    } else {
      return true; // Return type as valid
    }
  }
}
let validType=(type)=>{
  //check if type exists
  if(!type){
    return false;   //Return error
  }else{
    //check if the type is correct (must be s or t)
    if(type.localeCompare('S')==0 || type.localeCompare('T')==0){
      return true;  //Return type as valid
    }else{
      return false;  //return error
    }
  }
}

const typeValidators=[
  // First type validator
  {
    validator: typeLengthChecker,
    message :'Type length must be only one charachter'
  },
  // Secondo type validator
  {
    validator: validType,
    message :'Type must be only letter S or letter T'
  }
]

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
    const regExp = new RegExp(/[^A-Za-z]+/g);
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
    const regExp = new RegExp(/[^A-Za-z]+/g);
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

//Validate function to check year range
let yearRangeChecker = (year) => {
  //Check if year exists
  if(!year){
    return false; //return error
  }else{
    if(year <1 || year>5){
      return false;     //return error
    }else{
      return true;    //return year as valid
    }
  }
}


//Validate function to check if year is a number
let validYear = (year) => {
  //Check if year exists
  if(!year){
    return false; //return error
  }else{
    if(year>0 || year < 6){
      return true;
    }else{
      return false;
    }
  }
}

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


//Validate function to check section length
let sectionLengthChecker = (section) => {
  //Check if section exists
  if(!section){
    return false; //return error
  }else{
    if(section.length!=1){
      return false;     //return error
    }else{
      return true;    //return section as valid
    }
  }
}


//Validate function to check if section is valid
let validSection = (section) => {
  //Check if section exists
  if(!section){
    return false; //return error
  }else{
    if(section.localeCompare('A')>=0 || section.localeCompare('Z')<=0){
      return true;
    }else{
      return false;
    }
  }
}

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


// User Model Definition
const userSchema = new Schema({
  name: { type: String, required: true, validate: nameValidators },
  surname: { type: String, required: true, validate: surnameValidators },
  city: { type: String, validate: cityValidators },
  email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
  username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
  password: { type: String, required: true, validate: passwordValidators },
  type: {type: String, required:true, uppercase:true, validate: typeValidators},
  clas: { year:{type: Number, validate: yearValidators}, section:{type:String, uppercase:true, validate:sectionValidators}},  //for students
  classes:[   //for teachers
    {year:{type: Number, validate: yearValidators}, section:{type:String, uppercase:true, validate:sectionValidators}, subject:{type:String}} 
  ],
  todos:[
    {
      text:{type:String},
      closed: {type: Boolean, required:true, default:false}
    }
  ],
  gender:{type:String},
  birthDate:{type:Date},
  about:{type:String},
  major:{type:String},
  TE:{type:Boolean},
  TODO:{type:Boolean},
  newUser:{type:Boolean, default:true}


});

// Schema Middleware to Encrypt Password
userSchema.pre('save', function(next) {
  // Ensure password is new or modified before applying encryption
  if (!this.isModified('password'))
    return next();

  // Apply encryption
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err); // Ensure no errors
    this.password = hash; // Apply encryption to password
    next(); // Exit middleware
  });
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
};

// Export Module/Schema
module.exports = mongoose.model('User', userSchema);