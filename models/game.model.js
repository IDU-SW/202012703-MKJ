// const fs = require('fs');
const Mongoose = require('mongoose');


const init = new Mongoose.Schema({
    name: { type: String, required: true },
    genre: { type: String, required: true },
    year: { type: Number, required: true },
    company: { type: String, required: true }
}, { 
    timestamps: false 
});

module.exports = init





// const Sequelize = require('sequelize');


// class Game extends Sequelize.Model {
//     static init(sequelize){
//         super.init({
//             _id: {
//                 type: Sequelize.INTEGER,
//                 autoIncrement: true,
//                 primaryKey: true
//             },
//             name: Sequelize.STRING,
//             genre: Sequelize.STRING,
//             year: Sequelize.INTEGER,
//             company: Sequelize.STRING
//         }, { tableName: 'games', timestamps: false, sequelize});
//     }
// }

// module.exports = Game;





