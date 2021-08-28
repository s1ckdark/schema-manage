const express = require('express');
const router = express.Router();
const users = require('../controller/users');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../model/User');
const auth = require('../modules/auth');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn('/users/signin');

router.get('/signin', function(req, res) {res.render('signin', {user: req.user, message: req.flash('error')});});
router.post('/signin', passport.authenticate('local',     {
      failureRedirect: '/users/signin', 
      failureFlash: '로그인 실패, 아이디 또는 비밀번호를 확인해주세요',
      successRedirect: '/', 
      successFlash: '로그인 성공',
      failureFlash : true
    }));
router.get('/signup', function(req, res) {res.render('signup', {}); });
router.post('/signup', passport.authenticate('local', {
	successRedirect : '/', //redirect to the secure profile section
	successFlash: '회원 가입 성공',
	failureFlash: '회원 가입 실패, 아이디 또는 비밀번호를 확인해주세요',
	failureRedirect : '/users/signup', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}))
	// function(req, res, next) {
 //  console.log('registering user');
 //  User.register(new User({email: req.body.email}), req.body.password, function(err) {
 //    if (err) {
 //      console.log('error while user register!', err);
 //      return next(err);
 //    }
 //    res.redirect('/');
 //  });
// });
router.get("/mypage", connectEnsureLogin, function(req, res, next) {res.render("/mypage", { title: "마이페이지"});});
router.get("/signout", users.signout);
router.post("/mypage", connectEnsureLogin, users.mypage);

module.exports = router;
