'use strict';
const passport   = require('./helpers/passport');
const express    = require('express');
const bodyParser = require('body-parser');
const config     = require(`./config/${process.env.NODE_ENV || 'dev'}`);

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());

app.use((req, res, next) => {
  let origin = req.headers.origin;
  let allowedOrigins = ['http://localhost:3000'];

  if(allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH', 'DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return next();
});

require('./routes')(app);

app.listen(config.port, function() {
  console.log(`Server running on port ${config.port}`);
});

module.exports = app;