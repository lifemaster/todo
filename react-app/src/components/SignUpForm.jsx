import React from 'react';
import PropTypes from 'prop-types';

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
    
    fetch('http://localhost:1234/sign-up', {
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
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="login" placeholder="Логин" />
        <input type="password" ref="password" placeholder="Пароль" />
        <input type="password" ref="repassword" placeholder="Повторите пароль" />
        <button>Зарегистрироваться</button>
      </form>
    ); 
  }
}

SignUpForm.propTypes = {
  onSignUp: PropTypes.func.isRequired
}

export default SignUpForm;