const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const users = {
    signin: async(req, res, next) => {
      res.status(200).json({message:"Success Login!",success: true, status:200});
      //   await passport.authenticate(
      //   "local_login",
      //   { session: false },
      //   (err, user, info) => {
      //     if (err) {
      //       return res.status(400);
      //     }
      //     if (!user) {
      //       return res.status(200).json({
      //         message: "로그인에 실패했습니다.",
      //         success: false
      //       });
      //     }
      //     req.login(user, { session: false }, err => {
      //       if (err) {
      //         res.send(err);
      //       }
      //       const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET);
      //       return res.status(200).json({ userToken: token, success: true, message:'logged in!',status:200});
      //     });
      //   }
      // )(req, res, next)
    },
    signup: async(req, res) => {
        var user = new odm.User({username: req.body.username, password: req.body.password});
        user.save(function(err, user){
            if(err){
                console.log('registration err: ' , err);
            } else {
                res.redirect('/');
            }
        })
    },
    mypage: async(req,res) => {
        res.send("test");
    },
    signout: async(req, res) => {
         req.logout();
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
    }
}

module.exports = users;

