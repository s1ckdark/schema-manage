var express = require('express');
var router = express.Router();
const users = require('../controller/users');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// mongodb
const { mongodb } = require('mongodb');
const dbConfig = require('../db.config.js');

const uri = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/`;
var MongoClient = require('mongodb').MongoClient, db;

MongoClient.connect(uri).then((client) => {
  db = client.db(dbConfig.DB);
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});



// const validPassword = (password) => {
//    db.collection('users').findOne({ username: username }, function(err, user){

//    });
// }
passport.use(new LocalStrategy(
  function(username, password, done) {
    db.collection('users').findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  User.findById(username, function(err, user) {
    done(err, user);
  });
});

/* GET users listing. */
router.post("/signin", function (req, res, next) {
      passport.authenticate('local', function (error, user, info) {
      if (error) {
        res.status(401).send(error);
      } else if (!user) {
        res.status(401).send(info);
      } else {
        next();
      }
      // res.status(401).send(info);
    })(req, res)}, users.signin);
router.post("/signup", users.signup);
router.post("/signout", users.signout);
router.post("/mypage", users.mypage);

module.exports = router;
