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
    const regExp = new RegExp(/[^[\w[\`\'\˜\=\+\#\ˆ\@\$\&\-\_\.\(\)\{\}\;\[\]]/g);
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
  name:{type:String,unique:true, validate:nameValidators},
  createdBy:{type:String},
  createdAt:{type: Date, default: Date.now()},
  clas:{
      year:{type:Number},
      section:{type:String}
    },
  files:[
      {
          filename:{type:String, unique:true, required:true},
          uploadedBy:{type:String, required:true},
          uploadedAt:{type:Date, default:Date.now()},
          path:{type:String, required:true, unique:true},
          description:{type:String}
      }
  ] ,
  users:{type:Array, required:true},
  parent:{type:String},
  folderPath:{type:String},
  parentName:{type:String}

});


// Export Module/Schema
module.exports = mongoose.model('Folders', folderSchema);