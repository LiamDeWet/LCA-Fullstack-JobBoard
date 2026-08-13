//import mysql2 promise API
const mysql = require("mysql2/promise");

//a reusable connection pool with the database setting loaded from the .env file
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  //we can allow the pool to use multipc database connections
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//export the pool
module.exports = pool;
