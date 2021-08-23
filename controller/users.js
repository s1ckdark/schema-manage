const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const users = {
    signin: async(req, res) => {
        res.status(200).json({message:'logged in!'});
    },
    signup: async(req, res) => {
        passport.authenticate('signup', { session: false }),
         async (req, res, next) => {
            res.json({
              message: 'Signup successful',
              user: req.user
            });
          }
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

