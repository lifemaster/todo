import React from 'react';
import PropTypes from 'prop-types';

import cookie from '../cookie';
import config from '../config';

import Header from './Header';
import SignOut from './SignOut';
import TodoListElement from './TodoListElement';
import Form from './Form';

class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.state = {
      todoList: []
    };
  }

  componentDidMount() {
    let self = this;

    fetch(`${config.serverURI}/todo-list`, {
      headers: {
        'Authorization': `JWT ${cookie.get(config.authCookieName)}`
      },
      method: 'GET'
    })
    .then(response => {
      if(response.status === 200) {
        return response.json();
      }
      else {
        console.log(response);
      }
    })
    .then(data => {      
      self.setState({ todoList: data });
    })
    .catch(err => console.log(err));
  }
  
  handleAdd(title) {
    let self = this;

    fetch(`${config.serverURI}/todo-list`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${cookie.get(config.authCookieName)}`
      },
      method: 'POST',
      body: JSON.stringify({ title })
    })
    .then(response => {
      if(response.status === 200) {
        return response.json();
      }
      else {
        console.log(response);
      }
    })
    .then(data => {
      let todoList = self.state.todoList;
      todoList.push(data);
      
      self.setState({ todoList });
    })
    .catch(err => console.log(err));
  }

  handleEdit(params, callback) {
    if(!params.title) {
      return callback();
    }

    let self = this;

    fetch(`${config.serverURI}/todo-list/${params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${cookie.get(config.authCookieName)}`
      },
      method: 'PATCH',
      body: JSON.stringify({title: params.title})
    })
    .then(response => {
      if(response.status === 200) {
        return response.json();
      }
      else {
        console.log(response);
      }
    })
    .then(data => {
      let todoList = self.state.todoList;
      let index = todoList.findIndex(todoListItem => todoListItem._id === params.id);

      todoList[index] = data;
      
      self.setState({ todoList });

      if(typeof callback === 'function') callback();
    })
    .catch(err => console.log(err));
  }

  handleRemove(todoListId) {
    let self = this;

    if(!window.confirm('Все задачи с этой группы будут безвозвратно удалены. Вы хотите продолжить?')) {
      return;
    }

    fetch(`${config.serverURI}/todo-list/${todoListId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${cookie.get(config.authCookieName)}`
      },
      method: 'DELETE'
    })
    .then(response => {
      if(response.status === 200) {
        let todoList = self.state.todoList;
        todoList = todoList.filter(todoListItem => {
          return todoListItem._id !== todoListId;
        });
        
        self.setState({ todoList });
      }
      else {
        console.log(response);
      }
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <main>
        <Header
          title="Todo list"
          element={<SignOut onSignOut={this.props.onSignOut}/>}
        />
        
        <section className="todo-list">
          {
            this.state.todoList.map(todoListItem => {
              return (
                <TodoListElement
                  id={todoListItem._id}
                  title={todoListItem.title}
                  key={todoListItem._id}
                  onEdit={this.handleEdit}
                  onRemove={this.handleRemove}
                />
              )
            })
          }
        </section>

        <Form onAdd={this.handleAdd}/>
      </main>
    );
  }
}

TodoList.propTypes = {
  onSignOut: PropTypes.func.isRequired,
  onSelectTodoList: PropTypes.func
};

export default TodoList;