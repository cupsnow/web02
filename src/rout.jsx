import React from 'react';
import PropTypes from 'prop-types';
import {Route, Link as Link} from 'react-router-dom';

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

export default class Misc extends React.Component {
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
