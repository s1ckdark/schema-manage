const express = require('express');
const router = express.Router();
const users = require('../controller/users');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../model/User');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn('/users/signin');
const auth = require('../modules/auth');

router.get('/', function(req, res, next) {res.render('home', {title: '홈', user: req.user});});
router.get('/manager', connectEnsureLogin, function(req, res, next) {res.render('manager', { title: '스키마 관리' });});
router.get('/register', connectEnsureLogin, function(req, res, next) {res.render('register', { title: '스키마 관리' });});
router.get('/analyzer', connectEnsureLogin, function(req, res, next) {res.render('analyzer', { title: '다양성 검사' });});
router.get('/result', connectEnsureLogin, function(req, res, next) {res.render('result', { title: '정확성 검사' });});
router.get('/report', connectEnsureLogin, function(req, res, next) {res.render('report', { title: '레포트 출력' });});
router.get('/download/:file', connectEnsureLogin, function(req, res){const file = `./public/temp/${req.params.file}.csv`; res.download(file); }); 

module.exports = router;
