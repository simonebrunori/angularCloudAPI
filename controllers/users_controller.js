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
                                                        res.status(500).json({
                                                            success: false,
                                                            message: err.errors.type.message
                                                        }); // Return error
                                                    } else {
                                                        res.status(500).json({
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
                                res.status(200).json({
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

  router.post('/login', (req, res) => {
    // Check if username was provided
    if (!req.body.username) {
      res.json({ success: false, message: 'No username was provided' }); // Return error
    } else {
      // Check if password was provided
      if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided.' }); // Return error
      } else {
        // Check if username exists in database
        User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: err }); // Return error
          } else {
            // Check if username was found
            if (!user) {
              res.json({ success: false, message: 'Username or password not valid' }); // Return error
            } else {
              const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
              // Check if password is a match
              if (!validPassword) {
                res.json({ success: false, message: 'Username or password not valid' }); // Return error
              } else {
                const token = jwt.sign({ userId: user._id }, db.secret, { expiresIn: '24h' }); // Create a token for client
                res.json({
                  success: true,
                  message: 'Success!',
                  token: token,
                  user: {
                    username: user.username
                  }
                }); // Return success and token to frontend
              }
            }
          }
        });
      }
    }
  });

   /* ================================================
  MIDDLEWARE - Used to grab user's token from headers
  ================================================ */
  router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.status(406).json({ success: false, message: 'No token provided' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, db.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.status(500).json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });




    return router;
}