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
import Rout from './rout.jsx';
import Bx from './bx.jsx';
import * as MQTT from 'mqtt';

// const MQTT_SVR='ws://test.mosquitto.org:8080/';
const MQTT_SVR='ws://192.168.1.159:9001/';
const MQTT_TOPIC='joelai/web2';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mqttConnected: false
    };

    this.appCtx = {
      mqtt: {
        client: MQTT.connect(MQTT_SVR),
        listeners: [],
        addListener(listener) {
          var id = Symbol();
          this.listeners.push({
            listener: listener,
            id: id
          });
          return id;
        },
        rmListener(id) {
          var cnt = 0;
          for (let i = this.listeners.length - 1; i >= 0; i--) {
            if (this.listeners[i].id === id) {
              this.listeners = this.listeners.slice(i, 1);
              cnt++;
            }
          }
          return cnt;
        },
        dispatch(topic, msg) {
          console.log(`topic: ${topic}, msg: ${msg.toString()}`);
          this.listeners.map(item => item.listener(topic, msg));
        }
      }
    };

    this.appCtx.mqtt.addListener((topic, msg) => {
      this.setState({
        noti: `topic: ${topic}, msg: ${msg.toString()}`
      });
    });
  }

  componentWillMount() {
    this.appCtx.mqtt.client.on('connect', () => {
      console.log('mqtt connected');
      this.appCtx.mqtt.client.subscribe(MQTT_TOPIC);
      this.setState({mqttConnected: true});
    });
    this.appCtx.mqtt.client.on('message', (topic, msg) => {
      this.appCtx.mqtt.dispatch(topic, msg);
    });
  }

  render() {
    if (this.state.busy) return (<div>BUSY...</div>);
    var circleStyle = {
      display: 'inline-block',
      width: '1em',
      height: '1em',
      boxSizing: 'border-box',
      border: '.5em solid #5d3d1a',
      borderRadius: '50%'
    };

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
        <div style={{...circleStyle,
          borderColor: this.state.mqttConnected ? '#6bff71' : '#ff6b6b'}}/>
        {` Recevied notification: ${this.state.noti || '<Empty>'}`}
        <br/>
        <input type='text' ref={elm => this.publishInput = elm}/>
        <button onClick={() => this.appCtx.mqtt.client.publish(MQTT_TOPIC, this.publishInput.value)}>Send</button>
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
        <Route path='/Bx' render={(props) => {
          return (<Bx {...props} appCtx={this.appCtx}/>);
        }}/>
      </div>
    </div>);
  }
}

App.propTypes = {
  // match: PropTypes.object
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
