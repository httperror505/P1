const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "csfe2",
    namedPlaceholders: true // Enable named placeholders
});

db.connect((err) => {
    if (err) {
        console.error("error connecting to Mysql:", err);
    } else {
        console.log("connected to mysql");
    }
});

module.exports = db;