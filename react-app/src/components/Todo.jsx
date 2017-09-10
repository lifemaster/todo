import React from 'react';
import PropTypes from 'prop-types';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import cookie from '../cookie';
import config from '../config';

import Header from './Header';
import Button from './Button';
import TodoElement from './TodoElement';
import Form from './Form';

const SortableItem = SortableElement(({value, self}) => {
  return (
    <div>
      <TodoElement
        id={value._id}
        title={value.title}
        completed={value.isDone}
        onEdit={self.handleEdit}
        onRemove={self.handleRemove}
      />
    </div>
  )
});

const SortableList = SortableContainer(({items, self}) => {
  return (
    <section className="todo-list">
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} self={self} />
      ))}
    </section>
  );
});

class Todo extends React.Component {
  constructor() {
    super();

    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.state = {
      todoListTitle: null,
      todos: []
    };
  }

  componentDidMount() {
    let self = this;

    fetch(`${config.serverURI}/api/todo-list/${this.props.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${cookie.get(config.authCookieName)}`
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
        todoListTitle: data.listTitle,
        todos: data.todos
      });
    })
    .catch(err => console.log(err));
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    const self = this;
    let primiseArr = [];

    self.setState({
      todos: arrayMove(this.state.todos, oldIndex, newIndex)
    }, () => {
      self.state.todos.forEach((todo, index) => {
        primiseArr.push(
          fetch(`${config.serverURI}/api/todo/${todo._id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${cookie.get(config.authCookieName)}`
            },
            method: 'PATCH',
            body: JSON.stringify({ order: index })
          })
        );
      });
      Promise.all(primiseArr);
    })
  }

  shouldCancelSortStart(e) {
    return e.target.innerHTML === 'swap_vert' ? false : true;
  }

  handleAdd(title) {
    let self = this;

    fetch(`${config.serverURI}/api/todo-list/${self.props.id}`, {
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
      let todos = self.state.todos;
      todos.push(data);
      
      self.setState({ todos });
    })
    .catch(err => console.log(err));
  }

  handleEdit(params, callback) {
    let self = this;
    let bodyObj = {};

    if(typeof params.completed === 'boolean') {
      bodyObj.isDone = params.completed;
    }

    if(params.title) {
      bodyObj.title = params.title;
    }

    fetch(`${config.serverURI}/api/todo/${params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${cookie.get(config.authCookieName)}`
      },
      method: 'PATCH',
      body: JSON.stringify(bodyObj)
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

      if(typeof callback === 'function') callback();
    })
    .catch(err => console.log(err));
  }

  handleRemove(todoId) {
    let self = this;

    if(!window.confirm('Вы уверены?')) {
      return;
    }

    fetch(`${config.serverURI}/api/todo/${todoId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${cookie.get(config.authCookieName)}`
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
        <Header title={`Task list of project: ${this.state.todoListTitle}`} element={<Button onClick={this.props.onHistoryBack}>Back</Button>} />
         <SortableList
          items={this.state.todos}
          onSortEnd={this.onSortEnd}
          self={this}
          lockToContainerEdges={true}
          lockOffset={0}
          lockAxis="y"
          shouldCancelStart={this.shouldCancelSortStart}
        />
        <Form onAdd={this.handleAdd}/>
      </main>
    );
  }
}

Todo.propTypes = {
  id: PropTypes.string.isRequired,
  onHistoryBack: PropTypes.func.isRequired
}

export default Todo;