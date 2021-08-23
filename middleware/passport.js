const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// mongodb
const { mongodb } = require('mongodb');
const dbConfig = require('../db.config.js');


MongoClient.connect(uri).then((client) => {
  db = client.db(dbConfig.DB);
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});


passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("Verification function called");
    db.collection('user').findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      passport.serializeUser((user, done) => {
        console.log("serializ");
        done(null, user.username);
      });
      return done(null, user);
    });
  }
));

module.exports.send = (req, res, next) => {
  return uploadMem.single('file')(req, res, () => {
    // Remember, the middleware will call it's next function
    // so we can inject our controller manually as the next()

    if (!req.file) return res.json({ error: "invalidFiletype" })
    next()
  })
}
