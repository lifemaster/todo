const fs = require('fs');

module.exports.settings = function(environment) {
  switch (environment) {
    case 'prod':
      return {
        httpPort: 80,
        httpsPort: 443,
        cert: {
          key: fs.readFileSync(`${__dirname}/../ssl/key.pem`),
          cert: fs.readFileSync(`${__dirname}/../ssl/cert.pem`)
        },
        dbURI: 'mongodb://127.0.0.1/todo',
        jwtSecret: 'secret'
      };
    case 'dev':
      return {
        httpPort: 1234,
        dbURI: 'mongodb://127.0.0.1/todo-dev',
        jwtSecret: 'secret',
        allowedOrigins: [ 'http://localhost:3000' ]
      };
    case 'test':
      return {
        httpPort: 1234,
        dbURI: 'mongodb://127.0.0.1/todo-test',
        jwtSecret: 'secret'
      };
  }
};