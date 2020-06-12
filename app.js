const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

app.set('views', './views');
app.set('view engine','ejs');

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'ZEROSUGAR',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 10000 } // 10분
}));

const gameRouter = require('./routers/game.router');
const userRouter = require('./routers/user.router');
app.use(gameRouter);
app.use(userRouter);

module.exports= app;





