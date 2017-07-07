module.exports = function(app) {
  require('./user')(app);
  require('./todo')(app);
}