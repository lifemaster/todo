import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import './index.css';
import './app.css';
import registerServiceWorker from './registerServiceWorker';

window.getCookie = function(name) {
  let match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  if (match) return match[1];
}

window.setCookie = function(name, value, options) {
  options = options || {};

  let expires = options.expires;

  if(typeof expires === 'number' && expires) {
    let d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }

  if(expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  let updatedCookie = name + '=' + value;

  for(let propName in options) {
    updatedCookie += '; ' + propName;
    let propValue = options[propName];
    if(propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }

  document.cookie = updatedCookie;
}

window.updateCookie = function(name, value, options) {
  value = value || window.getCookie(name);
  window.setCookie(name, value, options);
}

window.removeCookie = function(name) {
  window.setCookie(name, '', {
    expires: -1
  });
}

ReactDOM.render(
  <Router>
    <App />
  </Router>
,document.getElementById('root'));

registerServiceWorker();