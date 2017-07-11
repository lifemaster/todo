process.env.NODE_ENV = 'test';

const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require('../schemas/user');
const TodoList = require('../schemas/todo-list');
const Todo = require('../schemas/todo');

chai.should();
chai.use(chaiHttp);

describe('Todo abilities:', () =>  {

  let user1Id,
      user2Id,
      user1Token,
      user2Token,
      user1TodoListId,
      user2TodoListId,
      user1TodoId,
      user2TodoId;

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
      .then((userIds) => {
        user1Id = userIds[0];
        user2Id = userIds[1];

        Promise.all([
          signIn('user1', 'password1'),
          signIn('user2', 'password2')
        ])
        .then(tokensArr => {
          user1Token = tokensArr[0];
          user2Token = tokensArr[1];

          Promise.all([
            createTodoList('First user\'s todo list', 'First user\'s todo description', user1Token),
            createTodoList('Second user\'s todo list', 'Second user\'s todo description', user2Token),
          ])
          .then((todoListIds) => {
            user1TodoListId = todoListIds[0],
            user2TodoListId = todoListIds[1];
            done();
          })
          .catch(done);
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
      }),
      new Promise((resolve, reject) => {
        Todo.remove({}, err => err ? reject(err) : resolve());
      })
    ])
    .then(() => done())
    .catch(done);
  });

  // Authorized user and his own todo list

  it('authorized user shouldn\'t create todo to his own todo list without title and userId', done => {
    chai.request(server)
      .post(`/todo-list/${user1TodoListId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user1Token}`)
      .send({ description: 'First user\'s todo description without title' })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('authorized user should create todo to his own todo list', done => {
    chai.request(server)
      .post(`/todo-list/${user1TodoListId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user1Token}`)
      .send({
        userId: user1Id,
        title: 'First user\'s todo title',
        description: 'First user\'s todo description'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        user1TodoId = res.body._id;
        done();
      });
  });

  it('authorized user should edit title and description of todo in his own todo list', done => {
    chai.request(server)
      .patch(`/todo/${user1TodoId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user1Token}`)
      .send({
        title: 'Edited first user\'s todo title',
        description: 'Edited first user\'s todo description'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it('authorized user should remove todo from his own todo list', done => {
    chai.request(server)
      .delete(`/todo/${user1TodoId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user1Token}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  // Authorized user & not own todo list

  it('authorized user shouldn\'t create todo to not own todo list', done => {
    chai.request(server)
      .post(`/todo-list/${user1TodoListId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user2Token}`)
      .send({
        userId: user2Id,
        title: 'title',
        description: 'description'
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('authorized user shouldn\'t edit todo from not own todo list', done => {
    chai.request(server)
      .post(`/todo-list/${user2TodoListId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user2Token}`)
      .send({
        userId: user2Id,
        title: 'title',
        description: 'description'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        user2TodoId = res.body._id;

        chai.request(server)
        .patch(`/todo/${user2TodoId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${user1Token}`)
        .send({
          title: 'another title',
          description: 'another description'
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
      });
  });

  it('authorized user shouldn\'t remove todo from not own todo list', done => {
    chai.request(server)
      .delete(`/todo/${user2TodoId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${user1Token}`)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  // Unauthorized user

  it('unauthorized user shouldn\'t create todo', done => {
    chai.request(server)
      .post(`/todo-list/${user2TodoListId}`)
      .set('Content-Type', 'application/json')
      .send({ title: 'Some title', description: 'Some description' })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('unauthorized user shouldn\'t edit todo', done => {
    chai.request(server)
      .patch(`/todo/${user2TodoId}`)
      .set('Content-Type', 'application/json')
      .send({ title: 'Another title', description: 'Another description' })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('unauthorized user shouldn\'t remove todo', done => {
    chai.request(server)
      .delete(`/todo/${user2TodoId}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        res.should.have.status(401);
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

      err ? reject(err) : resolve(res.body._id);
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

function createTodoList(title, description, token) {
  return new Promise((resolve, reject) => {
    chai.request(server)
    .post('/todo-list')
    .set('Content-Type', 'application/json')
    .set('Authorization', `JWT ${token}`)
    .send({ title, description })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body._id.should.be.a('string');

      err ? reject(err) : resolve(res.body._id);
    });
  });
}