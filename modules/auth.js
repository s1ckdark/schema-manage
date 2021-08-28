const passport = require('../modules/passport');
const User = require("../model/User");

const signin = async (req, res) => {
  req.flash("test","reqflash");
    await passport.authenticate('local', 
    {
      failureRedirect: '/users/signin', 
      failureFlash: '로그인 실패, 아이디 또는 비밀번호를 확인해주세요',
      successRedirect: '/', 
      successFlash: '로그인 성공',
      failureFlash : true
    })
    // {
    //     failureRedirect: "/login",
    //     failureFlash: true
    // }),
    // (req,res) => {
    //    req.flash("success", "Welcome back!");
    //    res.redirect("/home");
    // }
  //     (err, user, info) =>{
  //     console.log(err, user, info);
  //   if (err) {
  //     console.error(err);
  //     return next(err);
  //   }
  //   if (info) {
  //     return res.status(401).send(info.reason);
  //   }
  //   return req.login(user, loginErr => {
  //     if (loginErr) {
  //       return next(loginErr);
  //     }
  //     const fillteredUser = { ...user.dataValues };
  //     console.dir("filtered",fillteredUser);
  //     delete fillteredUser.password;
  //     return res.json(fillteredUser);
  //   });
  // })(req, res, next);
}

const signup = async (req, res, next) => {
  const { email, password, password2 } = req.body;
  if (password !== password2) {
    res.status(400).json({success:false, message:"비밀번호가 일치하지 않습니다."})
  } else {
    try {
      const user = await User({ email });
      await User.register(user, password);
      next();
    } catch (error) {
      res.status(400).json({success:false,message:error.message})
    }
  }
}

const current = async(req, res) => {
  await passport.authenticate('local', { session: false}), (req, res) => {
    res.json({
        email: req.user.email
    });
  }
}

module.exports = {signin, signup, current}
