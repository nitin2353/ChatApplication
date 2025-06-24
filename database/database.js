const sql = require('mysql2');

const connection = sql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

try {
    connection.connect((error) => {
        console.log("Data base is connected");
    })
} catch (error) {
    console.error('Error is Occured...');
}

module.exports = connection;