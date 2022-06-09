const mysql   = require('mysql');
require("dotenv").config();
// const connection = mysql.createConnection({
//     host     : "localhost",
//     user     : "root",
//     database : "dbutilisateur",
//     password : "root",
// });
 
const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    database : process.env.DB_DATABASE,
    password : process.env.DB_PASSWORD,
});


//open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});



module.exports = connection;
