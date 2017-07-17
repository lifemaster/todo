import React from 'react';
import PropTypes from 'prop-types';

import config from '../config';

class SignInForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    let body = JSON.stringify({
      name: this.refs.login.value,
      password: this.refs.password.value
    });
    
    fetch(`${config.serverURI}/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
    .then(response => response.json())
    .then(data => this.props.onSignIn(data.token))
    .catch(err => console.log(err));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="login" placeholder="Логин" />
        <input type="password" ref="password" placeholder="Пароль" />
        <button>Войти</button>
      </form>
    ); 
  }
}

SignInForm.propTypes = {
  onSignIn: PropTypes.func.isRequired
}

export default SignInForm;