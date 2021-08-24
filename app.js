const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
// const bodyParser = require("body-parser");
const logger = require('morgan');
const cors = require("cors");
const fs = require('fs');
const passport = require('passport');
const app = express();

// mongodb
const { mongodb } = require('mongodb');
const dbConfig = require('./db.config.js');

// const uri = `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/`;
const uri = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/`;
var MongoClient = require('mongodb').MongoClient, db;

MongoClient.connect(uri).then((client) => {
  global.db = client.db(dbConfig.DB);
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot cconnect to the database!", err);
    process.exit();
});

// cors 
var corsOptions = {
  origin: "http://localhost:8080"
};
app.use(cors(corsOptions));


app.use(logger('dev'));
// parse requests of content-type - application/json
// app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
app.use(cookieParser());
app.use(passport.initialize());


// express-ejs-la ㅖyout
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// <%= title %>

// bootstrap, Jquery
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const usersRouter = require('./routes/users');

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


/* server on */
var port = process.env.PORT || 8080;
// Send message for default URL

// Launch app to listen to specified port
app.listen(port, function () {
  console.log("Running on port " + port);
});



module.exports = app;
