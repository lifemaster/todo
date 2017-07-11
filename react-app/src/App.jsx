import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import TodoList from './components/TodoList';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/sign-up" component={SignUpForm} />
          <Route path="/sign-in" component={SignInForm} />
          <Route path="/todo-list" component={TodoList} />
        </div>
      </Router>
    );
  }
}

export default App;