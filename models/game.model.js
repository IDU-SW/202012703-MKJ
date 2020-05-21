// const fs = require('fs');
const Sequelize = require('sequelize');

class Game extends Sequelize.Model { 
    static init(sequelize) {
        return super.init({
            _id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: { type: Sequelize.STRING },
            genre: { type: Sequelize.STRING },
            year: { type: Sequelize.INTEGER },
            company: { type: Sequelize.STRING },
        }, { 
            tableName: 'games', 
            timestamps: false,
            freezeTableName: true,
            sequelize,
        });
    }
}

module.exports = Game;



