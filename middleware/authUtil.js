//authutil
const auth = "not yet";
module.exports.send = (req, res, next) => {
  res.render('schedule', {
    title: 'Schedule A Meeting'
  });
}