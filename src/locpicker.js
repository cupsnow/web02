import React from 'react';
import PropTypes from 'prop-types';
import './base.css';
import './func.less';
import * as googleapi from './googleapi';

/* global google:true */

export default class Locpicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      longitude: 0,
      latitude: 0,
      placeProvider: '',
      place: [],
      getPlaceResult: ''
    };
    this.getLoc = this.getLoc.bind(this);
    this.getPlace = this.getPlace.bind(this);
    this.getPlace2 = this.getPlace2.bind(this);
  }

  componentDidMount() {
    if (this.props.googlePlaceApiKey && this.googlePlaceApiKeyInput) {
      this.googlePlaceApiKeyInput.value = this.props.googlePlaceApiKey;
    }
  }

  getLoc() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(`pos: `, pos);
      this.setState({...this.state,
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude,
      });
      // this.getPlace();
    });
  }

  getPlace(radius) {
    if (!this.state.latitude || !this.state.longitude) {
      this.setState({...this.state,
        getPlaceResult: 'No geolocation'
      });
      return;
    }
    radius = this.radiusInput ? parseInt(this.radiusInput.value) : undefined;
    var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    var params = [];
    params.push(`key=${this.googlePlaceApiKeyInput.value}`);
    params.push(`location=${this.state.latitude},${this.state.longitude}`);
    if (radius && radius > 0) {
      params.push(`radius=${radius}`);
    } else if (radius === 0) {
      params.push(`rankby=distance`);
      params.push(`type=restaurant`);
    }
    var aggregate = url;
    if (params && params.length > 0) aggregate += `?${params.join('&')}`;
    console.log('getPlace: ', aggregate);
    fetch(aggregate, {
      method: 'GET',
      mode: 'no-cors'
    }).then(resp => {
      if (resp.ok) return resp.json();
      if (resp.type) {
        this.setState({...this.state,
          getPlaceResult: resp.type
        });
      }
    }).then(jobj => {
      if (!jobj) return;
      this.setState({...this.state,
        placeProvider: 'GApiPlace',
        place: jobj,
        getPlaceResult: 'Ok'
      });
    });
  }

  getPlace2(radius) {
    if (!this.state.latitude || !this.state.longitude) {
      this.setState({...this.state,
        getPlaceResult: 'No geolocation'
      });
      return;
    }
    radius = 500; // this.radiusInput ? parseInt(this.radiusInput.value) : undefined;
    var pyrmont = new google.maps.LatLng(this.state.latitude, this.state.longitude);
    var map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });
    var request = {
      location: pyrmont,
      radius: radius,
      type: ['restaurant']
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (result, status) => {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        this.setState({...this.state,
          getPlaceResult: 'failed'
        });
        return;
      }
      this.setState({...this.state,
        placeProvider: 'GMapApiPlace',
        place: result,
        getPlaceResult: 'Ok'
      });
    });
  }

  render() {
    var geoLocation = (this.state.latitude && this.state.longitude ?
      `Longitude: ${this.state.longitude}, Latitude: ${this.state.latitude}` :
      'N/A');
    var place = [];
    try {
      if (this.state.placeProvider === 'GApiPlace') {
        place = this.state.place.results.map((place, idx) => {
          return (<div key={idx}>
            {place.name} - {place.vicinity}
            <br/>
          </div>);
        });
      } else if (this.state.placeProvider === 'GMapApiPlace') {
        place = this.state.place.map((place, idx) => {
          return (<div key={idx}>
            {place.name} - {place.vicinity}
            <br/>
          </div>);
        });
      }
    } catch (e) {
      console.log(`${e.message}`);
    }

    return (<div>
      <div className='dashed'>
        Geo Location: {geoLocation}<br/>
        <button onClick={this.getLoc}>Get geolocation</button>
      </div>
      <div className='dashed'>
        <label>
          Googke place api key:
          <input type='text' ref={elm => this.googlePlaceApiKeyInput = elm}/>
        </label>
        <br/>
        <label>
          Get place mark by radius:
          <input type='number' ref={elm => this.radiusInput = elm}/>
        </label>
        <br/>
        <button onClick={this.getPlace}>Google place web service</button>
        <button onClick={this.getPlace2}>Google map js client api</button>
        {this.state.getPlaceResult}
        <br/>
        {place}
        <div id="map"/>
      </div>
    </div>);
  }
}

Locpicker.defaultProps = {
  googlePlaceApiKey: googleapi.googlePlaceApiKey
};

Locpicker.propTypes = {
  googlePlaceApiKey: PropTypes.string
};
