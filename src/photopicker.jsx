import React from 'react';
import './base.css';
import './func.less';

export default class Photopicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
    this.selectFile = this.selectFile.bind(this);
  }

  selectFile(ev) {
    console.log('files: ', ev.target.files);
    if (!ev.target.files || ev.target.files.length < 1) return;
    for (let i = 0; i < ev.target.files.length; i++) {
      var reader = new FileReader();
      reader.onload = (ev2) => {
        console.log('onload: ', ev2);
        let files = this.state.files;
        files[i] = ev2.target.result;
        this.setState(...this.state, {files: files});
      };
      reader.readAsDataURL(ev.target.files.item(i));
    }
  }

  render() {
    var fileInputStyle = {
    };
    var holderClassName = 'flat img_input_holder';
    if (this.state.files && this.state.files.length > 0) {
      console.log('img: ', this.state.files[0]);
      fileInputStyle = {
        backgroundImage: `url(${this.state.files[0]})`,
      };
    } else {
      // fileInputStyle = {
      //   backgroundImage: `url(${ic_photo_library_black_48dp})`,
      // };
      holderClassName += ' img_input_holder_empty';
    }
    return (<div>
      <div className={holderClassName}>
        <label style={fileInputStyle}>
          <input className='display_none' type='file'
            accept='image/*' multiple
            onChange={this.selectFile}/>
        </label>
      </div>
    </div>);
  }
}
