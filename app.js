require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');   
const passportLocalMongoose = require('passport-local-mongoose');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const usersRouter = require('./routes/users');
const app = express();


// mongodb -> mongoose
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/`;
// const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;    
mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true });

global.db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// cors 
var corsOptions = {
  origin: "http://localhost:8080",
  credentials : true,  
};
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
// app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24;
app.use(require("express-session")({
    secret:"thisisschemamanager",
    resave: false,
    saveUninitialized: false,
     cookie: { maxAge: oneDay },
}));
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결

require('./modules/passport');

const pageTitle = {
  '/':"홈",
  '/schmanager':'스키마조회',
  '/schregister':'스키마등록',
  '/users/signin':'로그인',
  '/users/signup':'회원가입',
  '/analyzer':'다양성 검사',    
  '/report':'리포트 출력',
  '/result':'정확성 검사',
  '/users/forgot':'비밀번호 찾기'
  }
app.use(function(req,res,next){
    req.url ? res.locals.title = pageTitle[req.url] : res.locals.title="SSL";
    if(req.session.passport) {
      res.locals.user = req.user;
      res.locals.currentUser = req.session.passport.user;
      res.locals.isLogged = true;
    } else {
      res.locals.isLogged = false;
    }
    next();

});

app.use((req, res, next) => {
  if (req.session && req.session.flash && req.session.flash.length > 0) {
    req.session.flash = []
  }
  next()
})

// express-ejs-layout
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// bootstrap, Jquery
app.use('/stylesheets', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/temp', express.static(path.join(__dirname, 'public/temp')))
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//server on
var port = process.env.PORT || 8080;
// Send message for default URL
// Launch app to listen to specified port
app.listen(port, function () {
  console.log("Running on port " + port);
});

module.exports = app;