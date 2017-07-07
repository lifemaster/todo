const passport = require('../helpers/passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const TodoGroup = require('../schemas/todo-group');
const Todo = require('../schemas/todo');

module.exports = function(app) {
  
  // CRUD of todo-groups
  
  app.get('/todo-groups', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      TodoGroup.find({ userId }, (err, docs) => err ? return next(err) : res.json(docs);
      });
    });
  });

  app.post('/todo-group', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if(!req.body.title) {
      res.status(400).send('title is required');
      return;
    }

    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      let todoGroup = new TodoGroup({
        userId,
        title: req.body.title,
        description: req.body.description || ''
      });

      todoGroup.save((err, doc) => err ? next(err) : res.json(doc);
      });
    });
  });

  app.patch('/todo-group/:groupId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if(!req.body.title && !req.body.description) {
      res.status(400).send('title or description is required');
      return;
    }

    if(!req.params.groupId) {
      res.status(400).send('group todo id is required');
      return;
    }

    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      TodoGroup.findOne({ '$and': [{ _id: req.params.groupId }, { userId }] }, (err, doc) => {
        if(!doc) {
          return res.status(404).send('Not Found');
        }

        doc.title = req.body.title || doc.title;
        doc.description = req.body.description || doc.description;

        doc.save((err, doc) => err ? next(err) : res.json(doc));
      });
    });
  });

  app.delete('/todo-group/:groupId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      // Remove all todos in this group
      Todo.find({ groupId: req.params.groupId }, (err, docs) => {
        let promisesArr = [];

        docs.forEach(doc => {
          let promise = new Promise((resolve, reject) => {
            Todo.findByIdAndRemove(doc._id, (err, todo) => {
              err ? reject(err) : resolve(todo);
            });
          });
          
          promisesArr.push(promise);
        });

        Promise.all(promisesArr)
          .then(todos => {
            return new Promise((resolve, reject) => {
              TodoGroup.findByIdAndRemove(req.params.groupId, (err, doc) => {
                return err ? reject(err) : resolve(doc);
              });
            });
          })
          .then(todoGroup => {
            res.json(todoGroup);
          })
          .catch(err => next(err));
      });
    });
  });

  
  // CRUD of todos

  app.get('/todo-group/:groupId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let token = req.headers.authorization;
    let groupId = req.params.groupId;

    if(!groupId) {
      res.status(400).send('todo group id is required');
      return;
    }
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      Todo.find({ '$and': [{ groupId }, { userId }] }, (err, docs) => {
        if(err) return next(err);

        docs ? res.json(docs) : res.status(404).send('Not Found');
      });
    });
  });

  app.post('/todo-group/:groupId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if(!req.body.title) {
      res.status(400).send('title is required');
      return;
    }

    if(!req.params.groupId) {
      res.status(400).send('todo group id is required');
      return;
    }

    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      TodoGroup.findOne({ '$and': [{ _id: req.params.groupId }, { userId }] }, (err, doc) => {
        if(err) {
          next(err);
          return;
        }

        if(!doc) {
          return res.status(404).send('Not Found');
        }

        let todo = new Todo({
          userId,
          groupId: req.params.groupId,
          title: req.body.title,
          description: req.body.description || ''
        });

        todo.save((err, doc) => err ? next(err) : res.json(doc));
      });
    });
  });

  app.patch('/todo/:todoId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if(!req.body.title) {
      res.status(400).send('title is required and mustn\'t be an empty string');
      return;
    }

    if(typeof req.body.isDone !== 'boolean') {
      res.status(400).send('isDone is required');
      return;
    }

    if(!req.params.todoId) {
      res.status(400).send('todo id is required');
      return;
    }

    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      Todo.findOne({ '$and': [{ _id: req.params.todoId }, { userId }] }, (err, doc) => {
        if(!doc) {
          return res.status(404).send('Not Found');
        }

        doc.title = req.body.title || doc.title;
        doc.description = req.body.description || doc.description;
        doc.isDone = typeof req.body.isDone === 'boolean' ? req.body.isDone : doc.isDone;

        doc.save((err, doc) => err ? next(err) : res.json(doc));
      });
    });
  });

  app.delete('/todo/:todoId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      Todo.findOne({ '$and': [{ _id: req.params.todoId }, { userId }] }, (err, doc) => {
        if(!doc) {
          return res.status(404).send('Not Found');
        }

        doc.remove((err, doc) => err ? next(err) : res.json(doc));
      });
    });
  });
}