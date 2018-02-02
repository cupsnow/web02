import React from 'react';
import './base.css';
import './func.less';

export default class Photopicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      picTaken: null
    };
    this.selectFile = this.selectFile.bind(this);
    this.takePicture = this.takePicture.bind(this);
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

  isSupportTakePicture() {
    return window && window.isCordovaApp && navigator && navigator.camera;
  }

  takePicture(/* ev */) {
    if (!this.isSupportTakePicture()) return;
    var camera = navigator.camera;
    camera.getPicture((data /*, path */) => {
      this.setState({
        ...this.state,
        picTaken: data
      });
    }, (msg) => {
      console.log('failed: ', msg);
    }, {
      // sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
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
    var takePicture = (null);
    if (this.isSupportTakePicture()) {
      var picTaken = (null);
      if (this.state.picTaken) {
        picTaken = (<img src={`data:image/jpeg;base64,${this.state.picTaken}`}/>);
      }
      takePicture = (<div>
        <button onClick={this.takePicture}>take Picture</button>
        {picTaken}
      </div>);
    }
    return (<div>
      {takePicture}
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
