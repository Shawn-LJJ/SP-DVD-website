// This file consists of a function that simply establish connection with the SQL database server and query

// import the SQL database configuration
const getConn = require('./dbConfig');

// this function will be used to establish connection with the SQL server and the query, while also calling the callback function from the controller
// it is a universal function for establishing and querying the SQL server, reducing the duplication
// it takes in any callback that has error and result as the parameters while also taking in the SQL command to be executed on the server
function establishConnAndQuery(callback, sqlCommand) {
    const conn = getConn();
    conn.connect((error) => {
        if (error) return callback(error, null);       // if error when establishing connection, call the callback and pass the error message while passing null value for the result
        conn.query(sqlCommand, (err, result) => {      // if connection with the SQL server is success, procceed to query the server
            conn.end();
            return callback(err, result);              // regardless whether the query is successful or not, pass any error message it has and the result
        })
    })
}

// export this function to models that with endpoints that needs one query only
module.exports = establishConnAndQuery;