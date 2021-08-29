const express = require('express');
const router = express.Router();
const users = require('../controller/users');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../models/User');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn('/users/signin');
const nodemailer = require('nodemailer');
const Token = require("../models/token");
const sendEmail = require("../modules/sendEmail");
const crypto = require("crypto");


router.get('/signin', function(req, res) {
  console.log(req.session);
  if(req.session.flash) {
    res.locals.message = req.session.flash.error
  } 
	res.render('signin', {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});

router.post('/signin', passport.authenticate('local', {
      failureRedirect: '/users/signin', 
      failureFlash: '로그인 실패, 아이디 또는 비밀번호를 확인해주세요',
      successRedirect: '/', 
      successFlash: '로그인 성공',
      failureFlash : true
    }));
router.get('/signup', function(req, res) {	
	res.render('signup',{currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});
router.post('/signup', function(req, res, next) {
  User.register(new User({email: req.body.email}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }
    res.redirect('/');
  });
});

router.get("/profile", connectEnsureLogin, function(req, res, next) {
	res.render("profile", {currentUser:res.locals.currentUser,isLogged:res.locals.isLogged});
});

router.get('/signout', function (req, res){
  req.session.destroy(function (err) {
    res.app.locals = {
      user:req.user,
      isLogged: true,
      session:req.session
    }
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});

router.get('/reset', function(req, res) {
  if(req.session.flash) res.locals.message = req.session.flash.message;
  var resetValue = false
  res.render('reset',{reset:resetValue})
});

router.post('/reset', async(req, res) => {
  try {
    var json = req.body.email;
    const user = await User.findOne({ email: req.body.email });
    if (!user) { req.flash("message","user with given email doesn't exist");res.redirect(400,'/users/reset');}
    
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
        token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
    }

    const link = `http://127.0.0.1:8080/users/reset/${user._id}/${token.token}`;
    // await sendEmail(user.email, "Password reset", link);
    req.flash("message",link);
    res.redirect('/users/reset');
    // res.send("password reset link sent to your email account");
  } catch (error) {
    req.flash("message",error);
    res.redirect('/users/reset');
  }
})
 
router.get("/reset/:userId/:token", async (req, res) => {
        var user_token = req.params.token;
        var user_id = req.params.userId;
        var resetValue= false;
        if( user_token && user_id) resetValue = true
        res.render('reset',{userId:user_id,token:user_token,reset:resetValue})
});

router.post("/reset/:userId/:token", async (req, res) => {
  console.log(req.body);
    var url = 'http://'+req.host + '/users' + req.url;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {req.flash("message","Invalid link or expired");res.redirect(400, url);}
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) {req.flash("message","Invalid link or expired");res.redirect(400, url);}
        if(req.body.password != req.body.password2) {req.flash("message","Password Not Matched");res.redirect(400, url);}
        
        user.password = req.body.password;
        console.log(user);
        await User.findById(user._id, function(err, user) {
           user.setPassword(req.body.password, function(err) {
                if (err) console.log(err);
              user.save(function(err) {
                  if (err) console.log(err)
                  else console.log("success");
              });
          });
      });
        await user.save();
        await token.delete();

        req.flash("message","password reset sucessfully.");
        res.redirect('/');
    } catch (error) {
       req.flash("message",error);
    }
});


// router.post('/reset', function(req, res){
//     var email = req.body.email; // you had the user enter their email
//     User.findByEmail(email, function(err, user){
//         user.token = new Token(); // some library to create a token
//         res.redirect('/users/forgot/'+user.token);
//         // mail(user.email, 'Please visit http://example.com/reset/' + user.token); 
//     });
// });

// router.get('/reset/:token', function(req,res){
//   var token = req.params.token;
//   console.log(token);
//   res.render("reset")  
// })

// router.post('/reset/:token', function(req, res){
//     var token = req.params.token;
//     var password = req.body.password; // you had the user enter a new password
//     User.findByToken(token, function(err, user){
//         user.hash = new HashFromPassword(password); // some function to create hash from password;
//         console.log(user.hash);
//     });
//     res.send(token);
// });
 
module.exports = router;
