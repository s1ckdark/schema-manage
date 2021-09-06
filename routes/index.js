const express = require('express');
const router = express.Router();
const users = require('../controller/users');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../models/User');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn('/users/signin');
const auth = require('../modules/auth');

router.get('/', function(req, res, next) {
	res.render('home',{currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/schmanager', connectEnsureLogin, function(req, res, next) {
	res.render("schmanager", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/schregister', connectEnsureLogin, function(req, res, next) {
	res.render("schregister", { currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/analyzer', connectEnsureLogin, function(req, res, next) {
	res.render("analyzer", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/result', connectEnsureLogin, function(req, res, next) {
	res.render("result", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/report', connectEnsureLogin, function(req, res, next) {
	res.render("report", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/download/:file', connectEnsureLogin, function(req, res){const file = `./public/temp/${req.params.file}.csv`; res.download(file); }); 

module.exports = router;
