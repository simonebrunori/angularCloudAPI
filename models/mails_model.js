/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


//Length validator for subject
let subjectLengthChecker=(subject)=>{
  //Check if subject exists
if(!subject){
  return false; //return error
}else{
  if(subject.length>200){
    return false;     //return error
  }else{
    return true;    //return subject as valid
  }
}
}

//Length validator for body
let bodyLengthChecker=(body)=>{
  //Check if body exists
if(!body){
  return false; //return error
}else{
  if(body.length>2000){
    return false;     //return error
  }else{
    return true;    //return body as valid
  }
}
}




// Mail Model Definition
const mailSchema = new Schema({
    writtenBy:{type:String},
    writtenAt:{type: Date, default: Date.now()},
    subject:{type:String, required:true, validate:subjectLengthChecker},
    body:{type:String, validate:bodyLengthChecker},
    sendees:[
      {
        sendee:{type:String},   //user _id
        deleted:{type:Boolean, default:false, required:true},
        read:{type:Boolean, default:false, required:true},
        _id: false
      }
    ]
  
  });
  
  
  // Export Module/Schema
  module.exports = mongoose.model('Mails', mailSchema);