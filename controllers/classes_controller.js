/* ===================
   Import Node Modules
=================== */
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const Class = require('../models/classes_model'); // Import Class Model Schema



module.exports = (router) => {


        /* ===================
        GET all teacher's classes
        =================== */

        router.get('/allClasses', (req, res) => {
            // Search database for all classes
            Blog.find({}, (err, classes) => {
              // Check if error was found or not
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if blogs were found in database
                if (!classes) {
                  res.json({ success: false, message: 'No classes found.' }); // Return error of no classes found
                } else {
                  res.json({ success: true, classes: classes }); // Return success and classes array
                }
              }
            })
          });


    return router;
}