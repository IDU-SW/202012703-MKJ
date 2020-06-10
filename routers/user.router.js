const router = require('express').Router();
const Service = require('../services/user.service');


router.get('/users', showUserLogin);
router.get('/users/list', showUserList);
router.get('/users/add', addUserView);
router.post('/users', addUser);
router.post('/users/login', loginUser)
router.get('/users/:_id', showGameDetail);
router.get('/users/update/:_id', updateGameView);
router.post('/users/update/:_id', updateGame);
router.post('/users/:_id', deleteGame);

module.exports = router;

// SHOW LIST
async function showUserList(req, res) {
    const gameList = await Service.getUserList();
    // const result = { data:gameList, count:gameList.legth };
    res.render('UserListView',{ data: gameList, count: gameList.length});
}

function showUserLogin(req, res) {
    res.render('UserLoginView');
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
        const info = await Service.loginUser(data);
        
        res.render('UserLoginComplete',{ info: info });
        // res.send(info);
    } 
    catch (error) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// SHOW DETAIL
async function showGameDetail(req, res) {
    try {
        const _id = req.params._id;
        console.log('Game Id: ', _id);
        const info = await Service.getGameDetail(_id);
        console.log('INFO: ', info);
        
        res.render('GameDetailView',{ info: info });
        // res.send(info);
    } 
    catch (error) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// ADD
function addUserView(req, res) {
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
async function deleteGame(req, res) {
    try {
        const _id = req.params._id;
        console.log('DELETED GAME : ', _id);
        const result = await Service.deleteGame(_id);
        res.send({msg:'COMPLETE: DELETED GAME INFO', data:result});
    }
    catch ( error ) {
        res.status(400).send({error:'FAILED: DELETED GAME INFO'});
    }
}

// UPDATE
async function updateGameView(req, res) {
    try {
        const _id = req.params._id;
        console.log('Game Id: ', _id);
        const info = await Service.getGameDetail(_id);
        res.render('GameUpdateView',{info: info});
        // res.send(info);
    } 
    catch (error) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

async function updateGame(req, res) {
    
    const data = req.body;
    console.log('UPDATED GAME : ', data._id);

    const name = data.name;
    const genre = data.genre;
    const year = data.year;
    const company = data.company;

    console.log('CHECK DATA: ', data);

    if (!name || !genre || !year || !company) {
        res.status(400).send({error:'PLEASE ENTER ALL VALUES'});
        return;
    }

    try {
        const result = await Service.updateGame(data);
        res.send({msg:'COMPLETE: UPDATED ' + data._id, data:result});
    }
    catch ( error ) {
        console.error(error);
        res.status(500).send({error:'FAILED: UPDATE GAME INFO,'});
    }
}