const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../model/User');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.serializeUser(function(user, done) {
//   console.log("serializeUser",user);
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   console.log("deserializeUser",id);
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

module.exports = passport;