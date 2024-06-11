// Name: Shawn Lim Jun Jie
// Admin number: 2239745
// Class: DAAA/FT/1B/01

const jwt = require('jsonwebtoken');
const config = require('../config/config');

// verification object template
class verifyClass {
    constructor(callback) {
        this.callback = callback;
    }
    verify = (req, res, next = null) => {

        const bearerToken = req.headers['authorization'];

        // store this.callback into a variable so that it can be called while inside another function
        const thisCallback = this.callback;

        // check if the bearer token exists
        if (bearerToken && bearerToken.includes('Bearer')) {
            // verify the token
            jwt.verify(bearerToken.split(' ')[1], config.secretKey, { algorithms: "HS256" }, (err, decoded) => {
                if (err) {
                    return res.status(403).type('html').send('<html><body> Not authorised, error verifying </body></html>')   // return a not authorised page back if verification fail
                } else {
                    thisCallback(req, res, next, decoded);
                }
            })
        } else { return res.status(403).type('html').send('<html><body> Not authorised, invalid token </body></html>') }   // return a not authorised page back if no bearer token
    }
}

module.exports = verifyClass;