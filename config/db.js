const mysql = require('mysql');

const config={
    host: 'phpmyadmin.cgwmxirlwuuu.eu-west-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password:'admin123',
    database: 'AngularCloud'
};


const connection = mysql.createConnection(config);
connection.connect((err)=> {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to database '+ config.database);
    }
});
module.exports = connection;