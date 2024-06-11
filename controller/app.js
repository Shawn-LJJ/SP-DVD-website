// import necessary libraries
const app = require('express')();                   // instantly creates the express application once imported
const bodyParser = require('body-parser');          // body parser is used to parse the incoming request body data 
const verifyClass = require('../auth/verifyToken');

const actor_model = require('../model/actor-model');    // the single request model consists of model methods that only need one query to the SQL database
const customer_model = require('../model/customer-model');      // the multi request model consists of model methods that need more than one queries to the SQL database
const login_model = require('../model/login-model');                // login models
const film_model = require('../model/film-model');                  // film models

const signing = require('../auth/signing');
const cors = require('cors');

app.options('*', cors());
app.use(cors());

// use body-parser to parse incoming requests according to the Content Type
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// a very typical method to check for errors then response with internal server error else response with result, this is to reduce redundancy
const simpleAutoSend = (err, result, res) => {
    if (err) {
        console.log(err)    // print error for debugging
        res.status(500).type('json').send('{"error_msg": "Internal server error"}');
    } else {
        res.status(200).type('json').send(result);
    }
}

// Create a new verify object that act as a middeware verification
const verificationMiddleware = new verifyClass((req, res, next, decoded) => {
    // pass the user type. This is to check if the privilege matches on the next middleware
    req.body.userType = decoded.type;
    next();
})

// Endpoint Admin Login: Login for admin
app.post('/admin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    login_model.adminLogin(email, password, (err, result) => {signing(err, result[0], res, 'admin')});
})

// Endpoint Verify To Get Links: If the client is an admin, then return the links for admin, otherwise return nothing
app.get('/verify_for_links', (req, res) => {

    const verifyLink = new verifyClass((req, res, next, decoded) => {

        // check if the client is an admin. If so, append the links
        let links = []
        if (decoded.type == 'admin') {
            links = [
                {'Manage Actors' : '/manage_actor'},
                {'Add customer' : '/add_customer'}
            ]
        }
        return res.status(200).type('json').send(JSON.stringify(links));    // return a set of links for admin
    })
    verifyLink.verify(req, res);    
})

// Endpoint Verify to Gain Permission to Access Certain Webpages: Check bearer token, and if verified, check the role. If is an admin, then the client can access some restricted webpages
app.get('/verify_to_access', (req, res) => {

    const verifyAccess = new verifyClass((req, res, next, decoded) => {
        res.status(200).type('json').send(JSON.stringify({role: decoded.type}));
    })
    verifyAccess.verify(req, res);
})

// Endpoint Get Films based on Category (Public): Get a list of films' information based on the category as well as max rental rate if applied
app.get('/film_categories/:cat_id/films', (req, res) => {
    // call the getFilms model method to retrieve the list of films and their respective information based on the category that this middleware will supply
    film_model.getFilmsOnCat(req.params.cat_id, req.query.maxRental, (error, result) => {simpleAutoSend(error, result, res)});
})

// Endpoint Get Films based on Substring (Public): Get a list of films' information based on the substring as well as max rental rate if applied
app.get('/films', (req, res) => {
    // call the getFilms model method to retrieve the list of films and their respective information based on the category that this middleware will supply
    film_model.getFilmsOnSubstring(req.query.substring, req.query.maxRental, (error, result) => {simpleAutoSend(error, result, res)});
})

// Endpoint Get All Categories name (Public): For the search result where the user needs to see all the categories available in the database
app.get('/categories', (req, res) => {
    film_model.getAllCats((error, result) => {simpleAutoSend(error, result, res)});
})

// Endpoint Get Detailed Film (Public): When user clicks on the film, it will link to another page and show the details of that film
app.get('/film/:film_id', (req, res) => {
    film_model.getFilmDetails(req.params.film_id, (error, result) => {simpleAutoSend(error, result, res)});
})

// Endpoint Get Actor by Substring (Admin): Get a list of actors by the substring
app.get('/actors', verificationMiddleware.verify, (req, res) => {
    actor_model.getActor(req.query.substring, (error, result) => {simpleAutoSend(error, result, res)});
})

// Endpoint Create Actor (Admin): Create a new actor by supplying the actor's first and last name
app.post('/actors', verificationMiddleware.verify, (req, res) => {
    
    // since this endpoint requires admin privilege, if the user who make this request is not an admin, outright response with authorised
    if (req.body.userType != 'admin') {
        return res.status(403).type('html').send('<html><body> Not authorised, you do not have the right privilege </body></html>')
    }
    // trim the names first, but I need to put them inside the try catch in case there's any error which will imply invalid parameter name
    let firstNameTrim;
    let lastNameTrim;

    try {
        // attempt to retrieve and values from the parameters and trim. If encounter errors, then return error message with code number 400
        firstNameTrim = req.body['first_name'].trim();
        lastNameTrim = req.body['last_name'].trim();

        // check if there's any empty values, if so, throw a new errow which will response an error message with error code 400
        if (!firstNameTrim || !lastNameTrim) throw new Error;
        
    } catch {return res.status(400).type('json').send('{"error_msg": "missing data"}')}     // add a return because I do not want this program to continue down this middleware

    // calling the postActor method and supply it with the first name and last name
    actor_model.postActor(firstNameTrim, lastNameTrim, (error, result) => {
        if (error) {                                                                              // any other errors that occur will most likely be internal
            console.log(error);
            res.status(500).type('json').send('{"error_msg": "Internal server error"}');
        } else {
            res.status(201).type('json').send(`{"actor_id" : "${result['insertId']}"}`);         // proceed to send the id of the newly created actor as response back to the client
        }
    })
})



// Endpoint Edit Actor (Admin): Update an actor's name by supplying the first and or last name
app.put('/actors/:actor_id', verificationMiddleware.verify, (req, res) => {

    // since this endpoint requires admin privilege, if the user who make this request is not an admin, outright response with authorised
    if (req.body.userType != 'admin') {
        return res.status(403).type('html').send('<html><body> Not authorised, you do not have the right privilege </body></html>')
    }

    // check for missing info first
    // condition for code num 400: 1. no required parameters supplied -- no first and last names received or 2. empty value on either the first or last or both names
    const FIRSTNAME = req.body['first_name'];
    const LASTNAME = req.body['last_name'];

    let trimFirstName = FIRSTNAME ? FIRSTNAME.trim() : null;    // if the first name contains some values, then trim it
    let trimLastName = LASTNAME ? LASTNAME.trim() : null;       // if the last name contains some values, then trim it

    // if both the first and last name are null, or empty string, or a mixed of both, return and response with code number 400 with missing data error message
    if (!trimFirstName && !trimLastName) {
        return res.status(400).type('json').send('{"error_msg": "missing data"}');
    }

    // call the putActor model method and supply it with the actor ID, new first and last name, and a callback
    actor_model.putActor(req.params.actor_id, trimFirstName, trimLastName, (error, result) => {
        if (error) {        

            console.log(error);

            // if the error is a result of an syntax error in the SQL server, that means the user have an invalid actor_id that is not an integer, so throw a 204 error
            // or else, the error will be internal, and therefore a 500 code error
            const codeNum = error.code == 'ER_BAD_FIELD_ERROR' ? 204 : 500;
            res.status(codeNum).type('json').send('{"error_msg": "Internal server error"}');        
            
        } else {
            // use the result object to check the affectedRows. If is 1, means the row exist, otherwise the row doesn't exist, which means the actor_id is out of range
            // so if affectedRows is 1, code number will be 200, otherwise 204
            const CODENUM = result['affectedRows'] ? 200 : 204;
            res.status(CODENUM).type('json').send('{"success_msg" : "record updated"}');         // since 204 will cause the client to not receive any result, it won't matter if I send something
        }
    })

})

// Endpoint Delete Actor (Admin): Delete an actor by providing the actor's ID
app.delete('/actors/:actor_id', verificationMiddleware.verify, (req, res) => {

    // since this endpoint requires admin privilege, if the user who make this request is not an admin, outright response with authorised
    if (req.body.userType != 'admin') {
        return res.status(403).type('html').send('<html><body> Not authorised, you do not have the right privilege </body></html>')
    }
    
    // call the deleteActor model method to delete the actor by supplying the actor_id and a callback
    actor_model.deleteActor(req.params.actor_id, (error, result) => {
        // if there are errors, it would be that something is wrong while connecting or querying with the database server, and return an error message with status code 500
        if (error) {

            console.log(error);

            // if the error is a result of an syntax error in the SQL server, that means the user have an invalid actor_id that is not an integer, so throw a 204 error
            // or else, the error will be internal, and therefore a 500 code error
            const codeNum = error.code == 'ER_BAD_FIELD_ERROR' ? 204 : 500;
            res.status(codeNum).type('json').send('{"error_msg": "Internal server error"}');

        // if no error message, proceed to send the result
        } else {
            const codeNum = result['affectedRows'] == 0 ? 204 : 200;      // if the affectedRows is 0, it means the user entered an invalid id number, so the code number will be 204. Or else 200.
            res.status(codeNum).type('json').send('"success_msg": "actor deleted"');       
        }
    })
})


// Endpoint Add Customer (Admin): Create a new customer by supplying a body of customer's information
app.post('/customers', verificationMiddleware.verify, (req, res) => {

    // since this endpoint requires admin privilege, if the user who make this request is not an admin, outright response with authorised
    if (req.body.userType != 'admin') {
        return res.status(403).type('html').send('<html><body> Not authorised, you do not have the right privilege </body></html>')
    }

    const customer = {
        store_id : req.body.store_id, 
        first_name : req.body.first_name, 
        last_name : req.body.last_name, 
        email : req.body.email
    }

    const addressObj = req.body.addressObj;

    // if there is any empty value, proceed to return as missing data. If there is error, then it means the user entered invalid data or a missing address object
    try {
        if (!customer.store_id || !customer.first_name || !customer.last_name || !customer.email || !addressObj.address || !addressObj.district || !addressObj.city_id || !addressObj.phone) {
            return res.status(400).type('json').send('{"error_msg": "missing data"}');
        }
    } catch {return res.status(400).type('json').send('{"error_msg": "missing or invalid data"}');};
    
    // call the postCustomer model method which will create a new customer by supplying all the necessary information and a callback
    customer_model.postCustomer(customer, addressObj, (error, result) => {
        // if error persists, check which error is it
        if (error) {

            console.log(error);

            if (error == 'The city inputted does not exists') {
                return res.status(400).type('json').send(`{"error_msg" : "${error}"}`);
            }
            
            // check the sqlMessage to see if the duplicate entry is for duplicate email, if so, response with duplicated email error
            if (error.code == 'ER_DUP_ENTRY') {
                return res.status(409).type('json').send('{"error_msg": "email already exist"}');
            }

            if (error.code == 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                return res.status(400).type('json').send('{"error_msg": "inappropriate value"}');
            }

            if (error.sqlMessage == "Out of range value for column 'store_id' at row 1") {
                return res.status(400).type('json').send('{"error_msg": "store id out of range"}');
            }

            res.status(500).type('json').send('{"error_msg": "Internal server error"}');
        } else {
            res.status(201).type('json').send(`{"customer_id" : "${result.insertId}"}`);
        }
    })
})

module.exports = app;