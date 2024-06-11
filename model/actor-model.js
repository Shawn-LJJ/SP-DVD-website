// this file contains models that handle actor and its related table(s)
const establishConnAndQuery = require('./establishConnAndQuery');
const getConn = require('./dbConfig');

// this object will consists of all the methods that can be use depending on what the client requested
const actor_model = {

    // Endpoint Get Actor (Admin): Get a list of actors that matches the substring to either its first or last name
    getActor : (subString, callback) => {
        // split up the subString in terms of whitespace because we don't know which word belongs to the first or last name
        const listOfWordsInName = subString.split(' ');

        // maps the list of word to SQL code that checks for first name
        const firstNameList = listOfWordsInName.map((firstName) => {return `first_name LIKE "%${firstName}%"`});
        
        // maps the list of word to SQL code that checks for last name
        const lastNameList = listOfWordsInName.map((lastName) => {return `last_name LIKE "%${lastName}%"`});

        // join the name list and concatenate them
        const sqlCommand = `SELECT actor_id, first_name, last_name FROM actor WHERE ${firstNameList.join(' OR ')} OR ${lastNameList.join(' OR ')};`;
        establishConnAndQuery(callback, sqlCommand);
    },

    // Endpoint Add Actor (Admin): Post a new actor into the database. This is assuming the values are "cleaned" as bad values such as empty value will be handled in the controller
    postActor : (first_name, last_name, callback) => {
        const sqlCommand = `insert into actor(first_name, last_name) values("${first_name}", "${last_name}");`;
        establishConnAndQuery(callback, sqlCommand);
    },

    // Endpoint Edit Actor (Admin): Update an actor name. Because we can choose to update only the first or last name, we need some fluidity
    putActor : (actor_id, first_name, last_name, callback) => {

        // if first name is not null, then append setting the first name onto a string, otherwise it's only empty string
        let s = first_name ? `first_name = '${first_name}'` : '';

        // if last name is not null and the string s is not empty string, then append the comma and the setting of the last name
        // otherwise if last name is simply not null, then append the setting of the last name. Or else, append empty string
        s += last_name && s ? `, last_name = '${last_name}'` : last_name ? `last_name = '${last_name}'` : ''; 

        // the resulting string s and the actor ID will be concatenated into the SQL command string
        const sqlCommand = `update actor set ${s} where actor_id = ${actor_id}`;
        establishConnAndQuery(callback, sqlCommand);
    },

    // Endpoint Delete Actor (Admin): Delete an actor based on the actor ID given, but before that must also delete rows on actor_film data that has the corresponding actor_id
    deleteActor : (actor_id, callback) => {

        const conn = getConn();
        conn.connect((error) => {
            if (error) {return callback(error, null)}

            // delete all the rows that contains the said actor_id
            const sqlCommand = `delete from film_actor where actor_id = ${actor_id};`;
            conn.query(sqlCommand, (err, result) => {
                if (err) {                              // if encounter error removing rows on film_actor, end connection and return while calling the callback
                    conn.end();
                    return callback(err, null);
                }                                       // don't bother moving on if there's an error deleting on film_actor

                // finally attempt to remove the actor inside the table
                const sqlCommand2 = `delete from actor where actor_id = ${actor_id};`;
                conn.query(sqlCommand2, (err2, result2) => {
                    conn.end();
                    return callback(err2, result2);
                })
            })
        })
    }
}

module.exports = actor_model;