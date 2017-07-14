import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Button from './Button';
import TodoElement from './TodoElement';
import Form from './Form';

class Todo extends React.Component {
  constructor() {
    super();

    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.state = {
      todos: []
    };
  }

  componentWillMount() {
    let self = this;

    fetch(`http://localhost:1234/todo-list/${this.props.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${window.getCookie('token')}`
      }
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
      self.setState({
        todos: data
      });
    })
    .catch(err => console.log(err));
  }

  handleAdd(title) {
    let self = this;

    fetch(`http://localhost:1234/todo-list/${self.props.id}`, {
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
      let todos = self.state.todos;
      todos.push(data);
      
      self.setState({ todos });
    })
    .catch(err => console.log(err));
  }

  handleEdit(params) {
    let self = this;

    fetch(`http://localhost:1234/todo/${params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${window.getCookie('token')}`
      },
      method: 'PATCH',
      body: JSON.stringify({ isDone: params.completed })
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
      let todos = self.state.todos;
      let index = todos.findIndex(todo => todo._id === params.id);

      todos[index] = data;
      
      self.setState({ todos });
    })
    .catch(err => console.log(err));
  }

  handleRemove(todoId) {
    let self = this;

    if(!window.confirm('Вы уверены?')) {
      return;
    }

    fetch(`http://localhost:1234/todo/${todoId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${window.getCookie('token')}`
      },
      method: 'DELETE'
    })
    .then(response => {
      if(response.status === 200) {
        let todos = self.state.todos;
        todos = todos.filter(todoListItem => {
          return todoListItem._id !== todoId;
        });
        
        self.setState({ todos });
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
          title={this.props.selectedTodoListTitle}
          element={<Button onClick={this.props.onHistoryBack}>Назад</Button>}
        />
        
        <section className="todo-list">
          {
            this.state.todos.map(todo => {
              return (
                <TodoElement
                  id={todo._id}
                  title={todo.title}
                  completed={todo.isDone}
                  key={todo._id}
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

Todo.propTypes = {
  id: PropTypes.string.isRequired,
  onHistoryBack: PropTypes.func.isRequired,
  selectedTodoListTitle: PropTypes.string.isRequired
}

export default Todo;