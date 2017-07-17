import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Button from './Button';

class TodoListElement extends React.Component {

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
        <div className="todo">
          <Link
            to={`/todo-list/${this.props.id}`}
            className="todo-title">
            {this.props.title}
          </Link>
          
          <Button
            className="edit icon"
            icon="edit"
            onClick={this.switchToEdit}
          />

          <Button
            className="delete icon"
            icon="delete"
            onClick={() => this.props.onRemove(this.props.id)}
          />
        </div>
      );
    }
  }
}

TodoListElement.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default TodoListElement;