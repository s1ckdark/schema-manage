const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const User = db.collection('users');

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, username, password, cb) => {
      try {
        Users.findOne({ where: { username } }).then(user => {
          if (user) {
            return cb(null, false, { message: "Already registered!" });
          } else {
            let encryptedPassword = crypto
              .createHash("sha1")
              .update(password)
              .digest("hex");
            Users.create({
              name: req.body.name,
              username: username,
              password: encryptedPassword,
              provider: "local"
            }).then(user => {
              return cb(null, user, { message: "Successfully registered!" });
            });
          }
        });
      } catch (err) {
        cb(err, false);
      }
    }
  )
);

passport.use(
  "local_login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    function(username, password, cb) {
      let encryptedPassword = crypto
        .createHash("sha1")
        .update(password)
        .digest("hex");
      return Users.findOne({ where: { username } })
        .then(user => {
          console.log(user);
          if (!user || user.dataValues.password !== encryptedPassword) {
            return cb(null, false, { message: "Incorrect username or password." });
          }
          return cb(null, user, { message: "Logged In Successfully" });
        })
        .catch(err => cb(err, false));
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
  function(username, password, done) {
    db.collection('users').findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { status:401,message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { status:401,message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

