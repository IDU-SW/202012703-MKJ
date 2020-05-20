require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT;

// View Setting
app.set('views', './views');
app.set('view engine','ejs');

// Static File Service
app.use(express.static('public'));

// Body-parser
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false}));

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;

// CONNECT TO MONGODB SERVER
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then( () => {
        console.log('Successfully connected to mongodb');
    })
    .catch( err => {
        console.error(err);
    });

const gameRouter = require('./routers/game.router');
app.use(gameRouter);

app.listen(port, () => {
    console.log('Server is listening @${port}');
});

module.exports = app;




