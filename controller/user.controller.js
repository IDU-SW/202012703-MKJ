const Service = require('../services/user.service');
const jwt = require('jsonwebtoken');

class UserController {
    // SHOW LIST
    async userListView(req, res) {
        const sess = req.session;
        
        jwt.verify(sess.token, 'SWIFT-UI', async (err, decoded) => {
            if (!err) {
                console.log('DECODED: ', decoded);
                const user = await Service.getUserByEmail(decoded.email);

                if (user.token === sess.token) {
                    const userList = await Service.getUserList();
                    res.render('UserListView',{ data: userList, count: userList.length});
                } else {
                    res.status(401).send({msg: 'UnAuthorized'});
                }
            } else {
                res.status(401).send({msg: 'UnAuthorized'});
            }
        })
        // const result = { data:gameList, count:gameList.legth }; 
    }

    async userLoginView(req, res) {
        const sess = req.session;

        console.log('SESSION: ', sess);
        if (sess.email, sess.token) {
            const user = await Service.getUserByEmail(sess.email);

            if (user) {
                res.render('UserLoginComplete',{ info: user });
            } else {
                res.render('UserLoginView');
            }
        } else {
            res.render('UserLoginView');
        }
    }

    async loginUser(req, res) {
        const data = req.body;

        if (!data.email) {
            res.status(400).send({ error: 'email 누락'});
            return;
        }

        if (!data.password) {
            res.status(400).send({ error: 'password 누락'});
            return;
        }

        try {
            const user = await Service.getUserByEmail(data.email);
            console.log('User: ', user);

            if (user) {
                if (user.password === data.password) {
                    const token = await Service.setUserToken(user);
                    
                    console.log('AUTH: ', token);

                    req.session.token = token;
                    req.session.email = user.email;
        
                    res.render('UserLoginComplete',{ info: user });
                } else {
                    res.status(401).send({msg: 'password error'});
                }
            } else {
                res.status(401).send({msg: 'not exist User'});
            }           
            // res.send(info);
        } 
        catch (error) {
            console.log('Can not find, 404');
            res.status(error.code).send({msg:error.msg});
        }
    }

    // SHOW DETAIL
    async userDetailView(req, res) {
        const sess = req.session;
        
        jwt.verify(sess.token, 'SWIFT-UI', async (err, decoded) => {
            if (!err) {
                try {
                    console.log('DECODED: ', decoded);
                    const user = await Service.getUserbyToken(sess.token);
                    res.render('UserDetailView',{ info: user });
                }
                catch (err) {
                    res.status(err.code).send({msg: 'UnAuthorized'});
                }
            } else {
                res.status(401).send({msg: 'UnAuthorized'});
            }
        })
    }

    // ADD
    async userAddView(req, res) {
        res.render('UserAddView');
    }

    async addUser(req, res) {
        const data = req.body;

        if (!data.name) {
            res.status(400).send({ error: 'name 누락'});
            return;
        }

        if (!data.email) {
            res.status(400).send({ error: 'email 누락'});
            return;
        }

        if (!data.password) {
            res.status(400).send({ error: 'password 누락'});
            return;
        }

        try {
            const result = await Service.addUser(data);
            res.send({msg:'success', data:result});
        } catch (error) {
            res.status(500).send(error.msg);
        }
    }

    // DELETE
    async userDeleteView(req, res) {
        try {
            res.render('UserDeleteView',{info: info});
            // res.send(info);
        } 
        catch (error) {
            console.log('Can not find, 404');
            res.status(error.code).send({msg:error.msg});
        }
    }

    async deleteUser(req, res) {
        const sess = req.session;
        
        jwt.verify(sess.token, 'SWIFT-UI', async (err, decoded) => {
            if (!err) {
                try {
                    console.log('DECODED: ', decoded);
                    const user = await Service.getUserbyToken(sess.token);

                    if (user) {
                        const result = await Service.deleteUser(user._id);
                        res.status(200).send({msg: 'Delete Success', data: result})
                    } else {
                        res.status(401).send({msg: 'UnAuthorized'});
                    }
                    
                }
                catch (err) {
                    res.status(err.code).send({msg: 'Fail to Excute Sql'});
                }
            } else {
                res.status(401).send({msg: 'UnAuthorized'});
            }
        })
    }

    // UPDATE
    async userUpdateView(req, res) {
        try {
            const _id = req.params._id;
            console.log('Game Id: ', _id);
            const info = await Service.getUserbyId(_id);

            console.log('user: ', info);
            res.render('UserUpdateView',{info: info});
            // res.send(info);
        } 
        catch (error) {
            console.log('Can not find, 404');
            res.status(error.code).send({msg:error.msg});
        }
    }

    async updateUser(req, res) {
        const sess = req.session;
        const data = req.body;

        const email = data.email;
        const password = data.password;
        const name = data.name;
        const birth = data.birth;
        const phone = data.phone;
        
        if (!name || !email || !password || !birth || !phone) {
            res.status(400).send({error:'PLEASE ENTER ALL VALUES', data: data});
            return;
        }

        jwt.verify(sess.token, 'SWIFT-UI', async (err, decoded) => {
            if (!err) {
                try {
                    console.log('DECODED: ', decoded);
                    const user = await Service.getUserbyToken(sess.token);

                    try {
                        const result = await Service.updateUser(data);
                        res.status(200).render('UserDetailView',{ info: data });
                    }
                    catch (err) {
                        console.error(err);
                        res.status(500).send({error:'FAILED: UPDATE USER INFO', data: err});
                    }
                }
                catch (err) {
                    res.status(err.code).send({msg: 'Fail to Excute Sql', data: err});
                }
            } else {
                res.status(401).send({msg: 'UnAuthorized', data: err});
            }
        })
    }



    async userUploadView(req, res) {
        try {
            res.render('UserImageUploadView');
            // res.send(info);
        } 
        catch (error) {
            console.log('Can not find, 404');
            res.status(error.code).send({msg:error.msg});
        }
    }

    async userImgUpload(req, res) {
        const sess = req.session;
        
        jwt.verify(sess.token, 'SWIFT-UI', async (err, decoded) => {
            if (!err) {
                try {
                    console.log('DECODED: ', decoded);
                    const user = await Service.getUserbyToken(sess.token);
                    
                    if (req.fileValidationError) 
                        res.status(400).send({msg: req.fileValidationError});
                    else {
                        console.log(req.file.location);
                        user.imgUrl = req.file.location;
                        const result = await Service.updateUserImage(user);
                        res.status(200).send({msg:result});
                    }
                }
                catch (err) {
                    res.status(err.code).send({msg: 'Fail to Excute Sql'});
                }
            } else {
                res.status(401).send({msg: 'UnAuthorized'});
            }
        })
    }

}


module.exports = new UserController();