const backEndApp = require('./controller/app');

const port = 3001;
const host = 'localhost';

// start listening for request
backEndApp.listen(port, host, () => {
    console.log(`Visit http://${host}:${port} for back end`);
})