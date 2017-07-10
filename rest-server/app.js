'use strict';
const passport   = require('./helpers/passport');
const express    = require('express');
const bodyParser = require('body-parser');
const config     = require(`./config/${process.env.NODE_ENV || 'dev'}`);

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());

require('./routes')(app);

app.listen(config.port, function() {
  console.log(`Server running on port ${config.port}`);
});

module.exports = app;