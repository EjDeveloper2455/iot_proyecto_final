const mysql =  require('promise-mysql');
const config = require('./config');

const conf = config.config;

const connection = mysql.createConnection({
    host: conf.host,
    database: conf.database,
    user: conf.user,
    password: conf.password,
    port: 3306,
    timeout: 60000
});

exports.getConnection = () =>{
    return connection;
}
