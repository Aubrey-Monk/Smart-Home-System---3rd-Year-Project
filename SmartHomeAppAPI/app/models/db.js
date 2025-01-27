const mysql = require('mysql');
const dbConfig = require('../config/db.config.js');

// create pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

// test pool and connnection
pool.query('SELECT 1 + 1 AS solution', (error) => {
  if (error) throw error;
  console.log('Successfully connected to the database.');
});

// whenever a connection is made to the pool
pool.on('acquire', () => {
  // console.log('Connection %d acquired', connection.threadId);
});

module.exports = pool;
