import React from 'react';
import PropTypes from 'prop-types';
import {Route, Link as Link} from 'react-router-dom';
import * as BxInfo from './bluemix-services.json';
import * as Ctrl from './ctrl.js';

class Cloudant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cout: []
    };
  }

  componentWillMount() {
    // this.cloudantCout('GET');
  }

  cloudant(method, res, queries, body) {
    var cred = BxInfo.VCAP_SERVICES.cloudantNoSQLDB[0].credentials;
    var userpass = `${cred.username}:${cred.password}`;
    var b64Userpass = Ctrl.b64Encode(Ctrl.str2ByteArray(userpass));
    var headers = new Headers();
    headers.append('Authorization', `Basic ${b64Userpass}`);
    var sche = ((cred.url.startsWith('https') || cred.port === 443) ? 'https' : 'http');
    var url = `${sche}://${cred.host}/`;
    if (res) url += res;
    if (queries && queries.length > 0) url += `?${queries.join('&')}`;
    var initOpt = {
      method: method,
      mode: 'cors',
      headers: headers,
      credentials: 'include',
    };
    if (body) {
      initOpt.body = body;
      headers.append('Content-Type', `application/json`);
    }
    return fetch(url, initOpt);
  }

  cloudantCout(method, res, queries, body) {
    console.log('this: ', this);
    this.cloudant(method, res, queries, body).then((res) => {
      if (!res.ok) {
        this.setState({
          ...this.state,
          cout: [`${res.status} ${res.statusText}`]
        });
        throw `${res.status} ${res.statusText}`;
      }
      return res.json();
    }).then((res) => {
      this.setState({
        ...this.state,
        cout: [JSON.stringify(res)]
      });
    });
  }

  cloudantSimple() {
    this.cloudantCout(this.method.value,
      this.res.value || this.resManual.value || undefined, undefined,
      this.body.value || undefined);
  }

  render() {
    return (<div>
      <div>
        {'Method: '}
        <select ref={elm => this.method = elm}>
          <option value='GET'>GET</option>
          <option value='POST'>POST</option>
          <option value='PUT'>PUT</option>
        </select>
        {', '}
        {'Resource: '}
        <select ref={elm => this.res = elm}>
          <option value=''>{'<Empty>'}</option>
          <option value='_all_dbs'>_all_dbs</option>
        </select>
        <input ref={elm => this.resManual = elm}/>
        {', '}
        {'Body: '}
        <input ref={elm => this.body = elm}/>
        <br/>
        <button onClick={this.cloudantSimple.bind(this)}>Process</button>
      </div>
      <br/>
      <button onClick={this.cloudantCout.bind(this, 'GET', undefined, undefined, undefined)}>Dummy</button>
      <button onClick={this.cloudantCout.bind(this, 'GET', '_all_dbs', undefined, undefined)}><cite>_all_dbs</cite></button>
      <div>
        {this.state.cout[0]}
      </div>
    </div>);
  }
}

Cloudant.propTypes = {
  match: PropTypes.object
};

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<div>
      <div className='nav'>
        <div className='item'>
          <Link to={`${this.props.match.url}/Cloudant`}>Cloudant</Link>
        </div>
        {/* <div className='sep'>|</div>
        <div className='item'>
          <Link to={`${this.props.match.url}/Misc2`}>Misc2</Link>
        </div> */}
      </div>
      <div>
        <Route path={`${this.props.match.path}/:bxPage`} render={(props) => {
          console.log('Bx page: ', props);
          return (<div style={{
            backgroundColor: '#0041be',
            color: '#cfffc9'
          }}>
            Request Page: {props.match.params.bxPage}
          </div>);
        }}/>
        <Route path={`${this.props.match.path}/Cloudant`} render={(props) => {
          return (<Cloudant {...props} from={this.props.match.path}/>);
        }}/>
      </div>
    </div>);
  }
}

Menu.propTypes = {
  match: PropTypes.object
};
