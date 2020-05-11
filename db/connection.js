const fs = require('fs');
const config = fs.readFileSync('./db/config.json');
const dbConfig = JSON.parse(config);
const mysql = require('mysql2');
const dbPool = mysql.createPool(dbConfig).promise();

module.exports = dbPool;
