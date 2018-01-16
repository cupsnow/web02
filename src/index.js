import ReactDOM from 'react-dom';
import React from 'react';
import {HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Datepicker from './datepicker';
import Photopicker from './photopicker';
import Locpicker from './locpicker';
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
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/App'>App</Link></li>
          <li><Link to='/Datepicker'>Demo Date picker</Link></li>
          <li><Link to='/Photopicker'>Demo Photo picker</Link></li>
          <li><Link to='/Locpicker'>Demo Location picker</Link></li>
        </ul>
        <hr/>
        <Switch>
          <Route path='/App/' component={App}/>
          <Route path='/Photopicker/' component={Photopicker}/>
          <Route path='/Datepicker/' component={Datepicker}/>
          <Route path='/Locpicker/' component={Locpicker}/>
        </Switch>
      </div>
    </Router>);
  }
}

var holder = document.createElement('div');
document.body.appendChild(holder);
ReactDOM.render((<Index/>), holder);
