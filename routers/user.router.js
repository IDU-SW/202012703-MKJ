const router = require('express').Router();
const Service = require('../services/user.service');
const jwt = require('jsonwebtoken');
const s3 = require('../utils/s3.utils');
const { sessCheck } = require('../utils/session.utils');

router.get('/users', userLoginView);
router.get('/users/list', sessCheck, userListView);
router.get('/users/add', userAddView);
router.get('/users/:_id', sessCheck, userDetailView);
router.get('/users/update/:_id', sessCheck, userUpdateView);
router.get('/upload', sessCheck, userUploadView);


router.post('/users/upload', sessCheck, s3.s3Upload.single('imgFile'), userImgUpload);
router.post('/users', addUser);
router.post('/users/login', loginUser)
router.post('/users/update/:_id', sessCheck, updateUser);
router.post('/users/:_id', sessCheck, deleteUser);

module.exports = router;

// SHOW LIST
async function userListView(req, res) {
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

async function userLoginView(req, res) {
    const sess = req.session;

    console.log('SESSION: ', sess);
    if (sess.email, sess.token) {
        const info = await Service.getUserByEmail(sess.email);

        if (info) {
            res.render('UserLoginComplete',{ info: info });
        } else {
            res.render('UserLoginView');
        }
    } else {
        res.render('UserLoginView');
    }
}

async function loginUser(req, res) {
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
        const info = await Service.getUserByEmail(data.email);

        const user = info.dataValues;
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
async function userDetailView(req, res) {
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
function userAddView(req, res) {
    res.render('UserAddView');
}

async function addUser(req, res) {
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
async function deleteUser(req, res) {
    const sess = req.session;
    
    jwt.verify(sess.token, 'SWIFT-UI', async (err, decoded) => {
        if (!err) {
            try {
                console.log('DECODED: ', decoded);
                const user = await Service.getUserbyToken(sess.token);
                res.render('UserUpdateView',{ info: user });
            }
            catch (err) {
                res.status(err.code).send({msg: 'UnAuthorized'});
            }
        } else {
            res.status(401).send({msg: 'UnAuthorized'});
        }
    })
}

// UPDATE
async function userUpdateView(req, res) {
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

async function updateUser(req, res) {
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
                res.status(err.code).send({msg: 'UnAuthorized'});
            }
        } else {
            res.status(401).send({msg: 'UnAuthorized'});
        }
    })
}



async function userUploadView(req, res) {
    try {
        res.render('UserImageUploadView');
        // res.send(info);
    } 
    catch (error) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

async function userImgUpload(req, res) {
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
                res.status(err.code).send({msg: 'UnAuthorized'});
            }
        } else {
            res.status(401).send({msg: 'UnAuthorized'});
        }
    })
}
