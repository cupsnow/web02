import React from 'react';
import PropTypes from 'prop-types';
import {Route, Link as Link} from 'react-router-dom';
import * as Base64 from 'base64-js';
import {TextEncoder /* , TextDecoder */} from 'text-encoding';
import * as Ctrl from './ctrl.js';
import * as BxInfo from './bluemix-services.json';

class Cloudant0 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cout: []
    };
  }

  // componentWillMount() {
  //   this.cloudantCout('GET');
  // }

  cloudant(method, res, queries, body) {
    var cred = BxInfo.VCAP_SERVICES.cloudantNoSQLDB[0].credentials;
    var b64Userpass = Base64.fromByteArray(new TextEncoder('utf-8').encode(`${cred.username}:${cred.password}`));
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
      <div>
        {this.state.cout[0]}
      </div>
    </div>);
  }
}

Cloudant0.propTypes = {
  match: PropTypes.object
};

class Cloudant1 extends Ctrl.CtxComponent {
  constructor(props) {
    super(props);
    this.state = {
      cout: []
    };
    this.testPromise = this.testPromise.bind(this);
  }

  testPromise() {
    this.props.appCtx.acc = (typeof this.props.appCtx.acc) !== 'undefined' ?
      this.props.appCtx.acc + 1 : 0;
    console.log("appCtx.acc: ", this.props.appCtx.acc);

    new Promise((res, rej) => {
      console.log('testPromise running');
      res();
    }).then(() => {
      console.log('testPromise then1 throw');
      throw "testPromise then1 throw";
    }).then(() => {
      console.log('testPromise then2 running');
    }).catch((e) => {
      console.log('testPromise final cache: ', e);
    });
  }

  render() {
    return (<div>
      <div>
        <button onClick={this.testPromise}>Test Promise</button>
      </div>
      <br/>
      <div>
        {this.state.cout[0]}
      </div>
    </div>);
  }
}

Cloudant1.propTypes = {
  ...Ctrl.CtxComponent.propTypes,
  match: PropTypes.object
};

export default class Menu extends Ctrl.CtxComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<div>
      <div className='nav'>
        <div className='item'>
          <Link to={`${this.props.match.url}/Cloudant0`}>Cloudant0</Link>
        </div>
        <div className='sep'>|</div>
        <div className='item'>
          <Link to={`${this.props.match.url}/Cloudant1`}>Cloudant1</Link>
        </div>
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
        <Route path={`${this.props.match.path}/Cloudant0`} render={(props) => {
          return (<Cloudant0 {...props} from={this.props.match.path}/>);
        }}/>
        <Route path={`${this.props.match.path}/Cloudant1`} render={(/* props */) => {
          console.log('this: ', this);
          return (<Cloudant1 appCtx={this.props.appCtx} from={this.props.match.path}/>);
        }}/>
      </div>
    </div>);
  }
}

Menu.propTypes = {
  ...Ctrl.CtxComponent.propTypes,
  // match: PropTypes.object,
};
