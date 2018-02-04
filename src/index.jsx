import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import {HashRouter as Router, Switch, Route, Link as Link} from 'react-router-dom';
import Datepicker from './datepicker.jsx';
import Photopicker from './photopicker.jsx';
import Locpicker from './locpicker.jsx';
import App from './app.jsx';

/* global PushNotification:true */

export function isCordovaApp() {
  return window && window.isCordovaApp;
}

class Submenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<Router>

    </Router>);
  }
}

export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pushNoti: {
        regId: '',
        msg: ''
      }
    };
  }

  componentWillMount() {
    this.pushNotificationInit();
  }

  pushNotificationInit() {
    if (!isCordovaApp()) return;
    const push = PushNotification.init({
      android: {
      },
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      },
      ios: {
        alert: "true",
        badge: "true",
        sound: "true"
      },
      windows: {}
    });

    push.on('registration', (data) => {
      console.log('registration: ', data);
      // data.registrationId
      this.setState({
        ...this.state,
        pushNoti: {
          ...this.state.pushNoti,
          regId: data.registrationId
        }
      });
    });

    push.on('notification', (data) => {
      console.log('notification: ', data);
      // data.message,
      // data.title,
      // data.count,
      // data.sound,
      // data.image,
      // data.additionalData
      this.setState({
        ...this.state,
        pushNoti: {
          ...this.state.pushNoti,
          msg: data.message
        }
      });
    });

    push.on('error', (e) => {
      console.log('error: ', e);
      // e.message
    });
  }

  render() {
    return (<Router>
      <div>
        <div className='push_noti'>
          {isCordovaApp() ? `${this.state.pushNoti.regId}: ${this.state.pushNoti.msg}` : (null)}
        </div>
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
            <Link to='/Submenu'>Submenu</Link>
          </div>
        </div>
        <div>
          <Route path='/App' component={App}/>
          <Route path='/Photopicker' component={Photopicker}/>
          <Route path='/Datepicker' component={Datepicker}/>
          <Route path='/Locpicker' component={Locpicker}/>
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

console.log('isCordovaApp: ', window.isCordovaApp);
if (isCordovaApp()) {
  document.addEventListener('deviceready', () => {
    console.log('deviceready');
    launch();
  }, false);
} else {
  launch();
}
