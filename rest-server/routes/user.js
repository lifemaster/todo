const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const config = require(`../config/${process.env.NODE_ENV || 'dev'}`);
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

    if(typeof req.body.name !== 'string' || typeof req.body.password !== 'string') {
      res.status(400).send('name and password must be a string');
      return;
    }

    User.findOne({ name: req.body.name }, (err, user) => {
      if(user) {
        res.status(400).send('Username already exists');
      }
      else {
        let user = new User(req.body);
        user.save(user, (err, user) => {
          if(err) {
            next(err);
            return;
          }

          let payload = {id: user.id};
          let token = jwt.sign(payload, config.jwtSecret);
          
          res.json({message: "ok", token: token});
        });
      }
    });
  });
}