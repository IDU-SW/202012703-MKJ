const express = require('express');
const router = express.Router();
const gameModel = require('../model/GameModel');


router.get('/games', showGameList);
router.get('/games/add', addGameView);
router.post('/games', addGame);
router.get('/games/:_id', showGameDetail);
router.get('/games/update/:_id', updateGameView);
router.post('/games/update/:_id', updateGame);
router.post('/games/:_id', deleteGame);

module.exports = router;

// SHOW LIST
async function showGameList(req, res) {
    const gameList = await gameModel.getGameList();
    // const result = { data:gameList, count:gameList.legth };
    res.render('GameListView',{ data: gameList, count: gameList.length});
}

// SHOW DETAIL
async function showGameDetail(req, res) {
    try {
        const _id = req.params._id;
        console.log('Game Id: ', _id);
        const info = await gameModel.getGameDetail(_id);
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
function addGameView(req, res) {
    res.render('GameAddView');
}

async function addGame(req, res) {
    const data = req.body;
    
    if (!data.name) {
        res.status(400).send({ error: 'name 누락'});
        return;
    }
    
    data.year = parseInt(req.body.year);

    try {
        const result = await gameModel.addGame(data);
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
        const result = await gameModel.deleteGame(_id);
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
        const info = await gameModel.getGameDetail(_id);
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
        const result = await gameModel.updateGame(data);
        res.send({msg:'COMPLETE: UPDATED ' + data._id, data:result});
    }
    catch ( error ) {
        console.error(error);
        res.status(500).send({error:'FAILED: UPDATE GAME INFO,'});
    }
}