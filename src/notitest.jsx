import React from 'react';
import PropTypes from 'prop-types';
import * as Ctrl from './ctrl';

/* global PushNotification:true */

export default class NotiTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pushNoti: {
        regId: '',
        msg: '',
        sendResult: ''
      }
    };
    this.onPushNoti = this.onPushNoti.bind(this);
  }

  componentWillMount() {
    this.pushNotiInit();
  }

  pushNotiInit() {
    console.log('pushNotiInit');
    if (!Ctrl.isCordovaApp() || !PushNotification) return;
    const push = PushNotification.init({
      android: {
      },
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      },
      ios: {
        alert: 'true',
        badge: 'true',
        sound: 'true'
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

  onPushNoti(/* ev */) {
    var url = 'https://gcm-http.googleapis.com/gcm/send';
    var body = {
      to: this.pushNotiRegId.value,
      data: {
        title: this.pushNotiTitle.value,
        message: this.pushNotiMsg.value,
        detail: `detail: ${this.pushNotiMsg.value}`
      }
    };
    var headers = new Headers();
    headers.append('Authorization', `key=${this.pushNotiKey.value}`);
    headers.append('Content-Type', 'application/json');
    var aggregate = url;
    fetch(aggregate, {
      method: 'POST',
      mode: 'cors',
      headers: headers,
      body: JSON.stringify(body)
    }).then(resp => {
      console.log('onPushNoti resp: ', resp);
      if (resp.ok) return resp.json();
      if (resp.type) {
        this.setState({...this.state,
          pushNoti: {
            ...this.state.pushNoti,
            sendResult: resp.type
          }
        });
      }
    }).then(jobj => {
      console.log('onPushNoti jobj: ', jobj);
      if (!jobj) return;
      this.setState({...this.state,
        pushNoti: {
          ...this.state.pushNoti,
          sendResult: 'ok'
        }
      });
    });
  }

  render() {
    var charUnitStyle = {
      wordWrap: 'break-word',
      wordBreak: 'break-all'
    };
    var pushNotiRecv = (null);
    if (Ctrl.isCordovaApp() && PushNotification) {
      pushNotiRecv = (<div>
        <div style={{...charUnitStyle}}>{this.state.pushNoti.regId}</div>
        <div>{this.state.pushNoti.msg}</div>
      </div>);
    }

    return (<div>
      {pushNotiRecv}
      <label>
        Api key: <input type='text' ref={elm => (this.pushNotiKey = elm)}
          defaultValue={this.props.pushNotiKey}
          style={charUnitStyle}/>
      </label>
      <br/>
      <label>
        Registration token: <input type='text' ref={elm => (this.pushNotiRegId = elm)}
          style={charUnitStyle}/>
      </label>
      <br/>
      <label>
        Title: <input type='text' ref={elm => (this.pushNotiTitle = elm)}
          defaultValue='title'/>
      </label>
      <br/>
      <label>
        Message: <input type='text' ref={elm => (this.pushNotiMsg = elm)}
          defaultValue={`message/${new Date()}`}/>
      </label>
      <br/>
      <button onClick={this.onPushNoti}>Send</button>
      {this.state.pushNoti.sendResult}
    </div>);
  }
}

NotiTest.defaultProps = {
  pushNotiKey: ''
};

NotiTest.propTypes = {
  pushNotiKey: PropTypes.string
};
