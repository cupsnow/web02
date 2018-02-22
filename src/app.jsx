import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import {HashRouter as Router /*, Switch */, Route, Link as Link} from 'react-router-dom';
import Datepicker from './datepicker.jsx';
import Photopicker from './photopicker.jsx';
import Locpicker from './locpicker.jsx';
import NotiTest from './notitest.jsx';
import * as Ctrl from './ctrl';
import imgWikiDrawing from './img/wiki_drawing.png';
import Rout from './rout.jsx';
import Bx from './bx.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    console.log('App.this: ', this);
    return (<div>
      <div className='nav'>
        <div className='title inline'>
          <Link to='/'>
            <img className='thumb' src={imgWikiDrawing}/>
          </Link>
          <span>Demo</span>
        </div>
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
          <Link to='/Rout'>React Router</Link>
        </div>
        <div className='sep'>|</div>
        <div className='item'>
          <Link to='/Bx'>Bluemix</Link>
        </div>
      </div>
      <div>
        <Route path={`/:demoPage`} render={(props) => {
          console.log('App page: ', props);
          return (<div style={{
            backgroundColor: '#0041be',
            color: '#cfffc9'
          }}>
            Request Page: {props.match.params.demoPage}
          </div>);
        }}/>
        <Route path='/Photopicker' component={Photopicker}/>
        <Route path='/Datepicker' component={Datepicker}/>
        <Route path='/Locpicker' component={Locpicker}/>
        <Route path='/NotiTest' component={NotiTest}/>
        <Route path='/Rout' component={Rout}/>
        <Route path='/Bx' component={Bx}/>
      </div>
    </div>);
  }
}

App.propTypes = {
  match: PropTypes.object
};

function launch() {
  var holder = document.createElement('div');
  document.body.appendChild(holder);
  ReactDOM.render((<Router>
    <App/>
  </Router>), holder);
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
