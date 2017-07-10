process.env.NODE_ENV = 'test';

const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require('../schemas/user');

chai.should();
chai.use(chaiHttp);

describe('Sign up abilities', () =>  {

  before(done => {
    User.remove({}, err => done(err));
  });

  after(done => {
    User.remove({}, err => done(err));
  });

  it('Any user should sign up to application', done => {
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

  it('User should have unique name', done => {
    chai.request(server)
    .post('/sign-up')
    .set('Content-Type', 'application/json')
    .send({ name: 'name', password: 'password' })
    .end((err, res) => {
      res.should.have.status(400);
      res.text.should.be.a('string');
      done();
    });
  });

  it('User shouldn\'t have numeric username', done => {
    chai.request(server)
    .post('/sign-up')
    .set('Content-Type', 'application/json')
    .send({ name: 12345, password: 'password' })
    .end((err, res) => {
      res.should.have.status(400);
      res.text.should.be.a('string');
      done();
    });
  });

  it('User shouldn\'t have numeric password', done => {
    chai.request(server)
    .post('/sign-up')
    .set('Content-Type', 'application/json')
    .send({ name: 'somename', password: 12345 })
    .end((err, res) => {
      res.should.have.status(400);
      res.text.should.be.a('string');
      done();
    });
  });
});