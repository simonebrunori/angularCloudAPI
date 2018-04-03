const db = require('../config/db');
const jwt = require('jsonwebtoken');
const User = require('../models/users_model'); // Import User Model Schema


module.exports = (router) => {

    /*
     *   406: Not Acceptable | La risorsa richiesta è solo in grado di generare contenuti non accettabili secondo la header Accept inviato nella richiesta
     *   301: 
     *   200: OK | Risposta standard per le richieste HTTP andate a buon fine.
     *   500: Internal Server Error | Errore generico
     *   404: Not Found | Non è stato possibile trovare quanto richiesto
     */

    /* ==============
     Register Route
  ============== */
    router.post('/register', (req, res) => {
        // Check if email was provided
        if (!req.body.email) {
            res.json({
                success: false,
                message: 'You must provide an e-mail'
            }); // Return error
        } else {
            // Check if username was provided
            if (!req.body.username) {
                res.json({
                    success: false,
                    message: 'You must provide a username'
                }); // Return error
            } else {
                // Check if password was provided
                if (!req.body.password) {
                    res.json({
                        success: false,
                        message: 'You must provide a password'
                    }); // Return error
                } else {
                    // Check if type was provided
                    if (!req.body.type) {
                        res.json({
                            success: false,
                            message: 'You must provide a type'
                        }); // Return error
                    } else {
                        // Create new user object and apply user input
                        let user = new User({
                            email: req.body.email.toLowerCase(),
                            username: req.body.username.toLowerCase(),
                            password: req.body.password,
                            type: req.body.type.toUpperCase()
                        });
                        // Save user to database
                        user.save((err) => {
                            // Check if error occured
                            if (err) {
                                // Check if error is an error indicating duplicate account
                                if (err.code === 11000) {
                                    res.json({
                                        success: false,
                                        message: 'Username or e-mail already exists'
                                    }); // Return error
                                } else {
                                    // Check if error is a validation rror
                                    if (err.errors) {
                                        // Check if validation error is in the email field
                                        if (err.errors.email) {
                                            res.json({
                                                success: false,
                                                message: err.errors.email.message
                                            }); // Return error
                                        } else {
                                            // Check if validation error is in the username field
                                            if (err.errors.username) {
                                                res.json({
                                                    success: false,
                                                    message: err.errors.username.message
                                                }); // Return error
                                            } else {
                                                // Check if validation error is in the password field
                                                if (err.errors.password) {
                                                    res.json({
                                                        success: false,
                                                        message: err.errors.password.message
                                                    }); // Return error
                                                } else {
                                                    // Check if validation error is in the type field
                                                    if (err.errors.type) {
                                                        res.json({
                                                            success: false,
                                                            message: err.errors.type.message
                                                        }); // Return error
                                                    } else {
                                                        res.json({
                                                            success: false,
                                                            message: err
                                                        }); // Return any other error not already covered
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        res.json({
                                            success: false,
                                            message: 'Could not save user. Error: ',
                                            err
                                        }); // Return error if not related to validation
                                    }
                                }
                            } else {
                                res.json({
                                    success: true,
                                    message: 'Acount registered!'
                                }); // Return success
                            }
                        });
                    }
                }
            }
        }
    });


    /* ========
  LOGIN ROUTE
  ======== */



    return router;
}