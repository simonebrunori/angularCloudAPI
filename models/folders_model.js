/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose



let nameLengthChecker=(name)=>{
    //Check if name exists
  if(!name){
    return false; //return error
  }else{
    if(name.length>20){
      return false;     //return error
    }else{
      return true;    //return name as valid
    }
  }
}

let validName=(name)=>{
    //Check if name exists
  if(!name){
    return false; //return error
  }else{
    // Regular Expression to test if name is valid format
    const regExp = new RegExp(/^[a-zA-Z0-9_.-]*$/);
    return regExp.test(name); // Return regular expression test result (true or false)
  }
}


// Array of name validators
const nameValidators = [
    // First name validator
    {
      validator: nameLengthChecker,
      message: 'Filename must be no more than 20 charachters'
    },
    // Second name validator
    {
      validator: validName,
      message: 'Filename must contains only numbers or letters'
    }
  ];




// Folder Model Definition
const folderSchema = new Schema({
  name:{type:String, unique:true},
  createdBy:{type:String},
  createdAt:{type: Date, default: Date.now()},
  clas:{
      year:{type:Number},
      section:{type:String}
    },
  files:[
      {
          filename:{type:String},     //, validate:nameValidators
          uploadedBy:{type:String},
          uploadedAt:{type:Date, default:Date.now()},
          path:{type:String},
          description:{type:String}
      }
  ] ,
  users:{type:Array},
  parent:{type:String},
  folderPath:{type:String},
  parentName:{type:String}

});


// Export Module/Schema
module.exports = mongoose.model('Folders', folderSchema);