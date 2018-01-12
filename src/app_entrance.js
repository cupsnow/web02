import ReactDOM from 'react-dom';
import React from 'react';
import App from './app';

var holder = document.createElement('div');
document.body.appendChild(holder);
ReactDOM.render((<App/>), holder);
