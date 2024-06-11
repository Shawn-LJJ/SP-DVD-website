// This file consists of endpoint models for logging in purposes
const establishConnAndQuery = require('./establishConnAndQuery');

const loginModel = {
    adminLogin : (email, password, callback) => {
        const sqlCommand = `select admin_id as id from admin where email = "${email}" and password = "${password}";`;
        establishConnAndQuery(callback, sqlCommand);
    }
}

module.exports = loginModel;