'use strict';
const passport   = require('./helpers/passport');
const express    = require('express');
const bodyParser = require('body-parser');
const config     = require(`./config/${process.env.NODE_ENV || 'dev'}`);

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  req.originalUrl.match(/^\/api/) ? next() : res.redirect('/');
});

app.use((req, res, next) => {
  let origin = req.headers.origin;

  if(origin && process.env.NODE_ENV !== 'prod') {
    let allowedOrigins = config.allowedOrigins;

    if(allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);

      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  }
  
  return next();
});

require('./routes')(app);

app.listen(config.port, function() {
  console.log(`Server is running on port ${config.port}`);
});

module.exports = app;