const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

app.set('views', './views');
app.set('view engine','ejs');

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

const gameRouter = require('./routers/game.router');
const userRouter = require('./routers/user.router');
app.use(gameRouter);
app.use(userRouter);

module.exports= app;





