import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
      <div className="sign-form-container sign-in">
        <form onSubmit={this.handleSubmit}>
          <h3>Авторизация</h3>
          <input type="text" ref="login" placeholder="Логин" />
          <input type="password" ref="password" placeholder="Пароль" />
          <button>Войти</button>
          <p>Нет учетной записи? <Link to="/sign-up">Зарегистрируйтесь</Link></p>
        </form>
      </div>
    ); 
  }
}

SignInForm.propTypes = {
  onSignIn: PropTypes.func.isRequired
}

export default SignInForm;