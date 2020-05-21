require('dotenv').config();

const Sequelize = require('sequelize');
const db = process.env.MYSQL_DB;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PW;
const url = process.env.MYSQL_URL;

const connect = new Sequelize(db, user, password, {
    dialect: 'mysql',
    host: url,
    logging: console.log
});

connect.authenticate()
.then(() => {
    console.log('Sequelize DB 연결 성공');
})
.catch(err => {
    console.error('Sequelize DB 연결 실패 :', err);
});


module.exports = connect;