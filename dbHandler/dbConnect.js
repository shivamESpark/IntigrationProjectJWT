function dbConnect(hostname, username, password, database, multiselect){
    const mysql = require("mysql");

    // the params are unuse

    hostname == undefined ? hostname = "localhost" : hostname;
    username == undefined ? username = "root" : username;
    password == undefined ? password = "Dev@123" : password;
    database == undefined ? database = "intigrationDB" : database;
    multiselect == undefined ? multiselect = true : multiselect = false;

    const con = mysql.createConnection({
        host:hostname,
        user:username,
        password:password,
        database:database,
        multipleStatements: multiselect
    });

    return con;
}

module.exports = {dbConnect};
