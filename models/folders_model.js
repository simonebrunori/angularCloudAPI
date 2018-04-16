/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose





// Folder Model Definition
const folderSchema = new Schema({
  name:{type:String,unique:true},
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
  users:{type:Array, required:true}

});


// Export Module/Schema
module.exports = mongoose.model('Folders', folderSchema);