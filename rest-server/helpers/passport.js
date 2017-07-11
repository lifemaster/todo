const User = require('../schemas/user');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const config = require(`../config/${process.env.NODE_ENV || 'dev'}`);

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = config.jwtSecret;

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  
  // console.log('payload received', jwt_payload);
  
  let user = User.findById(jwt_payload.id).exec((err, user) => {
    if(user) {
      next(null, user);
    }
    else {
      next(null, false);
    }
  });
});

passport.use(strategy);

module.exports = passport;