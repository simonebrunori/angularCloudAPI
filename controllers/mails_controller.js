const db = require('../config/db');
const jwt = require('jsonwebtoken');
const Mail = require('../models/mails_model'); // Import Mails Model Schema
const User = require('../models/users_model'); // Import User Model Schema


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

                //Check if subject was provided
                if (!req.body.subject) {
                        res.status(206).json({
                                success: false,
                                message: 'Provide a subject'
                        }); //return error
                } else {
                        //Check if writtenBy was provided
                        if (!req.body.writtenBy) {
                                res.status(206).json({
                                        success: false,
                                        message: 'Provide a writer for this email'
                                }); //return error
                        } else {
                                //Check if body was provided
                                if (!req.body.body) {
                                        res.status(206).json({
                                                success: false,
                                                message: 'Provide a body'
                                        }); //return error
                                } else {
                                        //create mail model
                                        const mail = new Mail({
                                                subject: req.body.subject,
                                                writtenBy: req.body.writtenBy,
                                                body: req.body.body
                                        });

                                        //Save email in the database
                                        mail.save((err) => {
                                                //Check executions errors
                                                if (err) {
                                                        //Check custom errors
                                                        if (err.errors) {
                                                                //Error of subject validator
                                                                if (err.errors.subject) {
                                                                        res.status(500).json({
                                                                                success: false,
                                                                                message: err.errors.subject.message
                                                                        }); // Return error message
                                                                } else {
                                                                        //Error of body validator
                                                                        if(err.errors.body)
                                                                        {
                                                                                res.status(500).json({
                                                                                        success: false,
                                                                                        message: err.errors.body.message
                                                                                }); // Return error message
                                                                        }
                                                                        else{
                                                                        res.status(500).json({
                                                                                success: false,
                                                                                message: err
                                                                        }); // Return generale error message
                                                                }
                                                                }
                                                        } else {
                                                                res.status(500).json({
                                                                        success: false,
                                                                        message: err
                                                                }); // Return generale error message
                                                        }
                                                } else {
                                                        res.status(200).json({
                                                                success: true,
                                                                message: "Mail sent!"
                                                        }); // Return success message
                                                }
                                        })
                                }
                        }
                }
        });















        return router;
}