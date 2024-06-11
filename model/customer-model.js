// import the SQL database configuration
const getConn = require('./dbConfig');

// this function is used to dynamically add columns their respective value. If the value of a column exists, then append to columns and values
// this way allows for MySQL server to report not null errors back if the value or the column is not supplied
// this only works for inserting new values
const addColumnsAndValues = function (dataObj) {
    let columnNames = [];
    let values = [];

    // iterate over the data object and append the column names and values if there exists any value from the client
    for (let col of Object.keys(dataObj)) {
        if (dataObj[col]) {
            columnNames.push(col);
            values.push(`'${dataObj[col]}'`);
        }
    }

    return [columnNames, values];
}

const add_customer_model = {

    // Endpoint Add customer (Admin): Query the MySQL once to create a new row for the address table and retrieve the address_id of the newly created address row
    // Use the newly created address_id to supply the data needed for the new customer row in the customer table
    postCustomer: (cust_info, address, callback) => {

        const conn = getConn();
        conn.connect((error) => {

            if (error) return callback(error, null);

            // get city id based on its name
            const sqlCommand = `SELECT city_id FROM city WHERE city = "${address.city_id}";`;     // city_id actually contains the name, not the id

            conn.query(sqlCommand, (err, result) => {

                if (err) return callback(err, null);

                // check if result contains anything before inserting the city id into address object
                if (!result[0]) {
                    return callback('The city inputted does not exists', null);
                }
                
                // reassign the city_id property
                address.city_id = result[0].city_id;

                // get the column names and values for the insert SQL statement
                try { var [columnNames, columnValues] = addColumnsAndValues(address) }
                catch { conn.end; return callback({ code: 'ER_NO_DEFAULT_FOR_FIELD' }, null) }               // if there is error getting column names and values, then it means the address variable is not object

                const sqlCommand2 = `insert into address (${columnNames.join(', ')}) values (${columnValues.join(', ')});`;

                // once queried and is successful, use the insertId as the address_id for the new customer's address ID
                conn.query(sqlCommand2, (err2, result2) => {

                    // if error occurs when querying to create address row, then call the callback and return
                    if (err2) {
                        conn.end();
                        return callback(err2, null);
                    }

                    let [columnNames2, columnValues2] = addColumnsAndValues(cust_info);

                    const sqlCommand3 = `insert into customer (${columnNames2.join(', ')}, address_id) values (${columnValues2.join(', ')}, ${result2.insertId});`;

                    conn.query(sqlCommand3, (err3, result3) => {

                        callback(err3, result3);

                        // if there's an error inserting new customer, then the customer's data is not inserted, so it's address should be removed too
                        if (err3) {
                            const sqlCommand4 = `delete from address where address_id = ${result2.insertId};`;
                            conn.query(sqlCommand4, (err4, result4) => {
                                // this third query will not get callback because this is the database side of issue to be handled, not necessary for the client side to know
                                console.log(`Error while deleting the newly created address: ${err4}`);
                                console.log(`Results from address deletion: ${result4}`);
                            })
                        }
                        return conn.end();
                    })
                })
            })
        })
    }
}

module.exports = add_customer_model;