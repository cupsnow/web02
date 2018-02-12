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

class Misc1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    console.log('Misc1.this: ', this);
    return (<div>
      <div className='nav'>
        <div className='item'>
          <Link to={`${this.props.match.url}/Misc11`}>Misc11</Link>
        </div>
        <div className='sep'>|</div>
        <div className='item'>
          <Link to={`${this.props.match.url}/Misc12`}>Misc12</Link>
        </div>
      </div>
      Routed here and pass props from: {this.props.from}
      <div>
        <Route path={`${this.props.match.path}/:misc1Page`} render={(props) => {
          console.log('Misc1 page: ', props);
          return (<div style={{
            backgroundColor: '#0041be',
            color: '#cfffc9'
          }}>
            Request Page: {props.match.params.misc1Page}
          </div>);
        }}/>
      </div>
    </div>);
  }
}

Misc1.propTypes = {
  match: PropTypes.object,
  from: PropTypes.string
};

class Misc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    console.log('Misc.this: ', this);
    return (<div>
      <div className='nav'>
        <div className='item'>
          <Link to={`${this.props.match.url}/Misc1`}>Misc1</Link>
        </div>
        <div className='sep'>|</div>
        <div className='item'>
          <Link to={`${this.props.match.url}/Misc2`}>Misc2</Link>
        </div>
      </div>
      <div>
        <Route path={`${this.props.match.path}/:miscPage`} render={(props) => {
          console.log('Misc page: ', props);
          return (<div style={{
            backgroundColor: '#0041be',
            color: '#cfffc9'
          }}>
            Request Page: {props.match.params.miscPage}
          </div>);
        }}/>
        <Route path={`${this.props.match.path}/Misc1`} render={(props) => {
          return (<Misc1 {...props} from={this.props.match.path}/>);
        }}/>
      </div>
    </div>);
  }
}

Misc.propTypes = {
  match: PropTypes.object
};

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
          <Link to='/Misc'>Miscellaneous</Link>
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
        <Route path='/Misc' component={Misc}/>
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
