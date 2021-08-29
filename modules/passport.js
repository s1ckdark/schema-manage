const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../model/User');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;