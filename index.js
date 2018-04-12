/* ===================
   Import Node Modules
=================== */
// const env = require('./env');
const express = require('express'); // Fast, unopinionated, minimalist web framework for node.
const app = express(); // Initiate Express Application
const router = express.Router(); // Creates a new router object.
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise;
const config = require('./config/db'); // Mongoose Config
const path = require('path'); // NodeJS Package for file paths
const users = require('./controllers/users_controller')(router); // Import Users Controller
const classes = require('./controllers/classes_controller')(router); // Import Classes Controller
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

// Middleware
app.use(cors({ origin: 'http://localhost:4200' })); // Allows cross origin in development only
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static("C:/Users/Simone/Desktop/frontend")); // Provide static directory for frontend      __dirname + '/public'

/* ===================
   ROUTES
=================== */


app.use('/users', users); // Use Users Controller in application
app.use('/classes', classes); // Use Classes Controller in application



// Connect server to Angular 2 Index.html
app.get('*', (req, res) => {
  res.sendFile(path.join("C:/Users/Simone/Desktop/frontend/dist/index.html"));    //__dirname + '/public/index.html'
});

// Start Server: Listen on port 8080
app.listen(port, () => {
  console.log('Listening on port ' + port);
});