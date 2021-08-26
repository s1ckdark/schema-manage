var express = require('express');
var router = express.Router();
var fs = require('fs');
const { isLoggedIn } = require("../middleware/auth");
const api = require('../controller/api');

/* GET home page. */
// router.get('/', isLoggedIn, function(req, res, next) {res.render('home', { title: '홈'});});
// router.get('/signin', isLoggedIn, function(req, res, next) {res.render('signin', { title: '로그인'});});
// router.get('/manager', isLoggedIn, function(req, res, next) {res.render('manager', { title: '스키마 관리' });});
// router.get('/register', isLoggedIn, function(req, res, next) {res.render('register', { title: '스키마 관리' });});
// router.get('/analyzer', isLoggedIn, function(req, res, next) {res.render('analyzer', { title: '다양성 검사' });});
// router.get('/result', isLoggedIn, function(req, res, next) {res.render('result', { title: '정확성 검사' });});
// router.get('/report', isLoggedIn, function(req, res, next) {res.render('report', { title: '레포트 출력' });});

router.get('/', function(req, res, next) {res.render('home', { title: '홈'});});
router.get('/signin', function(req, res, next) {res.render('signin', { title: '로그인'});});
router.get('/manager', function(req, res, next) {res.render('manager', { title: '스키마 관리' });});
router.get('/register', function(req, res, next) {res.render('register', { title: '스키마 관리' });});
router.get('/analyzer', function(req, res, next) {res.render('analyzer', { title: '다양성 검사' });});
router.get('/result', function(req, res, next) {res.render('result', { title: '정확성 검사' });});
router.get('/report', function(req, res, next) {res.render('report', { title: '레포트 출력' });});
router.get('/download/:file', function(req, res){
	const file = `./public/temp/${req.params.file}.csv`;
	console.log(file);
    res.download(file); 
});

module.exports = router;
