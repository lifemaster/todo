import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from './Checkbox';
import Button from './Button';

class TodoElement extends React.Component {
  
  constructor(props) {
    super(props);

    this.switchToEdit = this.switchToEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      editing: false
    };
  }

  switchToEdit() {
    this.setState({ editing: true }, () => {
      this.refs.title.focus();
      this.refs.title.select();
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.onEdit({
      id: this.props.id,
      title: this.refs.title.value
    }, () => {
      this.setState({ editing: false });
    });
  }

  render() {
    if(this.state.editing) {
      return (
        <form className="todo-edit-form" onSubmit={this.handleSubmit}>
          <input type="text" ref="title" defaultValue={this.props.title} />
          <Button className="save icon" icon="save" type="submit" />
        </form>
      );
    }
    else {
      return (
        <div className={`todo${this.props.completed ? ' completed' : ''}`}>
          <Checkbox initiallyChecked={this.props.completed} onChange={
            isChecked => {
              this.props.onEdit({
                id: this.props.id,
                completed: isChecked
              })
            }
          } />

          <span className="todo-title">{this.props.title}</span>

          <Button
            className="icon edit"
            icon="edit"
            onClick={this.switchToEdit}
          />

          <Button
            className="icon delete"
            icon="delete"
            onClick={() => this.props.onRemove(this.props.id)}
          />
        </div>
      );
    }
  }
}

TodoElement.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default TodoElement;