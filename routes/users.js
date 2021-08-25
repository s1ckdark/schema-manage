var express = require('express');
var router = express.Router();
const users = require('../controller/users');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require("crypto");

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, username, password, cb) => {
    	console.log(username);
      try {
        db.collection('users').findOne({ where: { username } }).then(user => {
          if (user) {
            return cb(null, false, { message: "Already registered!" });
          } else {
            let encryptedPassword = crypto
              .createHash("sha1")
              .update(password)
              .digest("hex");
              console.log(encryptedPassword);
            db.collection('users').create({
              username: username,
              password: encryptedPassword,
            }).then(user => {
              return cb(null, user, { message: "Successfully registered!" });
            });
          }
        });
      } catch (err) {
        cb(err, false);
      }
    }
  )
);

passport.use(
  "signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    function(username, password, cb) {
      let encryptedPassword = crypto
        .createHash("sha1")
        .update(password)
        .digest("hex");
      return db.collection('users').findOne({ where: { username } })
        .then(user => {
          if (!user || user.dataValues.password !== encryptedPassword) {
            return cb(null, false, { message: "Incorrect username or password." });
          }
          return cb(null, user, { message: "Logged In Successfully" });
        })
        .catch(err => cb(err, false));
    }
  )
);

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}



// const validPassword = (password) => {
//    db.collection('users').findOne({ username: username }, function(err, user){

//    });
// }
passport.use("llogin", new LocalStrategy(
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

/* GET users listing. */
router.post("/signin", passport.authenticate('login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
router.post("/signup",passport.authenticate('signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
router.post("/signout", users.signout);
router.post("/mypage", users.mypage);

module.exports = router;
