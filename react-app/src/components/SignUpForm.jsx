import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import config from '../config';

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      error: false,
      errorMessage: ''
    }
  }

  handleFocus() {
    this.setState({
      error: false,
      errorMessage: ''
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    if(!this.refs.login.value || !this.refs.password.value || !this.refs.repassword.value) {
      return this.setState({
        error: true,
        errorMessage: 'Заполните все поля'
      });
    }

    if(this.refs.password.value !== this.refs.repassword.value) {
      return this.setState({
        error: true,
        errorMessage: 'Пароли не совпадают'
      });
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
    .then(response => {
      if(response.status === 200) {
        return response.json()
      }
      else if(response.status === 400) {
        this.setState({
          error: true,
          errorMessage: `Имя пользователя "${this.refs.login.value}" уже существует`
        });
      }
      else {
        this.setState({
          error: true,
          errorMessage: `Error ${response.status}: ${response.statusText}`
        });
      }
    })
    .then(data => this.props.onSignUp(data.token))
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="sign-form-container sign-up">
        <form onSubmit={this.handleSubmit}>
          <h3>Регистрация</h3>
          {
            this.state.error ? <p className="error">{this.state.errorMessage}</p> : ''
          }
          <input type="text" ref="login" placeholder="Логин" onFocus={this.handleFocus} />
          <input type="password" ref="password" placeholder="Пароль" onFocus={this.handleFocus} />
          <input type="password" ref="repassword" placeholder="Повторите пароль" onFocus={this.handleFocus} />
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