import React from 'react';
import { Link } from 'react-router-dom';

import SignOut from './SignOut';

function TodoList(props) {
  return (
    <div>
      <p>TodoList</p>
      <Link to="todo-list/some-todo">Some todo</Link>
      <SignOut onSignOut={props.onSignOut}/>
    </div>
  );
}

export default TodoList;