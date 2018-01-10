import ReactDOM from 'react-dom';
import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Datepicker from './datepicker';

export class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<Router>
      <div>
        <h2>Demo list</h2>
        <ul>
          <li><Link to={'/Datepicker'}>Datepicker</Link></li>
        </ul>
        <hr/>
        <Switch>
          <Route exact path='/Datepicker' component={Datepicker}/>
        </Switch>
      </div>
    </Router>);
  }
}

var holder = document.createElement('div');
document.body.appendChild(holder);
ReactDOM.render((<Demo/>), holder);
