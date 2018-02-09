import ReactDOM from 'react-dom';
import React from 'react';
// import PropTypes from 'prop-types';
import {HashRouter as Router /*, Switch */, Route, Link as Link} from 'react-router-dom';
import Datepicker from './datepicker.jsx';
import Photopicker from './photopicker.jsx';
import Locpicker from './locpicker.jsx';
import NotiTest from './notitest.jsx';
import * as Ctrl from './ctrl';
import imgWikiDrawing from './img/wiki_drawing.png';

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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (null);
  }
}

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (<Router>
      <div>
        <div className='nav'>
          <div className='title inline'>
            <img className='thumb' src={imgWikiDrawing}/>
            <span>Demo</span>
          </div>
          <div className='item'>
            <Link to='/'>Home</Link>
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
          <Route path='/' exact component={Home}/>
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
  ReactDOM.render((<App/>), holder);
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
