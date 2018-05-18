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


    /* ========
  LOGIN ROUTE
  ======== */

    router.post('/login', (req, res) => {
        // Check if username was provided
        if (!req.body.username) {
            res.json({
                success: false,
                message: 'No username was provided'
            }); // Return error
        } else {
            // Check if password was provided
            if (!req.body.password) {
                res.json({
                    success: false,
                    message: 'No password was provided.'
                }); // Return error
            } else {
                // Check if username exists in database
                User.findOne({
                    username: req.body.username.toLowerCase()
                }, (err, user) => {
                    // Check if error was found
                    if (err) {
                        res.json({
                            success: false,
                            message: err
                        }); // Return error
                    } else {
                        // Check if username was found
                        if (!user) {
                            res.json({
                                success: false,
                                message: 'Username or password not valid'
                            }); // Return error
                        } else {
                            const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
                            // Check if password is a match
                            if (!validPassword) {
                                res.json({
                                    success: false,
                                    message: 'Username or password not valid'
                                }); // Return error
                            } else {
                                const token = jwt.sign({
                                    userId: user._id
                                }, db.secret, {
                                    expiresIn: '24h'
                                }); // Create a token for client
                                res.json({
                                    success: true,
                                    message: 'Success!',
                                    token: token,
                                    user: {
                                        username: user.username,
                                        type: user.type
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
            res.json({
                success: false,
                message: 'No token provided'
            }); // Return error
        } else {
            // Verify the token is valid
            jwt.verify(token, db.secret, (err, decoded) => {
                // Check if error is expired or invalid
                if (err) {
                    res.json({
                        success: false,
                        message: 'Token invalid: ' + err
                    }); // Return error for token validation
                } else {
                    req.decoded = decoded; // Create global variable to use in any request beyond
                    next(); // Exit middleware
                }
            });
        }
    });

    /* ===============================================================
        Route to get user's profile data
     =============================================================== */

    router.get('/profile', (req, res) => {
        // Search for user in database
        User.findOne({
            _id: req.decoded.userId
        }).select('username email').exec((err, user) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if user was found in database
                if (!user) {
                    res.json({
                        success: false,
                        message: 'User not found'
                    }); // Return error, user was not found in db
                } else {
                    res.json({
                        success: true,
                        user: user
                    }); // Return success, send user object to frontend for profile
                }
            }
        });
    });


    /* ===============================================================
        Route to get teacher's classes 
     =============================================================== */

    router.get("/myClasses", (req, res) => {
        // Check if teacher's id is found in database

        User.find({
            _id: req.decoded.userId
        }).select('classes').exec((err, classes) => {
            // Check if the id is a valid ID
            if (err) {
                res.json({
                    success: false,
                    message: 'Not a valid user id'
                }); // Return error message
            } else {
                // Check if classes were found by id
                if (!classes) {
                    res.json({
                        success: false,
                        message: 'No classes founded.'
                    }); // Return error message
                } else {
                    res.json({
                        success: true,
                        count: classes[0].classes.length,
                        classes
                    }); //return classes array
                }
            }
        })

    });


    /* ===============================================================
        Route to get class' students 
     =============================================================== */

    router.get("/students/:year/:section", (req, res) => {
        //check if year exists
        if (!req.params.year) {
            res.json({
                success: false,
                message: 'No class was provided'
            }); //return error message
        } else {
            //check if section exists
            if (!req.params.section) {
                res.json({
                    success: false,
                    message: 'No section was provided'
                }); //return error message
            } else {
                //check database for students
                User.find({
                    "type": "S",
                    "clas.year": req.params.year,
                    "clas.section": req.params.section
                }).select('name surname').exec((err, students) => {
                    //check if there are error
                    if (err) {
                        res.json({
                            success: false,
                            message: 'Database execution error'
                        }); //return error message
                    } else {
                        //check if students were found in db
                        if (!students) {
                            res.json({
                                success: false,
                                message: 'No students were founded'
                            }); //return error message
                        } else {
                            res.json({
                                success: true,
                                students
                            }); //return students array
                        }
                    }

                })
            }
        }


    });


    /* ===============================================================
        Route to get all users 
     =============================================================== */

    router.get("/allUsers/:user", (req, res) => {
        //Check if user exists
        if (!req.params.user) {
            res.json({
                success: false,
                message: 'Provide an user'
            }); //return error message
        } else {
            //check database for users
            User.find({
                username: {
                    $ne: req.params.user
                }
            }).select('name surname username').exec((err, users) => {
                //check if there are error
                if (err) {
                    res.json({
                        success: false,
                        message: 'Database execution error'
                    }); //return error message
                } else {
                    //check if users were found in db
                    if (!users) {
                        res.json({
                            success: false,
                            message: 'No users were founded'
                        }); //return error message
                    } else {
                        res.json({
                            success: true,
                            users
                        }); //return users array
                    }
                }

            })


        }

    });




    return router;
}