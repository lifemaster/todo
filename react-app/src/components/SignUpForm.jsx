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
        errorMessage: 'All fields must be filled out!'
      });
    }

    if(this.refs.password.value !== this.refs.repassword.value) {
      return this.setState({
        error: true,
        errorMessage: 'Passwords don\'t match'
      });
    }

    let body = JSON.stringify({
      name: this.refs.login.value,
      password: this.refs.password.value
    });
    
    fetch(`${config.serverURI}/api/sign-up`, {
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
          errorMessage: `Username "${this.refs.login.value}" doesn't exist`
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
          <h3>Registration</h3>
          {
            this.state.error ? <p className="error">{this.state.errorMessage}</p> : ''
          }
          <input type="text" ref="login" placeholder="Username" onFocus={this.handleFocus} />
          <input type="password" ref="password" placeholder="Password" onFocus={this.handleFocus} />
          <input type="password" ref="repassword" placeholder="Confirm password" onFocus={this.handleFocus} />
          <button>Sign up</button>
          <p>If you have already had an account you can <Link to="/sign-in">sign in</Link></p>
        </form>
      </div>
    ); 
  }
}

SignUpForm.propTypes = {
  onSignUp: PropTypes.func.isRequired
}

export default SignUpForm;