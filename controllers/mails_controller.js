const db = require('../config/db');
const jwt = require('jsonwebtoken');
const Mail = require('../models/mails_model'); // Import Mails Model Schema
const User = require('../models/users_model'); // Import User Model Schema<


module.exports = (router) => {

        /*
         *   406: Not Acceptable | La risorsa richiesta è solo in grado di generare contenuti non accettabili secondo la header Accept inviato nella richiesta
         *   301: 
         *   200: OK | Risposta standard per le richieste HTTP andate a buon fine.
         *   500: Internal Server Error | Errore generico
         *   404: Not Found | Non è stato possibile trovare quanto richiesto
         *   206: Contenuto parziale
         */

        /* ===============================================================
            Route to create new mail (send)
         =============================================================== */


        router.post('/sendEmail', (req, res) => {
                //check if subject was provided
                if (!req.body.subject) {
                        res.status(206).json({
                                success: false,
                                message: 'You must provide a subject'
                        }); //return error message
                } else {
                        //check if body was provided
                        if (!req.body.body) {
                                res.status(206).json({
                                        success: false,
                                        message: 'You must provide a body'
                                }); //return error message
                        } else {
                                //check if writer was provided
                                if (!req.body.writtenBy) {
                                        res.status(206).json({
                                                success: false,
                                                message: 'You must provide a writer'
                                        }); //return error message
                                } else {
                                        //create email object
                                        var mail = new Mail({
                                                subject: req.body.subject,
                                                writtenBy: req.body.writtenBy,
                                                body: req.body.body,
                                                badge: req.body.badge
                                        })

                                        mail.save((err, Mail) => {
                                                //Check executions errors
                                                if (err) {
                                                        //Check custom errors
                                                        if (err.errors) {
                                                                //Error of body validator
                                                                if (err.errors.body) {
                                                                        res.json({
                                                                                success: false,
                                                                                message: err.errors.body.message
                                                                        }); // Return error message
                                                                } else {
                                                                        if (err.errors.subject) {
                                                                                res.json({
                                                                                        success: false,
                                                                                        message: err.errors.subject.message
                                                                                }); // Return error message  
                                                                        } else {
                                                                                res.json({
                                                                                        success: false,
                                                                                        message: err
                                                                                }); // Return generale error message
                                                                        }
                                                                }
                                                        } else {
                                                                res.json({
                                                                        success: false,
                                                                        message: err
                                                                }); // Return generale error message
                                                        }
                                                } else {
                                                        res.json({
                                                                success: true,
                                                                message: "Email Sent!",
                                                                mail: Mail._id
                                                        }); // Return success message
                                                }
                                        })
                                }
                        }
                }
        });

        /* ===============================================================
            Route to add sendees to mail (classes input)
         =============================================================== */


        router.put('/addSendeesClass/:mailId', (req, res) => {
                //check if class was provided
                if (!req.body.clas) {
                        res.status(206).json({
                                success: false,
                                message: 'You must provide at least one class'
                        }); //return error message
                } else {
                        //check if mail id was provided
                        if (!req.params.mailId) {
                                res.status(206).json({
                                        success: false,
                                        message: 'You must provide mail id'
                                }); //return error message
                        } else {
                                //find students in the class
                                User.find({
                                        'clas.year': req.body.clas.year,
                                        'clas.section': req.body.clas.section
                                }).select('_id').exec((err, users) => {
                                        if (err) {
                                                res.status(500).json({
                                                        success: false,
                                                        message: err
                                                }); // Return error
                                        } else {
                                                //Check if users were founded
                                                if (!users) {
                                                        res.status(404).json({
                                                                success: false,
                                                                message: 'Users not found'
                                                        }); // Return error, users were not found in db
                                                } else {
                                                        //search for mail
                                                        Mail.findOne({
                                                                _id: req.params.mailId
                                                        }, (err, mail) => {
                                                                //check for errors
                                                                if (err) {
                                                                        res.status(500).json({
                                                                                success: false,
                                                                                message: err
                                                                        }); // Return error
                                                                } else {
                                                                        //check if mail was founded in db
                                                                        if (!mail) {
                                                                                res.status(404).json({
                                                                                        success: false,
                                                                                        message: 'Mail not found'
                                                                                }); // Return error, users were not found in db
                                                                        } else {

                                                                                var sendeeArray = [];

                                                                                users.forEach(element => {
                                                                                        sendeeArray.push({
                                                                                                sendee: element._id
                                                                                        });
                                                                                });



                                                                                Mail.update({
                                                                                        _id: req.params.mailId
                                                                                }, {
                                                                                        "$addToSet": {
                                                                                                "sendees": {
                                                                                                        "$each": sendeeArray
                                                                                                }
                                                                                        }
                                                                                }, (err) => {
                                                                                        // Check if error was found
                                                                                        if (err) {
                                                                                                res.status(500).json({
                                                                                                        success: false,
                                                                                                        message: err
                                                                                                }); // Return error message
                                                                                        } else {
                                                                                                res.status(200).json({
                                                                                                        success: true,
                                                                                                        message: 'users added'
                                                                                                }); // Return success message
                                                                                        }
                                                                                })

                                                                        }
                                                                }
                                                        })
                                                }
                                        }
                                })
                        }
                }
        });


        /* ===============================================================
            Route to add sendees to mail (single user input)
         =============================================================== */


        router.put('/addSendees/:mailId', (req, res) => {
                //check if sendee was provided
                if (!req.body.sendee) {
                        res.status(206).json({
                                success: false,
                                message: 'You must provide at least one sendee'
                        }); //return error message
                } else {
                        //check if mail id was provided
                        if (!req.params.mailId) {
                                res.status(206).json({
                                        success: false,
                                        message: 'You must provide mail id'
                                }); //return error message
                        } else {

                                //search for mail
                                Mail.findOne({
                                        _id: req.params.mailId
                                }, (err, mail) => {
                                        //check for errors
                                        if (err) {
                                                res.status(500).json({
                                                        success: false,
                                                        message: err
                                                }); // Return error
                                        } else {
                                                //check if mail was founded in db
                                                if (!mail) {
                                                        res.status(404).json({
                                                                success: false,
                                                                message: 'Mail not found'
                                                        }); // Return error, users were not found in db
                                                } else {

                                                        var Obj = {
                                                                sendee: req.body.sendee
                                                        };


                                                        Mail.update({
                                                                _id: req.params.mailId
                                                        }, {
                                                                "$addToSet": {
                                                                        "sendees": Obj
                                                                }
                                                        }, (err) => {
                                                                // Check if error was found
                                                                if (err) {
                                                                        res.status(500).json({
                                                                                success: false,
                                                                                message: err
                                                                        }); // Return error message
                                                                } else {
                                                                        res.status(200).json({
                                                                                success: true,
                                                                                message: 'users added'
                                                                        }); // Return success message
                                                                }
                                                        })




                                                }
                                        }
                                })

                        }
                }
        });



        /* ===============================================================
            Route to get email for inbox
         =============================================================== */


        router.get('/mailInbox/:limit/:skip', (req, res) => {
                //Check if email number to get was provided for pagination
                if (!req.params.limit) {
                        res.status(206).json({
                                success: false,
                                message: 'Provide an email limit number'
                        }); //return error message
                } else {
                        //Check if email number to skip was provided for pagination
                        if (!req.params.skip) {
                                res.status(206).json({
                                        success: false,
                                        message: 'Provide an email skip number'
                                }); //return error message 
                        } else {
                                Mail.find({
                                        'sendees.sendee': req.decoded.userId,
                                        'sendees.deleted': false
                                }).limit(parseInt(req.params.limit)).skip(parseInt(req.params.skip)).sort({
                                        writtenAt: -1
                                }).exec((err, mails) => {
                                        if (err) {
                                                res.status(500).json({
                                                        success: false,
                                                        message: err
                                                }); // Return error message
                                        } else {
                                                if (!mails) {
                                                        res.status(500).json({
                                                                success: false,
                                                                message: 'Mails not funded in db'
                                                        }); // Return error message
                                                } else {

                                                        res.status(200).json({
                                                                success: true,
                                                                mails: mails
                                                        }); // Return mails
                                                }
                                        }
                                })

                        }
                }

        });


        /* ===============================================================
           Route to get email content
        =============================================================== */


        router.get('/mail/:id', (req, res) => {
                //Check if email id was provided
                if (!req.params.id) {
                        res.status(206).json({
                                success: false,
                                message: 'Provide an email id'
                        }); //return error message
                } else {

                        Mail.findOne({
                                _id: req.params.id
                        }).exec((err, mail) => {
                                if (err) {
                                        res.status(500).json({
                                                success: false,
                                                message: err
                                        }); // Return error message
                                } else {
                                        if (!mail) {
                                                res.status(500).json({
                                                        success: false,
                                                        message: 'Mail not funded in db'
                                                }); // Return error message
                                        } else {
                                                res.status(200).json({
                                                        success: true,
                                                        mail: mail
                                                }); // Return mails
                                        }
                                }
                        })
                }

        });


        /* ===============================================================
            Route to get email for NEW
         =============================================================== */


        router.get('/mailNew/:limit/:skip', (req, res) => {
                //Check if email number to get was provided for pagination
                if (!req.params.limit) {
                        res.status(206).json({
                                success: false,
                                message: 'Provide an email limit number'
                        }); //return error message
                } else {
                        //Check if email number to skip was provided for pagination
                        if (!req.params.skip) {
                                res.status(206).json({
                                        success: false,
                                        message: 'Provide an email skip number'
                                }); //return error message 
                        } else {
                                Mail.find({"sendees":{$elemMatch:{$and:[{sendee:req.decoded.userId},{deleted:false},{read:false}]}}}).limit(parseInt(req.params.limit)).skip(parseInt(req.params.skip)).sort({
                                        writtenAt: -1
                                }).exec((err, mails) => {
                                        if (err) {
                                                res.status(500).json({
                                                        success: false,
                                                        message: err
                                                }); // Return error message
                                        } else {
                                                if (!mails) {
                                                        res.status(500).json({
                                                                success: false,
                                                                message: 'Mails not funded in db'
                                                        }); // Return error message
                                                } else {
                                                        res.status(200).json({
                                                                success: true,
                                                                mails: mails
                                                        }); // Return mails
                                                }
                                        }
                                })

                        }
                }

        });

        /* ===============================================================
            Route to get email for TRASH
         =============================================================== */


        router.get('/mailTrash/:limit/:skip', (req, res) => {
                //Check if email number to get was provided for pagination
                if (!req.params.limit) {
                        res.status(206).json({
                                success: false,
                                message: 'Provide an email limit number'
                        }); //return error message
                } else {
                        //Check if email number to skip was provided for pagination
                        if (!req.params.skip) {
                                res.status(206).json({
                                        success: false,
                                        message: 'Provide an email skip number'
                                }); //return error message 
                        } else {
                                Mail.find({
                                        'sendees.sendee': req.decoded.userId,
                                        'sendees.deleted': true
                                }).limit(parseInt(req.params.limit)).skip(parseInt(req.params.skip)).sort({
                                        writtenAt: -1
                                }).exec((err, mails) => {
                                        if (err) {
                                                res.status(500).json({
                                                        success: false,
                                                        message: err
                                                }); // Return error message
                                        } else {
                                                if (!mails) {
                                                        res.status(500).json({
                                                                success: false,
                                                                message: 'Mails not funded in db'
                                                        }); // Return error message
                                                } else {
                                                        res.status(200).json({
                                                                success: true,
                                                                mails: mails
                                                        }); // Return mails
                                                }
                                        }
                                })

                        }
                }

        });
        /* ===============================================================
            Route to get email for IMPORTANT
         =============================================================== */


        router.get('/mailImportant/:limit/:skip', (req, res) => {
                //Check if email number to get was provided for pagination
                if (!req.params.limit) {
                        res.status(206).json({
                                success: false,
                                message: 'Provide an email limit number'
                        }); //return error message
                } else {
                        //Check if email number to skip was provided for pagination
                        if (!req.params.skip) {
                                res.status(206).json({
                                        success: false,
                                        message: 'Provide an email skip number'
                                }); //return error message 
                        } else {
                                Mail.find({
                                        'sendees.sendee': req.decoded.userId,
                                        badge: 'important'
                                }).limit(parseInt(req.params.limit)).skip(parseInt(req.params.skip)).sort({
                                        writtenAt: -1
                                }).exec((err, mails) => {
                                        if (err) {
                                                res.status(500).json({
                                                        success: false,
                                                        message: err
                                                }); // Return error message
                                        } else {
                                                if (!mails) {
                                                        res.status(500).json({
                                                                success: false,
                                                                message: 'Mails not funded in db'
                                                        }); // Return error message
                                                } else {
                                                        res.status(200).json({
                                                                success: true,
                                                                mails: mails
                                                        }); // Return mails
                                                }
                                        }
                                })

                        }
                }

        });
        /* ===============================================================
            Route to get email for COMMUNICATION
         =============================================================== */


        router.get('/mailCommunication/:limit/:skip', (req, res) => {
                //Check if email number to get was provided for pagination
                if (!req.params.limit) {
                        res.status(206).json({
                                success: false,
                                message: 'Provide an email limit number'
                        }); //return error message
                } else {
                        //Check if email number to skip was provided for pagination
                        if (!req.params.skip) {
                                res.status(206).json({
                                        success: false,
                                        message: 'Provide an email skip number'
                                }); //return error message 
                        } else {
                                Mail.find({
                                        'sendees.sendee': req.decoded.userId,
                                        badge: 'communication'
                                }).limit(parseInt(req.params.limit)).skip(parseInt(req.params.skip)).sort({
                                        writtenAt: -1
                                }).exec((err, mails) => {
                                        if (err) {
                                                res.status(500).json({
                                                        success: false,
                                                        message: err
                                                }); // Return error message
                                        } else {
                                                if (!mails) {
                                                        res.status(500).json({
                                                                success: false,
                                                                message: 'Mails not funded in db'
                                                        }); // Return error message
                                                } else {
                                                        res.status(200).json({
                                                                success: true,
                                                                mails: mails
                                                        }); // Return mails
                                                }
                                        }
                                })

                        }
                }

        });
        /* ===============================================================
            Route to get email for HOMEWORK
         =============================================================== */


        router.get('/mailHomework/:limit/:skip', (req, res) => {
                //Check if email number to get was provided for pagination
                if (!req.params.limit) {
                        res.status(206).json({
                                success: false,
                                message: 'Provide an email limit number'
                        }); //return error message
                } else {
                        //Check if email number to skip was provided for pagination
                        if (!req.params.skip) {
                                res.status(206).json({
                                        success: false,
                                        message: 'Provide an email skip number'
                                }); //return error message 
                        } else {
                                Mail.find({
                                        'sendees.sendee': req.decoded.userId,
                                        badge: 'homework'
                                }).limit(parseInt(req.params.limit)).skip(parseInt(req.params.skip)).sort({
                                        writtenAt: -1
                                }).exec((err, mails) => {
                                        if (err) {
                                                res.status(500).json({
                                                        success: false,
                                                        message: err
                                                }); // Return error message
                                        } else {
                                                if (!mails) {
                                                        res.status(500).json({
                                                                success: false,
                                                                message: 'Mails not funded in db'
                                                        }); // Return error message
                                                } else {
                                                        res.status(200).json({
                                                                success: true,
                                                                mails: mails
                                                        }); // Return mails
                                                }
                                        }
                                })

                        }
                }

        });


        /* ===============================================================
            Route to get email for SENT
         =============================================================== */


        router.get('/mailSent/:limit/:skip/:username', (req, res) => {
                //Check if email number to get was provided for pagination
                if (!req.params.limit) {
                        res.status(206).json({
                                success: false,
                                message: 'Provide an email limit number'
                        }); //return error message
                } else {
                        //Check if email number to skip was provided for pagination
                        if (!req.params.skip) {
                                res.status(206).json({
                                        success: false,
                                        message: 'Provide an email skip number'
                                }); //return error message 
                        } else {

                                //Check if username was provided 
                                if (!req.params.username) {
                                        res.status(206).json({
                                                success: false,
                                                message: 'Provide username'
                                        }); //return error message 
                                } else {

                                        Mail.find({
                                                writtenBy: req.params.username
                                        }).limit(parseInt(req.params.limit)).skip(parseInt(req.params.skip)).sort({
                                                writtenAt: -1
                                        }).exec((err, mails) => {
                                                if (err) {
                                                        res.status(500).json({
                                                                success: false,
                                                                message: err
                                                        }); // Return error message
                                                } else {
                                                        if (!mails) {
                                                                res.status(500).json({
                                                                        success: false,
                                                                        message: 'Mails not funded in db'
                                                                }); // Return error message
                                                        } else {
                                                                res.status(200).json({
                                                                        success: true,
                                                                        mails: mails
                                                                }); // Return mails
                                                        }
                                                }
                                        })

                                }
                        }
                }

        });

        /* ===============================================================
            Route to set email read
         =============================================================== */


        router.get('/mailRead/:mailId', (req, res) => {
                //Check if email number to get was provided for pagination
                if (!req.params.mailId) {
                        res.status(206).json({
                                success: false,
                                message: 'Provide an email ID'
                        }); //return error message
                } else {

                        Mail.updateOne({
                                _id: req.params.mailId,
                                'sendees.sendee': req.decoded.userId
                        },{$set: {
                                'sendees.$.read': true
                            }}).exec((err) => {
                                if (err) {
                                        res.status(500).json({
                                                success: false,
                                                message: err
                                        }); // Return error message
                                } else {
                                        res.status(200).json({
                                                success: true,
                                                message: 'Mail set as read'
                                        }); // Return success message 
                                }
                        })
                }

        });
















        return router;
}