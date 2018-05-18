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
                

        });















        return router;
}