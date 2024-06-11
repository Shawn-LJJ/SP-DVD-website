// Name: Shawn Lim Jun Jie
// Admin number: 2239745
// Class: DAAA/FT/1B/01

// this file consists of the method to sign, to be applied to both logging in for admin and regular users

const jwt = require('jsonwebtoken');
const config = require('../config/config');

const signing = (err, result, res, userType) => {
    // if error occurs, return and response with internal server error
    if (err) {return res.status(500).type('json').send('{"error" : "Internal server error"}')};

    // check result truth value
    if (result) {
        // if true, it means there the email and password are entered correctly
        // create a payload and sign. User type is determined on the login endpoint, and is use to tell whether the user is an admin or a regular user
        const payload = {id : result.id, type : userType};
        jwt.sign(payload, config.secretKey, {algorithm: "HS256"}, (err2, token) => {

            // if error signing, return 401
            if (err2) {
                console.log(err2); 
                return res.status(401).send();
            }
            
            // else response with token
            return res.status(200).type('json').send({
                token : token,
                id : result.id,
                type : userType
            })

        })
    } else {res.status(401).send()}     // if false, it means invalid email and or password
}

module.exports = signing;