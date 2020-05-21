const connect = require('../config');
const Game = require('../models/game.model').init(connect);


class GameService {
    constructor() {
        try {
            this.prepareModel();
        } catch (error) {
            console.error(error);
        }
    }

    async prepareModel() {
        try {
            await Game.sync({force:false});
        }
        catch(err) {
            console.log('Game.sync ERROR: ', err);
        }
    }
    
    async getGameList() {
        try {
            let result = [];
            let ret = await Game.findAll({});
            for(let item of ret) {
                result.push(item.dataValues);
            }
            return result;
        }
        catch (err) {
            console.log('ERROR: ', err);
        } 
    }
    
    async getGameDetail(_id) {
        try {
            const ret = await Game.findByPk(_id);
            if (ret) {
                return ret.dataValues;
            } else {
                console.log('NO DATA');
            }
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }
    
    async addGame(data) {
        try {
            console.log('START INSERT...');
            const ret = await Game.create({
                name: data.name,
                genre: data.genre,
                year: data.year,
                company: data.company
            }, {log: false});
            const newData = ret.dataValues;
            return newData;
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }
    
    async updateGame(data){
        try {
            console.log('START UPDATE...');
            const ret = await Game.update(
                {   name: data.name,
                    genre: data.genre,
                    year: data.year,
                    company: data.company },
                { where: {
                    _id: data._id 
                }}
            );
    
            if(ret) {
                return ret;
            } else {
                console.log('CANNOT UPDATE');
            }
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }
    
    async deleteGame(_id){
        try {
            console.log('START DELETE...');
            await Game.destroy({
                where: {
                    _id: _id
                }
            })
            .then(res => {
                return res;
            })
            .catch(err => {
                console.error('DELETE ERROR: ', err);
            })
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }
}


module.exports = new GameService();