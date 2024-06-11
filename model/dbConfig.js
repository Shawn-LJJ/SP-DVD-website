// import mysql library
const mysql = require('mysql');

// create a simple function that returns a connection object after calling this function and the connection creation function based on the configuration set and export the connection
const getConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'bed_dvd_root',
        password: 'pa$$woRD123',
        database: 'bed_dvd_db'
    })}

module.exports = getConnection;