import React from 'react';
import PropTypes from 'prop-types';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);

    this.state = {
      checked: this.props.initiallyChecked
    }
  }

  clickHandler(e) {
    this.setState(
      { checked: !this.state.checked },
      () => this.props.onChange(this.state.checked)
    );
  }

  render() {
    return (
      <button className="checkbox icon" onClick={this.clickHandler}>
        <i className="material-icons">
          {this.state.checked ? 'check_box' : 'check_box_outline_blank'}
        </i>
      </button>
    );
  }
}

Checkbox.propTypes = {
  initiallyChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func
}

export default Checkbox;