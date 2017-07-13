import React from 'react';
import { Link } from 'react-router-dom';

import SignOut from './SignOut';

function TodoList(props) {
  return (
    <main>
      <header>
        <h1>Todo list</h1>
        <SignOut onSignOut={props.onSignOut}/>
      </header>
      
      <section className="todo-list">
        
        <div className="todo">
          <Link to="/todo-list/1" className="todo-title">Todo list title 1</Link>
          <button className="delete icon">
            <i className="material-icons">delete</i>
          </button>
        </div>

        <div className="todo">
          <Link to="/todo-list/2" className="todo-title">Todo list title 2</Link>
          <button className="delete icon">
            <i className="material-icons">delete</i>
          </button>
        </div>

      </section>
    </main>
  );
}

export default TodoList;