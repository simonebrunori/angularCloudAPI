const db = require('../config/db');
const jwt = require('jsonwebtoken');
const Folders = require('../models/folders_model'); // Import Folders Model Schema
const Users = require('../models/users_model'); // Import User Model Schema


module.exports = (router) => {

    /*
     *   406: Not Acceptable | La risorsa richiesta è solo in grado di generare contenuti non accettabili secondo la header Accept inviato nella richiesta
     *   301: 
     *   200: OK | Risposta standard per le richieste HTTP andate a buon fine.
     *   500: Internal Server Error | Errore generico
     *   404: Not Found | Non è stato possibile trovare quanto richiesto
     */


    /* ===============================================================
        Route to get user's folders
     =============================================================== */

     router.get('/Tfolders/:user', (req, res) => {
        // Search for folder in database
        Folders.find({
            createdBy: req.params.user
        }).select('name createdAt').exec((err, folder) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if folder was found in database
                if (!folder) {
                    res.json({
                        success: false,
                        message: 'Folders not found'
                    }); // Return error, folders were not found in db
                } else {
                    res.json({
                        success: true,
                        folders: folder
                    }); // Return success, send folder object to frontend 
                }
            }
        });
    });



    /* ===============================================================
        Route to get folder's files
     =============================================================== */

     router.get('/files/:folder/:user', (req, res) => {
        // Search for files in database
        Folders.find({
            createdBy: req.params.user,
            _id: req.params.folder
        }).select("files").exec((err, file) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if files were found in database
                if (!file) {
                    res.json({
                        success: false,
                        message: 'Files not found'
                    }); // Return error, folders were not found in db
                } else {
                    res.json({
                        success: true,
                        files:file
                    }); // Return success, send files object to frontend 
                }
            }
        });
    });


    




    return router;
}