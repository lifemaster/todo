import React from 'react';
import PropTypes from 'prop-types';

function Todo(props) {
  return (
    <main>
      <header>
        <h1>Todo list title</h1>
        <button onClick={props.onHistoryBack}>Back</button>
      </header>
      
      <section className="todo-list">
        <div className="todo completed">
          <button className="checkbox icon">
            <i className="material-icons">check_box</i>
          </button>

          <span className="todo-title">Todo 1</span>

          <button className="delete icon">
            <i className="material-icons">delete</i>
          </button>
        </div>

        <div className="todo">
          <button className="checkbox icon">
            <i className="material-icons">check_box_outline_blank</i>
          </button>

          <span className="todo-title">Todo 2</span>

          <button className="delete icon">
            <i className="material-icons">delete</i>
          </button>
        </div>
      </section>
    </main>
  );
}

Todo.propTypes = {
  onHistoryBack: PropTypes.func.isRequired
}

export default Todo;