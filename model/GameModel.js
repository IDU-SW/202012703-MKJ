const fs = require('fs');
const pool = require('../db/connection');

class game {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.data = JSON.parse(data);
    }

    async getGameList() {
        let conn;
        try {
            conn = await pool.getConnection();
            const sql = 'SELECT * from gameList.games;';

            const [rows, metadata] = await conn.query(sql);
            conn.release();

            return rows;
        }
        catch (err) {
            console.log('ERROR: ', err);
        } finally {
            if (conn)
                conn.release();
        }
    }

    async getGameDetail(_id) {
        let conn;
        try {
            conn = await pool.getConnection();
            const sql = 'SELECT * from gameList.games where _id like ?;';
            const value = _id;

            const [rows, metadata] = await conn.query(sql, value);
            conn.release();

            return rows[0];
        }
        catch (err) {
            console.log('ERROR: ', err);
        } finally {
            if (conn)
                conn.release();
        }
    }

    async addGame(data) {
        let conn;
        try {
            console.log('START INSERT...');
            conn = await pool.getConnection();
            const sql = 'insert into gameList.games (name, genre, year, company) values (?, ?, ?, ?);';
            const values = [data.name, data.genre, data.year, data.company];

            const ret = await conn.query(sql, values);
            conn.release();

            return ret[0];
        }
        catch (err) {
            console.log('ERROR: ', err);
        } finally {
            if (conn)
                conn.release();
        }
    }

    async updateGame(data){
        let conn;
        try {
            console.log('START UPDATE...');
            conn = await pool.getConnection();
            const sql = 'update gameList.games set name = ?, genre = ?, year = ?, company = ? where _id = ?;';
            const values = [data.name, data.genre, data.year, data.company, data._id];

            const ret = await conn.query(sql, values);
            conn.release();

            return ret[0];
        }
        catch (err) {
            console.log('ERROR: ', err);
        } finally {
            if (conn)
                conn.release();
        }
    }

    async deleteGame(_id){
        let conn;
        try {
            console.log('START DELETE...');
            conn = await pool.getConnection();
            const sql = 'delete from gameList.games where _id = ?;';
            const value = _id;

            const ret = await conn.query(sql, value);
            conn.release();

            return ret[0];
        }
        catch (err) {
            console.log('ERROR: ', err);
        } finally {
            if (conn)
                conn.release();
        }
    }
}

module.exports = new game();

