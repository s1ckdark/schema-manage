const express = require('express');
const router = express.Router();
const users = require('../controller/users');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../model/User');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn('/users/signin');
const auth = require('../modules/auth');

router.get('/', function(req, res, next) {
	res.locals.title="홈";
	res.render('home',{currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/schmanager', connectEnsureLogin, function(req, res, next) {
	res.locals.title="스키마 조회";
	res.render("schmanager", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/schregister', connectEnsureLogin, function(req, res, next) {
	res.locals.title="스키마 등록";
	res.render("schregister", { currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/analyzer', connectEnsureLogin, function(req, res, next) {
	res.locals.title="다양성 분석";
	res.render("analyzer", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/result', connectEnsureLogin, function(req, res, next) {
	res.locals.title="정확성 검사";
	res.render("result", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/report', connectEnsureLogin, function(req, res, next) {
	res.locals.title="리포트 출력";
	res.render("report", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/download/:file', connectEnsureLogin, function(req, res){const file = `./public/temp/${req.params.file}.csv`; res.download(file); }); 

module.exports = router;
