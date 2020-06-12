const connect = require('../config');
const User = require('../models/user.model').init(connect);
const jwt = require('jsonwebtoken');


class UserService {
    constructor() {
        try {
            this.prepareModel();
        } catch (error) {
            console.error(error);
        }
    }

    async prepareModel() {
        try {
            await User.sync({force:false});
        }
        catch(err) {
            console.log('User.sync ERROR: ', err);
        }
    }
    
    async getUserList() {
        try {
            let result = [];
            let ret = await User.findAll({});
            for(let item of ret) {
                result.push(item.dataValues);
            }
            return result;
        }
        catch (err) {
            console.log('ERROR: ', err);
        } 
    }

    async getUserByEmail(data) {
        try {
            let ret = await User.findOne({
                where: {
                    email: data
                }
            });       
            return ret;
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }

    async setUserToken(data) {
        console.log('DATA: ',data);
        try {
            const token = await this.issueToken(data.email, data.name);
            const ret = await User.update({
                token: token
            }, {
                where: {
                    _id: data._id
                }
            });

            return token;
        }
        catch (err) {
            console.log('ERROR: ', err);
        } 
    }

    async getUserbyToken(data) {
        try {
            const ret = await User.findOne({
                where: {
                    token: data
                }
            });

            return ret;
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }
    
    async getUserbyId(_id) {
        try {
            const ret = await User.findByPk(_id);
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
    
    async addUser(data) {
        try {
            console.log('START INSERT...');
            const birth = data.birth1 + data.birth2 + data.birth3;
            const phone = data.phone1 + data.phone2 + data.phone3;
            const created = Date.now();
            const updated = Date.now();

            const ret = await User.create({
                email: data.email,
                password: data.password,
                name: data.name,
                birth: birth,
                phone: phone,
                createdAt: created,
                updatedAt: updated
            }, {log: false});
            const newData = ret.dataValues;
            return newData;
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }
    
    async updateUser(data){
        try {
            console.log('START UPDATE...');
            const ret = await User.update(
                {   
                    email: data.email,
                    password: data.password,
                    name: data.name,
                    birth: data.birth,
                    phone: data.phone
                },
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

    async issueToken(email, name) {
        const secretKey = "SWIFT-UI";
        const expire = 60 * 60 * 24;
        const payload = {
            email: email,
            name: name,
            iat: Date.now()
        };
        const option = {
            algorithm: 'HS256',
            expiresIn: expire
        };

        return jwt.sign(payload, secretKey, option);
    }
}


module.exports = new UserService();