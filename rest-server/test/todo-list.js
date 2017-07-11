process.env.NODE_ENV = 'test';

const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require('../schemas/user');
const TodoList = require('../schemas/todo-list');

chai.should();
chai.use(chaiHttp);

describe('Todo-list abilities:', () =>  {

  let user1Token,
      user2Token,
      user1TodoListId,
      user2TodoListId;

  before(done => {
    User.remove({}, err => {
      if(err) {
        done(err);
        return;
      }

      Promise.all([
        signUp('user1', 'password1'),
        signUp('user2', 'password2')
      ])
      .then(() => {
        Promise.all([
          signIn('user1', 'password1'),
          signIn('user2', 'password2')
        ])
        .then(tokensArr => {
          user1Token = tokensArr[0];
          user2Token = tokensArr[1];
          done();
        })
        .catch(done);
      })
      .catch(done);
    });
  });

  after(done => {
    Promise.all([
      new Promise((resolve, reject) => {
        User.remove({}, err => err ? reject(err) : resolve());
      }),
      new Promise((resolve, reject) => {
        TodoList.remove({}, err => err ? reject(err) : resolve());
      })
    ])
    .then(() => done())
    .catch(done);
  });

  it('unauthorized user shouldn\'t create todo list', done => {
    chai.request(server)
      .post('/todo-list')
      .set('Content-Type', 'application/json')
      .send({ title: 'First user\'s todo list title', description: 'First user\'s todo list description' })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('unauthorized user shouldn\'t remove todo list', done => {
    chai.request(server)
      .delete(`/todo-list/${user1TodoListId}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('authorized user should create todo list', done => {
    chai.request(server)
      .post('/todo-list')
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user1Token}`)
      .send({ title: 'First user\'s todo list title', description: 'First user\'s todo list description' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        user1TodoListId = res.body._id;
        done();
      });
  });

  it('authorized user shouldn\'t create todo list without title', done => {
    chai.request(server)
      .post('/todo-list')
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user1Token}`)
      .send({ description: 'First user\'s todo list description without title' })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('authorized user should edit his own todo list', done => {
    chai.request(server)
      .patch(`/todo-list/${user1TodoListId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user1Token}`)
      .send({ title: 'Another title', description: 'Another description' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it('authorized user shouldn\'t edit not own todo list', done => {
    chai.request(server)
      .post('/todo-list')
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user2Token}`)
      .send({ title: 'Second user\'s todo list title', description: 'Second user\'s todo list description' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        user2TodoListId = res.body._id;

        chai.request(server)
        .patch(`/todo-list/${user2TodoListId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${user1Token}`)
        .send({ title: 'Another title', description: 'Another description' })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
      });
  });

  it('authorized user shouldn\'t remove not own todo list', done => {
    chai.request(server)
      .delete(`/todo-list/${user1TodoListId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user2Token}`)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('authorized user should remove own todo list', done => {
    chai.request(server)
      .delete(`/todo-list/${user1TodoListId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user1Token}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

function signUp(name, password) {
  return new Promise((resolve, reject) => {
    chai.request(server)
    .post('/sign-up')
    .set('Content-Type', 'application/json')
    .send({ name, password })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');

      err ? reject(err) : resolve();
    });
  });
}

function signIn(name, password) {
  return new Promise((resolve, reject) => {
    chai.request(server)
    .post('/sign-in')
    .set('Content-Type', 'application/json')
    .send({ name, password })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.token.should.be.a('string');

      err ? reject(err) : resolve(res.body.token);
    });
  });
}