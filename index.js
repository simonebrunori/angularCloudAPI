/* ===================
   Import Node Modules
=================== */
// const env = require('./env');
const multer = require('multer');
const express = require('express'); // Fast, unopinionated, minimalist web framework for node.
const app = express(); // Initiate Express Application
const router = express.Router(); // Creates a new router object.
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise;
const config = require('./config/db'); // Mongoose Config
const path = require('path'); // NodeJS Package for file paths
const users = require('./controllers/users_controller')(router); // Import Users Controller
const folders = require('./controllers/folders_controller')(router); // Import Folders Controller
const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require('cors'); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const port = process.env.PORT || 8080; // Allows heroku to set port
// Database Connection
mongoose.connect(config.uri, {
//   useMongoClient: true,
}, (err) => {
  // Check if database was able to connect
  if (err) {
    console.log('Could NOT connect to database: ', err); // Return error message
  } else {
    console.log('Connected to ' + config.db); // Return success message
  }
});


app.use(function(req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Middleware
app.use(cors({ origin: 'http://localhost:4200' })); // Allows cross origin in development only
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static("C:/Users/Simone/Desktop/frontend")); // Provide static directory for frontend      __dirname + '/public'



/* ===================
   UPLOAD
=================== */



var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.originalname);     //file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]
  }
});

var upload = multer({ //multer settings
              storage: storage
          }).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
  upload(req,res,function(err){
      console.log(req.file);
      if(err){
           res.json({error_code:1,err_desc:err});
           return;
      }
       res.json({error_code:0,err_desc:null});
  });
});

/* ===================
   DOWNLOAD
=================== */

app.post('/download', function(req,res,next){
  filepath = path.join(__dirname,'./uploads/') + req.body.filename;
  res.sendFile(filepath);
});



/* ===================
   ROUTES
=================== */


app.use('/users', users); // Use Users Controller in application
app.use('/folders', folders); // Use Folders Controller in application



// Connect server to Angular 2 Index.html
app.get('*', (req, res) => {
  res.sendFile(path.join("C:/Users/Simone/Desktop/frontend/dist/index.html"));    //__dirname + '/public/index.html'
});

// Start Server: Listen on port 8080
app.listen(port, () => {
  console.log('Listening on port ' + port);
});