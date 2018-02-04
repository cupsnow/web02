import React from 'react';
import PropTypes from 'prop-types';
import './base.css';
import './func.less';
import * as googleapi from './googleapi';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pushNotiResult: ''
    };
    this.onPushNoti = this.onPushNoti.bind(this);
  }

  onPushNoti(ev) {
    var url = `https://gcm-http.googleapis.com/gcm/send`;
    var body = {
      to: this.pushNotiRegId.value,
      data: {
        title: this.pushNotiTitle.value,
        message: this.pushNotiMsg.value,
        detail: `detail: ${this.pushNotiMsg.value}`
      }
    };
    var headers = new Headers();
    headers.append("Authorization", `key=${this.pushNotiKey.value}`);
    headers.append("Content-Type", 'application/json');
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
          pushNotiResult: resp.type
        });
      }
    }).then(jobj => {
      console.log('onPushNoti jobj: ', jobj);
      if (!jobj) return;
      this.setState({...this.state,
        pushNotiResult: 'Ok'
      });
    });
  }

  render() {
    return (<div>
      <label>
        Api key: <input type='text' ref={elm => this.pushNotiKey = elm}
          defaultValue={this.props.pushNotiKey}/>
      </label>
      <label>
        Registration token: <input type='text'
          ref={elm => this.pushNotiRegId = elm}
          defaultValue={'fhriTirpyDg:APA91bFZSc58XFdCL_yaz-6nayaglZJGM6fh3tsTEttQ1RqbYkdd0iZI4RpDXROvhAORZrXc-BY0KfSCfjLFKZK5TC4qcmftShOdjtzfOnBckD7Jm-JaItjlQ9p_EO6gyByorcK3V4T_'}/>
      </label>
      <label>
        Title: <input type='text' ref={elm => this.pushNotiTitle = elm}
          defaultValue='title'/>
      </label>
      <label>
        Message: <input type='text' ref={elm => this.pushNotiMsg = elm}
          defaultValue={`message/${new Date()}`}/>
      </label>
      <button onClick={this.onPushNoti}>Send</button>
      {this.state.pushNotiResult}
    </div>);
  }
}

App.defaultProps = {
  pushNotiKey: googleapi.googlePushNotiApiKey
};

App.propTypes = {
  pushNotiKey: PropTypes.string
};
