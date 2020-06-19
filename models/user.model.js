// const fs = require('fs');
const Sequelize = require('sequelize');

class User extends Sequelize.Model { 
    static init(sequelize) {
        return super.init({
            _id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            email: { type: Sequelize.STRING },
            password: { type: Sequelize.STRING },
            name: { type: Sequelize.STRING },
            birth: { type: Sequelize.STRING },
            phone: { type: Sequelize.STRING },
            token: { 
                type: Sequelize.STRING,
                allowNull: true
            },
            imgUrl: { 
                type: Sequelize.STRING,
                allowNull: true 
            },
        }, { 
            charset: 'utf8',
            tableName: 'users', 
            timestamps: true,
            freezeTableName: true,
            sequelize,
        });
    }
}

module.exports = User;