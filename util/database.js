const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'ntcg',
  password: 'aringking1104',
});

module.exports = pool.promise();
