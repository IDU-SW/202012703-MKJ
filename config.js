require('dotenv').config();

const Sequelize = require('sequelize');
const db = process.env.RDS_DB;
const user = process.env.RDS_USER;
const password = process.env.RDS_PW;
const host = process.env.RDS_HOST;
const port = process.env.RDS_PORT;


const connect = new Sequelize(db, user, password, {
    dialect: 'mysql',
    dialecltOptions: {
        ssl:'Amazon RDS'
    },
    host: host,
    port: port,
    logging: console.log,
    maxConcurrentQueries: 100,
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci', 
        timestamps: true
    }
});

connect.authenticate()
.then(() => {
    console.log('Sequelize DB 연결 성공');
})
.catch(err => {
    console.error('Sequelize DB 연결 실패 :', err);
});


module.exports = connect;