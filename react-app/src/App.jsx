import React, { Component } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

import cookie from './cookie';
import config from './config';

import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import TodoList from './components/TodoList';
import Todo from './components/Todo';
import NotFound from './components/NotFound';

class App extends Component {

  constructor() {
    super();

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);

    this.state = {
      
    };
  }

  signIn(token) {
    cookie.set('token', token, { expires: config.authCookieExpires });
    this.props.history.push('/todo-list');
  }

  signOut() {
    cookie.remove('token');
    this.props.history.push('/sign-in');
  }

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={props =>
            <Redirect to={cookie.get(config.authCookieName) ? '/todo-list' : '/sign-in'} />
          }
        />

        <Route
          path="/sign-up"
          render={props =>
            cookie.get(config.authCookieName) ?
            <Redirect to="/todo-list" /> :
            <SignUpForm onSignUp={this.signIn} />
          }
        />

        <Route
          path="/sign-in"
          render={props =>
            cookie.get(config.authCookieName) ?
            <Redirect to="/todo-list" /> :
            <SignInForm onSignIn={this.signIn} />
          }
        />

        <Route
          exact
          path="/todo-list"
          render={props =>
            cookie.get(config.authCookieName) ?
            <TodoList onSignOut={this.signOut} /> :
            <Redirect to="/sign-in" />
          }
        />

        <Route
          path="/todo-list/:id"
          render={props =>
            cookie.get(config.authCookieName) ?
            <Todo
              onHistoryBack={props.history.goBack}
              id={props.match.params.id}
            /> :
            <Redirect to="/sign-in" />
          }
        />

        <Route component={NotFound} />

      </Switch>
    );
  }
}

export default withRouter(App);