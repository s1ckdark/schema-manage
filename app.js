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
const dbConfig = require('./db.config.js');
// const uri = `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/`;
const uri = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;    
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
app.use(require("express-session")({
    secret:"Miss white is my cat",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결

require('./modules/passport');


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