// This file consists of endpoint models for dealing with films and its categories and infos
const establishConnAndQuery = require('./establishConnAndQuery');
const getConn = require('./dbConfig');

const film = {
    // Endpoint Get Films based on a Category (Public): Query and retrieve a list of films based on the category and the max rental if given
    getFilmsOnCat : (cat_id, maxRental, callback) => {
        let sqlCommand = `select f.title, f.rating, f.release_year, f.rental_rate, f.film_id from film_category fc, film f, category c
                            where c.category_id = ${cat_id} and c.category_id = fc.category_id and fc.film_id = f.film_id`;

        // if max rental rate is provided, then append another condition to choose films that are within the condition
        sqlCommand += maxRental ? ` and f.rental_rate <= ${maxRental};` : ';';
        establishConnAndQuery(callback, sqlCommand);
    },

    // Endpoint Get Films based on Substring (Public): Query and retrieve a list of films based on its substring and max rental if given
    getFilmsOnSubstring : (substring, maxRental, callback) => {
        let sqlCommand = `SELECT title, rating, release_year, rental_rate, film_id FROM bed_dvd_db.film WHERE title LIKE "%${substring}%"`;

        // if max rental rate is provided, then append another condition to choose films that are within the condition
        sqlCommand += maxRental ? ` and rental_rate <= ${maxRental};` : ';';
        establishConnAndQuery(callback, sqlCommand);
    },

    // Endpoint Get All Categories (Public): Query and retrieve a list of all categories name available in database
    getAllCats : (callback) => {
        establishConnAndQuery(callback, 'SELECT category_id, name FROM category;');
    },

    // Endpoint Get Film Details (Public): Query and retrieve a list of all the necessary details of the film
    getFilmDetails : (film_id, callback) => {
        
        // since this model needs 2 queries, I have to manually design the connection and querying
        const conn = getConn();
        conn.connect((error) => {
            if (error) return callback(error, null);      

            // get the title, category, release year, description, and the rating of the film first
            const sqlCommand = `SELECT f.title, c.name as category, f.release_year, f.description, f.rating 
            FROM film f, film_category fc, category c WHERE f.film_id = ${film_id} AND f.film_id = fc.film_id AND fc.category_id = c.category_id;`;

            conn.query(sqlCommand, (err, result) => {    
                
                if (err) return callback(err, null);

                // if no issue querying the first one, then attempt to query for the actor
                const sqlCommand2 = `SELECT a.first_name, a.last_name FROM film_actor fa, actor a WHERE fa.film_id = ${film_id} AND fa.actor_id = a.actor_id;`;

                conn.query(sqlCommand2, (err2, result2) => {

                    conn.end()      // end the connection, no longer need to query

                    // form a data object so that I can combine the first and second result together
                    const data = {
                        filmDetails : result[0],
                        filmActors : result2
                    }

                    return callback(err2, data);    // return with callback and passing the data object also
                })
            })
        })
    }
}

module.exports = film;