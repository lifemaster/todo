import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import config from '../config';

class SignInForm extends React.Component {
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

    if(!this.refs.login.value || !this.refs.password.value) {
      return this.setState({
        error: true,
        errorMessage: 'All fields must be filled out'
      });
    }

    let body = JSON.stringify({
      name: this.refs.login.value,
      password: this.refs.password.value
    });
    
    fetch(`${config.serverURI}/api/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
    .then(response => {
      if(response.status === 200) {
        return response.json();
      }
      else if(response.status === 401) {
        this.setState({
          error: true,
          errorMessage: 'Wrong username/password'
        });
      }
      else {
        this.setState({
          error: true,
          errorMessage: `Error ${response.status}: ${response.statusText}`
        });
      }
    })
    .then(data => this.props.onSignIn(data.token))
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="sign-form-container sign-in">
        <form onSubmit={this.handleSubmit}>
          <h3>Authorization</h3>
          {
            this.state.error ? <p className="error">{this.state.errorMessage}</p> : ''
          }
          <input type="text" ref="login" placeholder="Username" onFocus={this.handleFocus} />
          <input type="password" ref="password" placeholder="Password" onFocus={this.handleFocus} />
          <button>Sing in</button>
          <p>No account? <Link to="/sign-up">Sign up</Link></p>
        </form>
      </div>
    ); 
  }
}

SignInForm.propTypes = {
  onSignIn: PropTypes.func.isRequired
}

export default SignInForm;