const fs = require('fs');

class game {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.data = JSON.parse(data);
    }

    getGameList() {
        if (this.data) {
            return this.data;
        }
    }

    getGameDetail(_id) {
        return new Promise((resolve, reject) => {
            for (var object of this.data) {
                if (object._id == _id) {
                    resolve(object);
                    return;
                }
            }
            reject({ msg: _id + ' not found', code: 404 });
        });
    }

    addGame(data) {
        return new Promise((resolve, reject) => {
            const _idx = this.data[this.data.length - 1]._id + 1;
            const newGame = {
                _id:_idx,
                name:data.name,
                genre:data.genre,
                year:data.year,
                company:data.company
            }
            this.data.push(newGame);
            resolve(newGame);
        });
    }

    updateGame(data){
        return new Promise((resolve, reject) => {
            console.log('START UPDATE...');
            for (var object of this.data) {
                if (object._id == data._id) {
                    object.name = data.name;
                    object.genre = data.genre;
                    object.year = data.year;
                    object.company = data.company;
                    console.log('CHECK OBJECT: ', object);
                    console.log('COMPLETE UPDATE...');
                    resolve(object);
                    return;
                }
            }
            reject({ msg: data._id + ' not update', code: 404 });
        });
    }

    deleteGame(_id){
        return new Promise((resolve, reject) => {
            for (var object of this.data) {
                if (object._id == _id) {
                    this.data.splice(object._id,1);
                    resolve(object._id);
                    return;
                }
            }
            reject({ msg: _id + ' not found', code: 404 });
        });
    }
}

module.exports = new game();

