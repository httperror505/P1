const mysql = require('mysql2');
const database = 'csfe2';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'csfe2',
});


db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
    } else {
        console.log("Connected to MySQL database:", database);
    }
});

module.exports = db;
