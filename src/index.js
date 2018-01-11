import ReactDOM from 'react-dom';
import React from 'react';
import {HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Datepicker from './datepicker';
import App from './app';

export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<Router>
      <div>
        <h2>Portal</h2>
        <ul>
          <li><Link to='/index.html'>Home</Link></li>
          <li><Link to='/App'>App</Link></li>
          <li><Link to='/Datepicker'>Demo Datepicker</Link></li>
        </ul>
        <hr/>
        <Switch>
          <Route path='/App' component={App}/>
          <Route path='/Datepicker' component={Datepicker}/>
        </Switch>
      </div>
    </Router>);
  }
}

var holder = document.createElement('div');
document.body.appendChild(holder);
ReactDOM.render((<Index/>), holder);
