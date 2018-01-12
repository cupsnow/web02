import React from 'react';
import './base.css';
import './func.less';
import './img/ic_bug_report_black_48dp.png';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    var xxx = {aa: 'a', bb: 'b'};
    console.log(`xxx: `, xxx);

    var yyy = {...xxx, cc: 'c'};
    console.log(`yyy: `, yyy);

    var zzz = {};
    Object.assign(zzz, xxx, {dd: 'd'});
    console.log(`zzz: `, zzz);

    Object.keys(xxx).map((val, idx) => {
      console.log(`xxx[${idx}]: `, xxx[val]);
    });

    return (<div className='test_img'>
      here test_img
      <div className='test_img2'>
        here test_img2
      </div>
    </div>);
  }
}
