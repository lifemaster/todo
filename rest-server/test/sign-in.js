process.env.NODE_ENV = 'test';

const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require('../schemas/user');

chai.should();
chai.use(chaiHttp);

describe('Sign up abilities', () =>  {

  before(done => {
    User.remove({}, err => {
      chai.request(server)
      .post('/sign-up')
      .set('Content-Type', 'application/json')
      .send({ name: 'name', password: 'password' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
    });
  });

  after(done => {
    User.remove({}, err => done(err));
  });

  it('Registered user should sign in to application and get token', done => {
    chai.request(server)
    .post('/sign-in')
    .set('Content-Type', 'application/json')
    .send({ name: 'name', password: 'password' })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.token.should.be.a('string');
      done();
    });
  });
});