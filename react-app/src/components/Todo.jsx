import React from 'react';
import PropTypes from 'prop-types';

function Todo(props) {
  return (
    <div>
      <p>Desired Todo</p>
      <button onClick={props.onHistoryBack}>Back</button>
    </div>
  );
}

Todo.propTypes = {
  onHistoryBack: PropTypes.func.isRequired
}

export default Todo;