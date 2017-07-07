const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const config = require('../config');
const passport = require('../helpers/passport');

module.exports = function(app) {
  app.post('/sign-in', (req, res, next) => {
    if(!req.body.name || !req.body.password) {
      res.status(400).send('name and password are required');
      return;
    }

    User.findOne({ name: req.body.name }, (err, user) => {
      if(!user) {
        res.status(401).send('Username or/and password are wrong');
      }
      else if(user.checkPassword(req.body.password)) {
        let payload = {id: user.id};
        let token = jwt.sign(payload, config.jwtSecret);
        res.json({message: "ok", token: token});
      }
      else {
        res.status(401).send('Username or/and password are wrong');
      }
    });
  });

  app.post('/sign-up', (req, res, next) => {
    if(!req.body.name || !req.body.password) {
      res.status(400).send('name and password are required');
      return;
    }

    let user = new User(req.body);

    user.save(user, (err, user) => err ? next(err) : res.json(user));
  });
}