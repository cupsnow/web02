import ReactDOM from 'react-dom';
import React from 'react';
// import PropTypes from 'prop-types';
import {HashRouter as Router /*, Switch */, Route, Link as Link} from 'react-router-dom';
import Datepicker from './datepicker.jsx';
import Photopicker from './photopicker.jsx';
import Locpicker from './locpicker.jsx';
import App from './app.jsx';
import NotiTest from './notitest.jsx';
import * as Ctrl from './ctrl';

class Submenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<Router>
      <div>
        <div className='item'>
          <Link to='/NotiTest'>Push notification</Link>
        </div>
      </div>
    </Router>);
  }
}

export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (<Router>
      <div>
        <div className='nav'>
          <span className='title'>Demo</span>
          <div className='item'>
            <Link to='/'>Home</Link>
          </div>
          <div className='sep'>|</div>
          <div className='item'>
            <Link to='/App'>App</Link>
          </div>
          <div className='sep'>|</div>
          <div className='item'>
            <Link to='/Photopicker'>Photopicker</Link>
          </div>
          <div className='sep'>|</div>
          <div className='item'>
            <Link to='/Datepicker'>Datepicker</Link>
          </div>
          <div className='sep'>|</div>
          <div className='item'>
            <Link to='/Locpicker'>Locpicker</Link>
          </div>
          <div className='sep'>|</div>
          <div className='item'>
            <Link to='/NotiTest'>Push notification</Link>
          </div>
          <div className='sep'>|</div>
          <div className='item'>
            <Link to='/Submenu'>Submenu</Link>
          </div>
        </div>
        <div>
          <Route path='/App' component={App}/>
          <Route path='/Photopicker' component={Photopicker}/>
          <Route path='/Datepicker' component={Datepicker}/>
          <Route path='/Locpicker' component={Locpicker}/>
          <Route path='/NotiTest' component={NotiTest}/>
          <Route path='/Submenu' component={Submenu}/>
        </div>
      </div>
    </Router>);
  }
}

function launch() {
  var holder = document.createElement('div');
  document.body.appendChild(holder);
  ReactDOM.render((<Index/>), holder);
}

// console.log('window.isCordovaApp: ', window.isCordovaApp);
if (Ctrl.isCordovaApp()) {
  document.addEventListener('deviceready', () => {
    console.log('deviceready');
    launch();
  }, false);
} else {
  launch();
}
