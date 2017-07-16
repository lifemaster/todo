import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import SignOut from './SignOut';
import TodoListElement from './TodoListElement';
import Form from './Form';

class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.state = {
      todoList: []
    };
  }

  componentDidMount() {
    let self = this;

    fetch('http://localhost:1234/todo-list', {
      headers: {
        'Authorization': `JWT ${window.getCookie('token')}`
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

    fetch('http://localhost:1234/todo-list', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${window.getCookie('token')}`
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

  handleRemove(todoListId) {
    let self = this;

    if(!window.confirm('Все задачи с этой группы будут безвозвратно удалены. Вы хотите продолжить?')) {
      return;
    }

    fetch(`http://localhost:1234/todo-list/${todoListId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${window.getCookie('token')}`
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