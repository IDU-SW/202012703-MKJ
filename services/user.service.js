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
            const res = await User.findAll({});

            if (res) {
                for(let item of res) {
                    result.push(item.dataValues);
                }
                return result;
            }
            else
                return '';
            
        }
        catch (err) {
            console.log('ERROR: ', err);
        } 
    }

    async getUserByEmail(data) {
        try {
            const res = await User.findOne({
                where: {
                    email: data
                }
            })

            if (res)
                return res.dataValues;
            else
                return '';   
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }

    async setUserToken(data) {
        console.log('DATA: ',data);
        try {
            const token = await this.issueToken(data.email, data.name);
            const res = await User.update({
                token: token
            }, {
                where: {
                    _id: data._id
                }
            });

            if (res)
                return token;
            else   
                return '';
        }
        catch (err) {
            console.log('ERROR: ', err);
        } 
    }

    async getUserbyToken(data) {
        try {
            const res = await User.findOne({
                where: {
                    token: data
                }
            });

            if (res)
                return res.dataValues;
            else
                return '';
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }
    
    async getUserbyId(_id) {
        try {
            const res = await User.findByPk(_id);

            if (res) 
                return res.dataValues;
            else 
                return '';
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

            const res = await User.create({
                email: data.email,
                password: data.password,
                name: data.name,
                birth: birth,
                phone: phone,
                createdAt: created,
                updatedAt: updated
            }, { 
                log: false
            });

            if (res)
                return res.dataValues;
            else
                return '';
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }
    
    async updateUser(data){
        try {
            console.log('START UPDATE...');
            const res = await User.update(
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

            if (res)
                return res;
            else
                return '';
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }

    async updateUserImage(data) {
        try {
            console.log('START UPDATE...');
            const res = await User.update(
                {
                    imgUrl: data.imgUrl
                },
                {
                    where: {
                        _id: data._id
                    }
                }
            );

            if (res)
                return res;
            else
                return '';
        }
        catch (err) {
            console.log('ERROR: ', err);
        }
    }
    
    async deleteUser(_id){
        try {
            console.log('START DELETE...');
            const res = await User.destroy({
                where: {
                    _id: _id
                }
            });

            if (res)
                return res;
            else
                return '';
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