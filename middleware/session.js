



module.exports.send = (req, res, next) => {
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  return (req, res, )
  next();

  return uploadMem.single('file')(req, res, () => {
    if (!req.file) return res.json({ error: "invalidFiletype" })
    next()
  })
}
