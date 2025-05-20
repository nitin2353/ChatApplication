const sql = require('mysql2');

const connection = sql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    database: 'chattingapp',
    password: process.env.db_password
});

try {
    connection.connect((error) => {
        console.log("Data base is connected");
    })
} catch (error) {
    console.error('Error is Occured...');
}

module.exports = connection;