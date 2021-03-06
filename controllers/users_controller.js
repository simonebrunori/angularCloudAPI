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
        }).select('-password').exec((err, user) => {
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

    /* ===============================================================
        Route to get total students number
     =============================================================== */

    router.get("/studentsCount/", (req, res) => {

        //check database for users
        User.find({
            type: 'S'
        }).count().exec((err, users) => {
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
                        count: users
                    }); //return users array
                }
            }

        })

    });
    /* ===============================================================
        Route to get total teachers number
     =============================================================== */

    router.get("/teachersCount/", (req, res) => {

        //check database for users
        User.find({
            type: 'T'
        }).count().exec((err, users) => {
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
                        count: users
                    }); //return users array
                }
            }

        })

    });

    /* ===============================================================
            Route to post new todo
    =============================================================== */

    router.put('/addTodo', (req, res) => {
        // Check if text was provided
        if (!req.body.text) {
            res.status(206).json({
                success: false,
                message: 'No text was provided'
            }); // Return error
        } else {

            var obj = {
                text: req.body.text
            }

            //update user document
            User.update({
                _id: req.decoded.userId
            }, {
                $push: {
                    todos: obj
                }
            }).exec((err) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {
                    res.status(200).json({
                        success: false,
                        message: 'Todo saved!'
                    }); // Return success
                }

            })
        }
    });

    /* ===============================================================
            Route to get user's todo
    =============================================================== */

    router.get('/getTodos', (req, res) => {

        User.findOne({
            _id: req.decoded.userId
        }).select("todos").exec((err, todos) => {
            //Check for errors
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                //CHeck if todos were founded
                if (!todos) {
                    res.status(200).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {
                    res.status(200).json({
                        success: false,
                        todos
                    }); // Return success
                }

            }

        })
    });

    /* ===============================================================
            Route to delete user's todo
    =============================================================== */

    router.get('/deleteTodo/:id', (req, res) => {

        if (!req.params.id) {
            res.status(206).json({
                success: false,
                message: 'Provide a todo id'
            }); // Return error
        } else {
            User.update({
                _id: req.decoded.userId
            }, {
                $pull: {
                    todos: {
                        _id: req.params.id
                    }
                }
            }).exec((err) => {
                //Check for errors
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {

                    res.status(200).json({
                        success: false,
                        message: 'Todo removed'
                    }); // Return success

                }

            })
        }
    });


    /* ===============================================================
            Route to set as closed user's todo
    =============================================================== */

    router.get('/todoClosed/:id', (req, res) => {
        //CHeck if id was provided
        if (!req.params.id) {
            res.status(206).json({
                success: false,
                message: 'Provide todo s id'
            }); // Return error
        } else {
            User.update({
                _id: req.decoded.userId,
                "todos._id": req.params.id
            }, {
                $set: {
                    'todos.$.closed': true
                }
            }).exec((err) => {
                //Check for errors
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {

                    res.status(200).json({
                        success: false,
                        message: 'Todo updated'
                    }); // Return success

                }

            })
        }
    });


    /* ===============================================================
            Route to set as open user's todo
    =============================================================== */

    router.get('/todoOpen/:id', (req, res) => {
        //CHeck if id was provided
        if (!req.params.id) {
            res.status(206).json({
                success: false,
                message: 'Provide todo s id'
            }); // Return error
        } else {
            User.update({
                _id: req.decoded.userId,
                "todos._id": req.params.id
            }, {
                $set: {
                    'todos.$.closed': false
                }
            }).exec((err) => {
                //Check for errors
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {

                    res.status(200).json({
                        success: false,
                        message: 'Todo updated'
                    }); // Return success

                }

            })
        }
    });



    /* ===============================================================
            Route to set todo status
    =============================================================== */

    router.get('/todoStatus/:state', (req, res) => {
        //CHeck if todo status is true or false
        if (req.params.state === 'false') {
            User.update({
                _id: req.decoded.userId
            }, {
                $set: {
                    TODO: true
                }
            }).exec((err) => {
                //Check for errors
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {

                    res.status(200).json({
                        success: true,
                        message: 'Todo updated'
                    }); // Return success

                }

            })
        } else {
            User.update({
                _id: req.decoded.userId
            }, {
                $set: {
                    TODO: false
                }
            }).exec((err) => {
                //Check for errors
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {

                    res.status(200).json({
                        success: true,
                        message: 'Todo updated'
                    }); // Return success

                }

            })
        }
    });



    /* ===============================================================
            Route to set text editor status
    =============================================================== */

    router.get('/teStatus/:state', (req, res) => {
        //CHeck if text editor status is true or false

        if (req.params.state === 'false') {
            User.update({
                _id: req.decoded.userId
            }, {
                $set: {
                    TE: true
                }
            }).exec((err) => {
                //Check for errors
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {

                    res.status(200).json({
                        success: true,
                        message: 'TE updated'
                    }); // Return success

                }

            })
        } else {
            User.update({
                _id: req.decoded.userId
            }, {
                $set: {
                    TE: false
                }
            }).exec((err) => {
                //Check for errors
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {

                    res.status(200).json({
                        success: true,
                        message: 'TE updated'
                    }); // Return success

                }

            })
        }
    });

    /* ===============================================================
            Route to get all users from database
         =============================================================== */

    router.get('/getAllUsers', (req, res) => {
        // Search for user in database
        User.find().select('-password').exec((err, users) => {
            // Check if error connecting
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if user was found in database
                if (!users) {
                    res.status(404).json({
                        success: false,
                        message: 'Users not found'
                    }); // Return error, users was not found in db
                } else {
                    res.status(200).json({
                        success: true,
                        users: users
                    }); // Return success, send users object to frontend 
                }
            }
        });
    });

    /* ===============================================================
         Route to check if user's username is available for registration
      =============================================================== */
    router.get('/checkUsername/:username', (req, res) => {
        // Check if username was provided in paramaters
        if (!req.params.username) {
            res.json({
                success: false,
                message: 'Username was not provided'
            }); // Return error
        } else {
            // Look for username in database
            User.findOne({
                username: req.params.username
            }, (err, user) => { // Check if connection error was found
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    }); // Return connection error
                } else {
                    // Check if user's username was found
                    if (user) {
                        res.json({
                            success: false,
                            message: 'Username is already taken'
                        }); // Return as taken username
                    } else {
                        res.json({
                            success: true,
                            message: 'Username is available'
                        }); // Return as vailable username
                    }
                }
            });
        }
    });


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
                        // Check if name was provided
                        if (!req.body.name) {
                            res.json({
                                success: false,
                                message: 'You must provide a name'
                            }); // Return error
                        } else {
                            // Check if surname was provided
                            if (!req.body.surname) {
                                res.json({
                                    success: false,
                                    message: 'You must provide a surname'
                                }); // Return error
                            } else {
                                // Check if city was provided
                                if (!req.body.city) {
                                    res.json({
                                        success: false,
                                        message: 'You must provide a city'
                                    }); // Return error
                                } else {
                                    // Check if birthDate was provided
                                    if (!req.body.birthDate) {
                                        res.json({
                                            success: false,
                                            message: 'You must provide a birthdate'
                                        }); // Return error
                                    } else {
                                        // Check if gender was provided
                                        if (!req.body.gender) {
                                            res.json({
                                                success: false,
                                                message: 'You must provide a gender'
                                            }); // Return error
                                        } else {
                                            // Check if major was provided
                                            if (!req.body.major) {
                                                res.json({
                                                    success: false,
                                                    message: 'You must provide a major'
                                                }); // Return error
                                            } else {
                                                // Create new user object and apply user input
                                                let user = new User({
                                                    type: req.body.type,
                                                    name: req.body.name,
                                                    surname: req.body.surname,
                                                    city: req.body.city,
                                                    gender: req.body.gender,
                                                    birthDate: req.body.birthDate,
                                                    major: req.body.major,
                                                    email: req.body.email.toLowerCase(),
                                                    username: req.body.username.toLowerCase(),
                                                    password: req.body.password
                                                });
                                                // Save user to database
                                                user.save((err) => {
                                                    // Check if error occured
                                                    if (err) {
                                                        // Check if error is an error indicating duplicate account
                                                        if (err.code === 11000) {
                                                            res.json({
                                                                success: false,
                                                                message: 'Username already exists'
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
                                                                            res.json({
                                                                                success: false,
                                                                                message: err
                                                                            }); // Return any other error not already covered
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
                            }
                        }
                    }
                }
            }
        }
    });



    /* ===============================================================
        Route to get user's profile data
     =============================================================== */

    router.get('/profileData/:id', (req, res) => {

        if (!req.params.id) {
            res.status(206).json({
                success: false,
                message: 'Provide an user s id'
            }); // Return error
        } else {

            // Search for user in database
            User.findOne({
                _id: req.params.id
            }).select('-password').exec((err, user) => {
                // Check if error connecting
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {
                    // Check if user was found in database
                    if (!user) {
                        res.status(404).json({
                            success: false,
                            message: 'User not found'
                        }); // Return error, user was not found in db
                    } else {
                        res.status(200).json({
                            success: true,
                            user: user
                        }); // Return success, send user object to frontend for profile
                    }
                }
            });
        }
    });


    /* ===============================================================
        Route to add class to student
     =============================================================== */

    router.put('/addClassToStudent/:id', (req, res) => {

        //check if id was provided in the url
        if (!req.params.id) {
            res.status(206).json({
                success: false,
                message: 'Provide an user id'
            }); // Return error
        } else {
            //Check if clas array was provided
            if (!req.body.clas) {
                res.status(206).json({
                    success: false,
                    message: 'Provide a class'
                }); // Return error
            } else {
                //Find user in db
                User.findOne({
                    _id: req.params.id
                }).select('-password').exec((err, user) => {
                    //CHeck for errors
                    if (err) {

                        res.status(500).json({
                            success: false,
                            message: err
                        }); // Return error
                    } else {
                        //Check if user exists in db
                        if (!user) {
                            res.status(404).json({
                                success: false,
                                message: 'User not found in db'
                            }); // Return error
                        } else {
                            user.clas.year = parseInt(req.body.clas.year);
                            user.clas.section = req.body.clas.section;
                            //save user object
                            user.save((err) => {
                                if (err) {
                                    res.status(500).json({
                                        success: false,
                                        message: err
                                    }); // Return error
                                } else {
                                    res.status(200).json({
                                        success: false,
                                        message: 'User updated!'
                                    }); // Return error
                                }
                            })
                        }

                    }
                })
            }
        }
    });


    /* ===============================================================
       Route to add class to teacher
    =============================================================== */

    router.put('/addClassToTeacher/:id', (req, res) => {

        //check if id was provided in the url
        if (!req.params.id) {
            res.status(206).json({
                success: false,
                message: 'Provide an user id'
            }); // Return error
        } else {
            //Check if classes array was provided
            if (!req.body.classes) {
                res.status(206).json({
                    success: false,
                    message: 'Provide a class'
                }); // Return error
            } else {
                //Find user in db
                User.findOne({
                    _id: req.params.id
                }).select('-password').exec((err, user) => {
                    //CHeck for errors
                    if (err) {

                        res.status(500).json({
                            success: false,
                            message: err
                        }); // Return error
                    } else {
                        //Check if user exists in db
                        if (!user) {
                            res.status(404).json({
                                success: false,
                                message: 'User not found in db'
                            }); // Return error
                        } else {
                            user.classes = req.body.classes;
                            //save user object
                            user.save((err) => {
                                if (err) {
                                    res.status(500).json({
                                        success: false,
                                        message: err
                                    }); // Return error
                                } else {
                                    res.status(200).json({
                                        success: false,
                                        message: 'User updated!'
                                    }); // Return error
                                }
                            })
                        }

                    }
                })
            }
        }
    });


    /* ===============================================================
        Route to delete user
     =============================================================== */

    router.delete('/deleteUser/:id', (req, res) => {

        //check if id was provided in the url
        if (!req.params.id) {
            res.status(206).json({
                success: false,
                message: 'Provide an user id'
            }); // Return error
        } else {
            //Find user in db
            User.deleteOne({
                _id: req.params.id
            }).exec((err) => {

                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'User deleted!'
                    }); // Return error
                }

            })
        }
    });


    /* ===============================================================
        Route to compare old password with new
     =============================================================== */

     router.post('/comparePasswords', (req, res) => {

        //check if password was provided 
        if (!req.body.password) {
            res.status(206).json({
                success: false,
                message: 'Provide a password'
            }); // Return error
        } else {
            //Find user in db
            User.findOne({
                _id: req.decoded.userId
            }).exec((err,user)=>{
                //Check for errors
                if(err){
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                }else{
                    //Check if user was found
                    if(!user){
                        res.status(404).json({
                            success: false,
                            message: 'User not found'
                        }); // Return error
                    }else{
                        const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
                        if(validPassword){
                            res.status(200).json({
                                success: true,
                                message: 'Passwords match'
                            }); 
                        }else{
                            res.status(200).json({
                                success: false,
                                message: 'Password not match'
                            }); 
                        }
                    }

                }
            })    
        }
    });



     /* ===============================================================
       Route to change password
    =============================================================== */

    router.put('/changePassword', (req, res) => {

        //check if description was provided in the url
        if (!req.body.about) {
            res.status(206).json({
                success: false,
                message: 'Provide a description'
            }); // Return error
        } else {
            //Check if classes array was provided
            if (!req.body.password) {
                res.status(206).json({
                    success: false,
                    message: 'Provide a password'
                }); // Return error
            } else {
                //Find user in db
                User.findOne({
                    _id: req.decoded.userId
                }).exec((err, user) => {
                    //CHeck for errors
                    if (err) {

                        res.status(500).json({
                            success: false,
                            message: err
                        }); // Return error
                    } else {
                        //Check if user exists in db
                        if (!user) {
                            res.status(404).json({
                                success: false,
                                message: 'User not found in db'
                            }); // Return error
                        } else {
                            console.log(user);
                            user.password = req.body.password;
                            user.about= req.body.about;
                            user.newUser=false;
                            //save user object
                            user.save((err) => {
                                if (err) {
                                    res.status(500).json({
                                        success: false,
                                        message: err
                                    }); // Return error
                                } else {
                                    res.status(200).json({
                                        success: true,
                                        message: 'Password changed!'
                                    }); // Return error
                                }
                            })
                        }

                    }
                })
            }
        }
    });





    return router;
}