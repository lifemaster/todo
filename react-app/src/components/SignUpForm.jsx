import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import config from '../config';

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    if(this.refs.password.value !== this.refs.repassword.value) {
      return;
    }

    let body = JSON.stringify({
      name: this.refs.login.value,
      password: this.refs.password.value
    });
    
    fetch(`${config.serverURI}/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
    .then(response => response.json())
    .then(data => this.props.onSignUp(data.token))
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="sign-form-container sign-up">
        <form onSubmit={this.handleSubmit}>
          <h3>Регистрация</h3>
          <input type="text" ref="login" placeholder="Логин" />
          <input type="password" ref="password" placeholder="Пароль" />
          <input type="password" ref="repassword" placeholder="Повторите пароль" />
          <button>Зарегистрироваться</button>
          <p>Если уже есть учетная запись, то вы можете <Link to="/sign-in">войти</Link></p>
        </form>
      </div>
    ); 
  }
}

SignUpForm.propTypes = {
  onSignUp: PropTypes.func.isRequired
}

export default SignUpForm;