import React from 'react';
// import PropTypes from 'prop-types';
import './base.css';
import './func.less';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    var xxx = {aa: 'a', bb: 'b'};
    console.log(`xxx2: `, xxx);

    var yyy = {...xxx, cc: 'c'};
    console.log(`yyy: `, yyy);

    var yyy2 = {...yyy, cc: 'c2'};
    console.log(`yyy2: `, yyy2);

    var zzz = {};
    Object.assign(zzz, xxx, {dd: 'd'});
    console.log(`zzz: `, zzz);

    Object.keys(xxx).map((val, idx) => {
      console.log(`xxx[${idx}]: `, xxx[val]);
    });

    return (<div>
      N/A
    </div>);
  }
}
