const passport = require("passport");

exports.isLoggedIn = (req, res, next) => {
  // passport.authenticate("local", { session: false }, (err, user) => {
  //   if (user) {
  //     req.user = user;
  //     next();
  //   } else {
  //     res.status(403).send("로그인 필요");
  //   }
  // })(req, res, next);
};