const sql = require('mysql2');

const connection = sql.createConnection({
  host: 'your-railway-host.railway.app',
  port: 3306,
  user: 'root',
  password: 'nukivcTvBiTJekmQqucsKjfvxprUDWkS',
  database: 'railway_db',
});

try {
    connection.connect((error) => {
        console.log("Data base is connected");
    })
} catch (error) {
    console.error('Error is Occured...');
}

module.exports = connection;
