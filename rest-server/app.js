'use strict';
const passport   = require('./helpers/passport');
const express    = require('express');
const bodyParser = require('body-parser');
const config     = require('./helpers/constants').settings(process.env.NODE_ENV || 'dev');

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());

if(process.env.NODE_ENV === 'prod') {
  app.all('*', (req, res, next) => {
    if(req.secure) {
      return next();
    }
    res.redirect('https://' + req.hostname + req.url);
  });
}

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

if(process.env.NODE_ENV === 'prod') {
  const http = require('http');
  const https = require('https');

  http.createServer(app).listen(config.httpPort, () => {
    console.log(`HTTP server is running on port ${config.httpPort}`);
  });

  https.createServer(config.cert, app).listen(config.httpsPort, null, () => {
    console.log(`HTTPS server is running on port ${config.httpsPort}`);
  });
}
else {
  app.listen(config.httpPort, function() {
    console.log(`Server is running on port ${config.httpPort}`);
  });
}

module.exports = app;