const express = require('express');
const router = express.Router();
const users = require('../controller/users');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../models/User');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn('/users/signin');
const auth = require('../modules/auth');
const path = require('path');

router.get('/', function(req, res, next) {
	res.render('home',{currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/schmanager',function(req, res, next) {
// router.get('/schmanager', connectEnsureLogin, function(req, res, next) {
	res.render("schmanager", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
// router.get('/schregister', connectEnsureLogin, function(req, res, next) {
router.get('/schregister',  function(req, res, next) {
	res.render("schregister", { currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
// router.get('/analyzer', connectEnsureLogin, function(req, res, next) {
router.get('/analyzer', function(req, res, next) {
	res.render("analyzer", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/report', connectEnsureLogin, function(req, res, next) {
	res.render("report", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.get('/download/:file', function(req, res){
	let file= req.params.file, filelocation = path.join('./public/temp', file);
	console.log(filelocation);
	res.download(filelocation, file, function(err){
    	if(err){
        	res.json({err:err});
        } else{
        	res.send({success:true})
        }}
        )}); 

module.exports = router;
