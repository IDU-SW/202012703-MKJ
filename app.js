const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('views', './views');
app.set('view engine','ejs');

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false}));

const router = require('./routers/game.router');
app.use(router);

module.exports= app;





