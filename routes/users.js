const express = require('express');
const router = express.Router();
const users = require('../controller/users');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../model/User');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn('/users/signin');

router.get('/signin', function(req, res) {
  res.locals.title="로그인";
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
  res.locals.title="회원가입";
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
  res.locals.title="프로필";
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
// router.get('/forgot', (req, res, next) => {
//   res.setHeader('Content-type', 'text/html');
//   res.end(templates.layout(`
//     ${templates.error(req.flash())}
//     ${templates.forgotPassword()}
//   `));
// });

// router.post('/forgot', async (req, res, next) => {
//   const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
//   const user = users.find(u => u.email === req.body.email);

//   if (!user) {
//     req.flash('error', 'No account with that email address exists.');
//     return res.redirect('/forgot');
//   }

//   user.resetPasswordToken = token;
//   user.resetPasswordExpires = Date.now() + 3600000;

//   const resetEmail = {
//     to: user.email,
//     from: 'passwordreset@example.com',
//     subject: 'Node.js Password Reset',
//     text: `
//       You are receiving this because you (or someone else) have requested the reset of the password for your account.
//       Please click on the following link, or paste this into your browser to complete the process:
//       http://${req.headers.host}/reset/${token}
//       If you did not request this, please ignore this email and your password will remain unchanged.
//     `,
//   };

//   await transport.sendMail(resetEmail);
//   req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`);

//   res.redirect('/forgot');
// });

// router.post('/reset', async function(req, res, next) {
//     try {
//         var resetPasswordToken = req.body.resetPasswordToken;
//         var username = req.body.username;
//         var password = req.body.password;
//         var user = await User.findOneAndUpdate({
//             username,
//             resetPasswordToken, 
//             resetPasswordExpires: {$gt: Date.now()},
//         }, {
//             resetPasswordToken: undefined,
//             resetPasswordExpires: undefined,
//         });
//         user.setPassword(password, (error, user) => {
//             if (error) {
//                 return next(error);
//             }
//             user.save((err, user) => {
//                 if (error) {
//                     return next(error);
//                 }
//                 passport.authenticate('local', function(error, user, info) {
//                     console.log("error", error);
//                     console.log("user", user);
//                     console.log("info", info);
//                     if (error) {
//                         return next(error);
//                     }
//                     if (!user) {
//                         return handleError(res, "There was a problem resetting your password.  Please try again.", {error_code: 401, error_message: "There was a problem resetting your password.  Please try again."}, 401);
//                     }
//                     req.logIn(user, function(error) {
//                         if (error) {
//                             return next(error);
//                         }
//                         return res.redirect('/admin/#/');
//                     });
//                 })(req, res, next);
//             });
//         });
//     } catch(error) {
//         console.error(error);
//         handleError(res, error.message, "/reset");
//     }
// });
module.exports = router;
