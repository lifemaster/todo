import React, { Component } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

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
    window.setCookie('token', token, { expires: 1440 });
    this.props.history.push('/todo-list');
  }

  signOut() {
    window.removeCookie('token');
    this.props.history.push('/sign-in');
  }

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={props =>
            <Redirect to={document.cookie.token ? '/todo-list' : '/sign-in'} />
          }
        />

        <Route
          path="/sign-up"
          render={props =>
            window.getCookie('token') ?
            <Redirect to="/todo-list" /> :
            <SignUpForm onSignUp={this.signIn} />
          }
        />

        <Route
          path="/sign-in"
          render={props =>
            window.getCookie('token') ?
            <Redirect to="/todo-list" /> :
            <SignInForm onSignIn={this.signIn} />
          }
        />

        <Route
          exact
          path="/todo-list"
          render={props =>
            window.getCookie('token') ?
            <TodoList onSignOut={this.signOut} /> :
            <Redirect to="/sign-in" />
          }
        />

        <Route
          path="/todo-list/:id"
          render={props =>
            window.getCookie('token') ?
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