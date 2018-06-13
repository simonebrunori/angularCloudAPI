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

    router.get('/Tfolders', (req, res) => {
        // Search for folder in database
        Folder.find({
            createdBy: req.decoded.userId,
            parent: null
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

    router.get('/files/:folder', (req, res) => {
        // Search for files in database
        Folder.find({
            // createdBy: req.params.user,
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
                        files: file
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
        }, {
            files: {
                $elemMatch: {
                    filename: req.params.file
                }
            }
        }, (err, file) => {
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
                        file: file
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
        }).select("clas").exec((err, clas) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if clas were found in database
                if (!clas) {
                    res.json({
                        success: false,
                        message: 'clas not found'
                    }); // Return error, clas were not found in db
                } else {
                    User.find({
                        "clas.section": clas.clas.section,
                        "clas.year": clas.clas.year
                    }).select("username").exec((err, users) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: err
                            }); // Return error
                        } else {
                            if (!users) {
                                res.json({
                                    success: false,
                                    message: 'Users not founded'
                                }); // Return error
                            } else {
                                res.json({
                                    success: true,
                                    users: users
                                }); // Return success, send users array to frontend 
                            }
                        }

                    })
                }
            }
        });
    });


    /* ===============================================================
        Route to create folders
     =============================================================== */

    router.post('/createfolder', (req, res) => {

        //Check if parent folder was provided
        if (!req.body.parent) {
            res.json({
                success: false,
                message: 'Provide a parent directory'
            }); //return error
        } else {
            //Check if folder name was provided
            if (!req.body.name) {
                res.json({
                    success: false,
                    message: 'Provide a name for the folder'
                }); //return error
            } else {

                if (!req.body.path) {
                    res.json({
                        success: false,
                        message: 'Provide a path'
                    }); //return error
                } else {

                    if (!req.body.parentName) {
                        res.json({
                            success: false,
                            message: 'Provide a parentName'
                        }); //return error
                    } else {

                        //create folder model
                        const folder = new Folder({
                            name: req.body.name,
                            createdBy: req.decoded.userId,
                            parent: req.body.parent,
                            folderPath: req.body.path + req.body.name + '/',
                            parentName: req.body.parentName
                        });

                        //Save folder in the database
                        folder.save((err) => {
                            //Check executions errors
                            if (err) {
                                //Check custom errors
                                if (err.errors) {
                                    //Error of name validator
                                    if (err.errors.name) {
                                        res.json({
                                            success: false,
                                            message: err.errors.name.message
                                        }); // Return error message
                                    } else {
                                        res.json({
                                            success: false,
                                            message: err
                                        }); // Return generale error message
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
                                    message: "Folder created!"
                                }); // Return success message
                            }
                        })
                    }
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
            parent: req.params.parent
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
                        folders: folders
                    }); // Return success, send folders array to frontend 
                }
            }
        });
    });

    /* ===============================================================
            Get folder path
         =============================================================== */

    router.get('/getFolderPath/:folder', (req, res) => {
        // Search for folders in database
        Folder.findOne({
            _id: req.params.folder
        }).select("folderPath").exec((err, path) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if path was found in database
                if (!path) {
                    res.json({
                        success: false,
                        message: 'Folders not found'
                    }); // Return error, folder was not found in db
                } else {
                    res.json({
                        success: true,
                        path: path
                    }); // Return success, send folder path to frontend 
                }
            }
        });
    });



    /* ===============================================================
        Get folder file by name
     =============================================================== */

    router.get('/getFoldersFileByName/:folderName', (req, res) => {
        // Search for folders in database
        Folder.find({
            name: req.params.folderName
        }).select("files").exec((err, files) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if files were found in database
                if (!files) {
                    res.json({
                        success: false,
                        message: 'Files not found'
                    }); // Return error, files were not found in db
                } else {
                    res.json({
                        success: true,
                        files: files
                    }); // Return success, send files to frontend 
                }
            }
        });
    });


    /* ===============================================================
        Get children folders by name
     =============================================================== */

    router.get('/childrenFoldersByName/:parentFolderName', (req, res) => {
        // Search for children folders in database
        Folder.find({
            parentName: req.params.parentFolderName
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
                        folders: folders
                    }); // Return success, send folders array to frontend 
                }
            }
        });
    });

    /* ===============================================================
        Get folder path by name
     =============================================================== */

    router.get('/getFolderPathByName/:folderName', (req, res) => {
        // Search for folders in database
        Folder.findOne({
            name: req.params.folderName
        }).select("folderPath").exec((err, path) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if path was found in database
                if (!path) {
                    res.json({
                        success: false,
                        message: 'Folders not found'
                    }); // Return error, folder was not found in db
                } else {
                    res.json({
                        success: true,
                        path: path
                    }); // Return success, send folder path to frontend 
                }
            }
        });
    });


    /* ===============================================================
       ADD NEW FILE
    =============================================================== */
    router.post('/uploadfiles', (req, res) => {
        // Check if filename was provided in request body
        if (!req.body.filename) {
            res.json({
                success: false,
                message: 'No filename provided'
            }); // Return error message
        } else {
            // Check if path was provided in request body
            if (!req.body.path) {
                res.json({
                    success: false,
                    message: 'No path was provided'
                }); // Return error message
            } else {
                // Check if folderpath was provided in request body
                if (!req.body.folderPath) {
                    res.json({
                        success: false,
                        message: 'No folderpath was provided'
                    }); // Return error message
                } else {
                    // Check if uploadedBy was provided in request body
                    if (!req.body.uploadedBy) {
                        res.json({
                            success: false,
                            message: 'No user was provided'
                        }); // Return error message
                    } else {
                        // Use id to search for blog post in database
                        Folder.findOne({
                            folderPath: req.body.folderPath
                        }, (err, folder) => {
                            // Check if error was found
                            if (err) {
                                res.json({
                                    success: false,
                                    message: 'Invalid folder path'
                                }); // Return error message
                            } else {
                                // Check if folderPath matched the folderPath of any blog post in the database
                                if (!folder) {
                                    res.json({
                                        success: false,
                                        message: 'Folder not found.'
                                    }); // Return error message
                                } else {
                                    // Add the new file to the folder's array
                                    folder.files.push({
                                        filename: req.body.filename,
                                        uploadedBy: req.body.uploadedBy,
                                        path: req.body.path,
                                        description: req.body.description,
                                        uploadedAt: Date.now()
                                    });
                                    // Save folder
                                    folder.save((err) => {
                                        // Check if error was found
                                        if (err) {
                                            res.json({
                                                success: false,
                                                message: err
                                            }); // Return error message
                                        } else {
                                            res.json({
                                                success: true,
                                                message: 'file saved'
                                            }); // Return success message
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
        }
    });

    /* ===============================================================
     DELETE ELEMENT
  =============================================================== */
    router.delete('/deleteElement/:id', (req, res) => {
        // Check if ID was provided in parameters
        if (!req.params.id) {
            res.json({
                success: false,
                message: 'No id provided'
            }); // Return error message
        } else {
            // Check if id is found in database                                         5aec8e4c9d63de1a4879a336
            Folder.findOne({
                _id: req.params.id
            }, (err, folder) => {
                // Check if error was found
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    }); // Return error message
                } else {
                    // Check if folder was found in database
                    if (!folder) {
                        //Check if id is a file id
                        Folder.findOne({
                            "files._id": req.params.id
                        }, (err, folder) => {
                            //Check if there are errors
                            if (err) {
                                res.json({
                                    success: false,
                                    message: err
                                }); // Return error message
                            } else {
                                //Check if file was founded in db
                                if (!folder) {
                                    res.json({
                                        success: false,
                                        message: 'No folder or files founded with specified ID'
                                    }); // Return error message
                                } else {
                                    //Remove file from folder
                                    Folder.update({
                                        _id: folder._id
                                    }, {
                                        $pull: {
                                            files: {
                                                _id: req.params.id
                                            }
                                        }
                                    }, (err) => {
                                        if (err) {
                                            res.json({
                                                success: false,
                                                message: err
                                            }); // Return error message
                                        } else {
                                            res.json({
                                                success: true,
                                                message: 'File deleted!'
                                            }); // Return success message
                                        }
                                    })
                                }
                            }

                        });
                    } else {
                        // Remove the folder from database
                        folder.remove((err) => {
                            if (err) {
                                res.json({
                                    success: false,
                                    message: err
                                }); // Return error message
                            } else {
                                res.json({
                                    success: true,
                                    message: 'Folder deleted!'
                                }); // Return success message
                            }
                        });
                    }
                }
            });
        }
    });

    /* ===============================================================
        Get total files number
     =============================================================== */

    router.get('/getFilesCount', (req, res) => {
        // Search for folders in database
        Folder.aggregate([{
                $project: {
                    files: 1
                }
            },
            {
                $unwind: "$files"
            },
            {
                $group: {
                    _id: "result",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]).exec((err, files) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {

                res.json({
                    success: true,
                    count: files
                }); // Return success

            }
        });
    });


    /* ===============================================================
       Create class folder
    =============================================================== */

    router.post('/newFolderClass', (req, res) => {

        //Check if author was provided
        if (!req.body.createdBy) {
            res.status(206).json({
                success: false,
                message: 'Provide an author'
            }); // Return error
        } else {
            //Check if class was provided
            if (!req.body.clas) {
                res.status(206).json({
                    success: false,
                    message: 'Provide a class object'
                }); // Return error
            } else {
                const folder = new Folder({
                    createdBy: req.body.createdBy,
                    name: req.body.clas.subject + ' ' + req.body.clas.year + req.body.clas.section,
                    folderPath: '/' + req.body.clas.subject + ' ' + req.body.clas.year + req.body.clas.section + '/',
                    clas: req.body.clas
                })

                folder.save((err) => {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: err
                        }); // Return error
                    } else {
                        res.status(206).json({
                            success: true,
                            message: 'Folder created!'
                        }); // Return success
                    }
                })
            }
        }

    });


    /* ===============================================================
       Delete class folder
    =============================================================== */

    router.delete('/deleteFolder/:folderName', (req, res) => {

        //Check if author was provided
        if (!req.params.folderName) {
            res.status(206).json({
                success: false,
                message: 'Provide a folder name'
            }); // Return error
        } else {


            Folder.remove({
                name: req.params.folderName
            }, (err) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    }); // Return error
                } else {
                    res.status(206).json({
                        success: true,
                        message: 'Folder removed!'
                    }); // Return success
                }
            })
        }

    });



    /* ===============================================================
       Get class folder STUDENTS
    =============================================================== */

    router.get('/SFolder', (req, res) => {

        //Find user infos

        User.find({
            _id: req.decoded.userId
        }).select("clas").exec((err, clas) => {
            //Check for errors
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                //CHeck if clas was found in db
                if (!clas) {
                    res.status(404).json({
                        success: false,
                        message: 'User not found'
                    }); // Return error
                } else {
                    //Find folder in db
                    Folder.find({
                        "clas.year": clas[0].clas.year,
                        "clas.section": clas[0].clas.section
                    }).select("name createdAt").exec((err, folders) => {
                        //Check for errors
                        if (err) {
                            res.status(500).json({
                                success: false,
                                message: err
                            }); // Return error
                        } else {
                            //CHeck if student was found in db
                            if (!folders) {
                                res.status(404).json({
                                    success: false,
                                    message: 'Folders not found'
                                }); // Return error
                            } else {
                                res.status(200).json({
                                    success: true,
                                    folders: folders
                                }); // Return success
                            }

                        }
                    })

                }
            }
        })

    });























    return router;
}