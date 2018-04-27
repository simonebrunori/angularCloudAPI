const db = require('../config/db');
const jwt = require('jsonwebtoken');
const Folder = require('../models/folders_model'); // Import Folders Model Schema
const User = require('../models/users_model'); // Import User Model Schema


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
        Folder.find({
            createdBy: req.params.user,
            parent:null
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
        Folder.find({
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



    /* ===============================================================
        Route to get file's informations
     =============================================================== */

     router.get('/fileInfo/:file', (req, res) => {
        // Search for file in database
        Folder.findOne({
            "files.filename": req.params.file
        },{files:{$elemMatch:{filename: req.params.file}}},(err, file) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if file was found in database
                if (!file) {
                    res.json({
                        success: false,
                        message: 'File not found'
                    }); // Return error, file was not found in db
                } else {
                    res.json({
                        success: true,
                        file:file
                    }); // Return success, send file object to frontend 
                }
            }
        });
    });



    /* ===============================================================
        Route to get file's users list
     =============================================================== */

     router.get('/fileUser/:file', (req, res) => {
        // Search for users in database
        Folder.findOne({
            "files.filename": req.params.file
        }).select("users").exec((err, users) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if users were found in database
                if (!users) {
                    res.json({
                        success: false,
                        message: 'Users not found'
                    }); // Return error, users were not found in db
                } else {
                    res.json({
                        success: true,
                        users:users
                    }); // Return success, send users array to frontend 
                }
            }
        });
    });
    
    
    /* ===============================================================
        Route to create folders
     =============================================================== */

    router.post('/createfolder', (req, res) => {

        //Check if parent folder was provided
        if(!req.body.parent){
            res.json({ success: false, message:'Provide a parent directory'});  //return error
        }else{
            //Check if folder name was provided
            if(!req.body.name){
                res.json({ success: false, message:'Provide a name for the folder'});   //return error
            }else{
                //Check if creator was provided
                if(!req.body.createdBy)
                {
                    res.json({ success: false, message:'Provide a creator'});   //return error
                }else{

                    //Take the list of users of the parent directory. Users are the same in children directories
                    Folder.findOne({_id:req.body.parent}).select("users").exec((err,users)=>{
                        //Check execution errors
                        if(err){
                            res.json({
                                success: false,
                                message: err
                            }); // Return error
                        }else{
                            //Check if users were founded
                            if(!users){
                                res.json({
                                    success: false,
                                    message: 'Users not found'
                                }); // Return error, users were not found in db
                            }else{

                                //create folder model
                                const folder= new Folder({
                                    name: req.body.name,
                                    createdBy: req.body.createdBy,
                                    users: users.users,
                                    parent: req.body.parent
                                });

                                //Save folder in the database
                                folder.save((err)=>{
                                    //Check executions errors
                                    if(err){
                                        //Check custom errors
                                        if(err.errors){
                                            //Error of name validator
                                            if(err.errors.name){
                                                res.json({ success: false, message: err.errors.name.message }); // Return error message
                                            }else{
                                                res.json({ success: false, message: err }); // Return generale error message
                                            }
                                        }else {
                                            res.json({ success: false, message: err }); // Return generale error message
                                        }
                                    }else{
                                        res.json({ success: true, message: "Folder created!" }); // Return success message
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    });

    /* ===============================================================
        Get children folders
     =============================================================== */

     router.get('/childrenFolders/:parent', (req, res) => {
        // Search for children folders in database
        Folder.find({
            parent : req.params.parent
        }, (err, folders) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if folders were found in database
                if (!folders) {
                    res.json({
                        success: false,
                        message: 'Folders not found'
                    }); // Return error, folders were not found in db
                } else {
                    res.json({
                        success: true,
                        folders:folders
                    }); // Return success, send folders array to frontend 
                }
            }
        });
    });
    




    return router;
}