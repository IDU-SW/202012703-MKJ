const express = require('express');
const router = express.Router();
const gameModel = require('../model/GameModel');


router.get('/games', showGameList);
router.get('/games/:_id', showGameDetail);
router.post('/games', addGame);
router.put('/games', updateGame);
router.delete('/games/:_id', deleteGame);

module.exports = router;

// SHOW LIST
function showGameList(req, res) {
    const gameList = gameModel.getGameList();
    const result = { data:gameList, count:gameList.legth };
    res.send(result);
}

// SHOW DETAIL
async function showGameDetail(req, res) {
    try {
        const _id = req.params._id;
        console.log('Game Id: ', _id);
        const info = await gameModel.getGameDetail(_id);
        res.send(info);
    } 
    catch (error) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// ADD
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