import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from './Checkbox';
import Button from './Button';

function TodoElement(props) {
  return (
    <div className={`todo${props.completed ? ' completed' : ''}`}>
      <Checkbox onChange={
        isChecked => {
          props.onEdit({
            id: props.id,
            completed: isChecked
          })
        }
      } />

      <span className="todo-title">{props.title}</span>

      <Button
        className="icon delete"
        icon="delete"
        onClick={() => props.onRemove(props.id)}
      />
    </div>
  );
}

TodoElement.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default TodoElement;