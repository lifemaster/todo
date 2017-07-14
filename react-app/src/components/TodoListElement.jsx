import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Button from './Button';

function TodoListElement(props) {
  return (
    <div className="todo">
      <Link
        to={`/todo-list/${props.id}`}
        className="todo-title"
        onClick={() => props.onSelectTodoList(props.title)}>
        {props.title}
      </Link>
      <Button
        className="delete icon"
        icon="delete"
        onClick={() => props.onRemove(props.id)}
      />
    </div>
  );
}

TodoListElement.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSelectTodoList: PropTypes.func.isRequired
};

export default TodoListElement;