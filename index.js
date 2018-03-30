/*
 * Name: angularCloudAPI
 * Developer: Brunori Simone
 * Version: v 0.1.1
 * */

/* Begin Express imports and configuration as HTTP server */
const express = require('express');
const router=express.Router();
const api = module.exports = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const server = require('http').Server(api);
const users= require('./controllers/users_controller')(router);

/* End Express imports and configuration as HTTP server  */


/* Connection to mySQL */
const db=require('./config/db');


/* Begin api config */
api.use(cors());
api.disable('x-powered-by');
api.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
api.use(bodyParser.json({
    limit: '50mb'
}));
api.use(morgan('dev'));
api.use(express.static('www')); // Angular static files

/* End api config */


/* ROUTING  */
api.use('/api/users', users);



/* HTTP server initialization  */
var port=8080;
var ip='127.0.0.1';
server.listen(port, ip , function () {
    console.log('Server is running on socket ' + ip + ' : ' + port);
});