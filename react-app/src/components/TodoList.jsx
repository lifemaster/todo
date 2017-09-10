import React from 'react';
import PropTypes from 'prop-types';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import cookie from '../cookie';
import config from '../config';

import Header from './Header';
import SignOut from './SignOut';
import TodoListElement from './TodoListElement';
import Form from './Form';

const SortableItem = SortableElement(({value, self}) => {
  return (
    <div>
      <TodoListElement
        id={value._id}
        title={value.title}
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

class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.onSortEnd = this.onSortEnd.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.state = {
      todoList: []
    };
  }

  componentDidMount() {
    let self = this;

    fetch(`${config.serverURI}/api/todo-list`, {
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

  onSortEnd = ({oldIndex, newIndex}) => {
    const self = this;
    let primiseArr = [];

    self.setState({
      todoList: arrayMove(this.state.todoList, oldIndex, newIndex)
    }, () => {
      self.state.todoList.forEach((todo, index) => {
        primiseArr.push(
          fetch(`${config.serverURI}/api/todo-list/${todo._id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${cookie.get(config.authCookieName)}`
            },
            method: 'PATCH',
            body: JSON.stringify({ title: todo.title, order: index })
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

    fetch(`${config.serverURI}/api/todo-list`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${cookie.get(config.authCookieName)}`
      },
      method: 'POST',
      body: JSON.stringify({ title, order: this.state.todoList.length })
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

    fetch(`${config.serverURI}/api/todo-list/${params.id}`, {
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

    if(!window.confirm('All tasks in this project will be removed. Are you sure?')) {
      return;
    }

    fetch(`${config.serverURI}/api/todo-list/${todoListId}`, {
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
        <Header title="Project list" element={<SignOut onSignOut={this.props.onSignOut}/>} />
        <SortableList
          items={this.state.todoList}
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

TodoList.propTypes = {
  onSignOut: PropTypes.func.isRequired,
  onSelectTodoList: PropTypes.func
};

export default TodoList;