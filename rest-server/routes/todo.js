const passport = require('../helpers/passport');
const jwt = require('jsonwebtoken');
const config = require(`../config/${process.env.NODE_ENV || 'dev'}`);
const TodoList = require('../schemas/todo-list');
const Todo = require('../schemas/todo');

module.exports = function(app) {
  
  // CRUD for todo-list
  
  app.get('/api/todo-list', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      TodoList.find({ userId }, (err, docs) => err ? next(err) : res.json(docs));
    });
  });

  app.post('/api/todo-list', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if(!req.body.title) {
      res.status(400).send('title is required');
      return;
    }

    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      let newTodoList = new TodoList({
        userId,
        title: req.body.title,
        description: req.body.description || ''
      });

      newTodoList.save((err, doc) => err ? next(err) : res.json(doc));
    });
  });

  app.patch('/api/todo-list/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if(!req.body.title && !req.body.description) {
      res.status(400).send('title or description is required');
      return;
    }

    if(!req.params.id) {
      res.status(400).send('todo list id is required');
      return;
    }

    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      TodoList.findOne({ '$and': [{ _id: req.params.id }, { userId }] }, (err, doc) => {
        if(!doc) {
          return res.status(404).send('Not Found');
        }

        doc.title = req.body.title || doc.title;
        doc.description = req.body.description || doc.description;

        doc.save((err, doc) => err ? next(err) : res.json(doc));
      });
    });
  });

  app.delete('/api/todo-list/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      // Remove all todos in this todo list
      Todo.find({ listId: req.params.id }, (err, docs) => {
        let promisesArr = [];

        docs.forEach(doc => {
          let promise = new Promise((resolve, reject) => {
            Todo.findByIdAndRemove(doc._id, (err, todo) => {
              err ? reject(err) : resolve(todo);
            });
          });
          
          promisesArr.push(promise);
        });

        // And then remove todo list 
        Promise.all(promisesArr)
          .then(todos => {
            return new Promise((resolve, reject) => {
              TodoList.findOneAndRemove({ '$and': [{ _id: req.params.id }, { userId }]}, (err, doc) => {
                return err ? reject(err) : resolve(doc);
              });
            });
          })
          .then(doc => doc ? res.json(doc) : res.status(404).send())
          .catch(err => next(err));
      });
    });
  });

  
  // CRUD for todos

  app.get('/api/todo-list/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let token = req.headers.authorization;
    let listId = req.params.id;

    if(!listId) {
      res.status(400).send('todo list id is required');
      return;
    }
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      TodoList.findOne({ '$and': [{ _id: listId }, { userId }] }, (err, doc) => {
        if(err) return next(err);

        let listTitle = doc.title;

        Todo.find({ '$and': [{ listId }, { userId }] }, (err, docs) => {
          if(err) return next(err);

          res.json({ listTitle, todos: docs });
        });
      });
    });
  });

  app.post('/api/todo-list/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if(!req.body.title) {
      res.status(400).send('title is required');
      return;
    }

    if(!req.params.id) {
      res.status(400).send('todo list id is required');
      return;
    }

    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      TodoList.findOne({ '$and': [{ _id: req.params.id }, { userId }] }, (err, doc) => {
        if(err) {
          next(err);
          return;
        }

        if(!doc) {
          return res.status(404).send('Not Found');
        }

        let todo = new Todo({
          userId,
          listId: req.params.id,
          title: req.body.title,
          description: req.body.description || ''
        });

        todo.save((err, doc) => err ? next(err) : res.json(doc));
      });
    });
  });

  app.patch('/api/todo/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if('title' in req.body && !req.body.title) {
      res.status(400).send('title mustn\'t be an empty string');
      return;
    }

    if(req.body.isDone && typeof req.body.isDone !== 'boolean') {
      res.status(400).send('isDone must be boolean');
      return;
    }

    if(!req.params.id) {
      res.status(400).send('todo id is required');
      return;
    }

    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      Todo.findOne({ '$and': [{ _id: req.params.id }, { userId }] }, (err, doc) => {
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

  app.delete('/api/todo/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let token = req.headers.authorization;
    
    jwt.verify(token.slice(4), config.jwtSecret, (err, decoded) => {
      if(err) return next(err);

      let userId = decoded.id;

      Todo.findOne({ '$and': [{ _id: req.params.id }, { userId }] }, (err, doc) => {
        if(!doc) {
          return res.status(404).send('Not Found');
        }

        doc.remove((err, doc) => err ? next(err) : res.json(doc));
      });
    });
  });
}