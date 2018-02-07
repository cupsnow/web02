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
      locProvider: '',
      longitude: 0,
      latitude: 0,

      geoCodeProvider: '',
      geoCode: undefined,
      getGeocodeResult: '',

      placeProvider: '',
      place: [],
      getPlaceResult: ''
    };
    this.getLoc = this.getLoc.bind(this);
    this.getPlace = this.getPlace.bind(this);
    this.getPlace2 = this.getPlace2.bind(this);
    this.getGeocode = this.getGeocode.bind(this);
  }

  componentDidMount() {
    if (this.props.googlePlaceApiKey && this.googlePlaceApiKeyInput) {
      this.googlePlaceApiKeyInput.value = this.props.googlePlaceApiKey;
    }
    if (this.props.googleGeocodeApiKey && this.googleGeocodeApiKeyInput) {
      this.googleGeocodeApiKeyInput.value = this.props.googleGeocodeApiKey;
    }
  }

  getLoc1(onLongLati) {
    var callResult = (coords) => {
      let longitude, latitude;
      if (coords && coords.length >= 2) {
        longitude = coords[0];
        latitude = coords[1];
      } else if (coords && coords.longitude !== undefined &&
          coords.latitude !== undefined) {
        longitude = coords.longitude;
        latitude = coords.latitude;
      }
      if (onLongLati) onLongLati(longitude, latitude);
    };
    if (!navigator.geolocation) {
      callResult();
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      callResult(pos.coords);
    }, (/* err */) => {
      // console.log('geolocation: ', err);
      callResult();
    });
  }

  getLoc() {
    this.getLoc1((long, lati) => {
      if (long !== undefined && lati !== undefined) {
        console.log(`longitude: ${long}, latitude: ${lati}`);
        this.setState({...this.state,
          locProvider: 'browser',
          longitude: long,
          latitude: lati,
        });
      }
    });
  }

  decGeo1(longitude, latitude, onGeoCode) {
    const googleGeocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    const googleGeocodeLang = "zh-TW";

    var callResult = function(geoCode) {
      if (onGeoCode) onGeoCode(geoCode);
    };
    var url = googleGeocodeUrl;
    var queries = [];
    queries.push(`latlng=${latitude},${longitude}`);
    queries.push(`key=${this.googleGeocodeApiKeyInput.value}`);
    queries.push(`language=${googleGeocodeLang}`);
    queries.push('result_type=postal_code');
    var aggregate = url;
    if (queries && queries.length > 0) aggregate += `?${queries.join('&')}`;
    fetch(aggregate, {
      method: 'GET',
      mode: 'cors'
    }).then(resp => {
      console.log('geoDecode\n  url: %o\n  resp: %o', aggregate, resp);
      if (resp.ok) return resp.json();
      callResult();
    }).then(jobj => {
      console.log('geoDecode\n  url: %o\n  val: %o', aggregate, jobj);
      try {
        let geoCode = {};
        jobj.results[0].address_components.map((comp, compIdx) => {
          comp.types.map((type, typeIdx) => {
            if (type.includes('postal_code')) geoCode.postal_code = comp.long_name;
            else if (type.includes('administrative_area_level_1')) geoCode.administrative_area_level_1 = comp.long_name;
            else if (type.includes('administrative_area_level_2')) geoCode.administrative_area_level_2 = comp.long_name;
            else if (type.includes('administrative_area_level_3')) geoCode.administrative_area_level_3 = comp.long_name;
            else if (type.includes('country')) geoCode.country = comp.long_name;
          });
        });
        geoCode.geoDecodeProvider = 'GMapApiGeocode';
        console.log('geoCode: %o', geoCode);
        callResult(geoCode);
        return;
      } catch (e) {
        console.log('geoCode: ', e.message);
      }
      callResult();
    });
  }

  getGeocode() {
    if (!this.state.latitude || !this.state.longitude) {
      this.setState({...this.state,
        getGeocodeResult: 'No geolocation'
      });
      return;
    }
    this.decGeo1(this.state.longitude, this.state.latitude, (geoCode) => {
      this.setState({...this.state,
        geoCodeProvider: 'googleGeocode',
        geoCode: geoCode,
        getGeocodeResult: geoCode ? `Ok` : 'failed'
      });
      return;
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
    var queries = [];
    queries.push(`key=${this.googlePlaceApiKeyInput.value}`);
    queries.push(`location=${this.state.latitude},${this.state.longitude}`);
    if (radius && radius > 0) {
      queries.push(`radius=${radius}`);
    } else if (radius === 0) {
      queries.push(`rankby=distance`);
      queries.push(`type=restaurant`);
    }
    var aggregate = url;
    if (queries && queries.length > 0) aggregate += `?${queries.join('&')}`;
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
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
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

    var geoCode = (null);
    try {
      let geoCodeArr = [];
      if (this.state.geoCode.country) {
        geoCodeArr.push(['Country', this.state.geoCode.country]);
      }
      if (this.state.geoCode.postal_code) {
        geoCodeArr.push(['Postal code', this.state.geoCode.postal_code]);
      }
      if (this.state.geoCode.administrative_area_level_1) {
        geoCodeArr.push(['Administrative area level1', this.state.geoCode.administrative_area_level_1]);
      }
      if (this.state.geoCode.administrative_area_level_2) {
        geoCodeArr.push(['Administrative area level2', this.state.geoCode.administrative_area_level_2]);
      }
      if (this.state.geoCode.administrative_area_level_3) {
        geoCodeArr.push(['Administrative area level3', this.state.geoCode.administrative_area_level_3]);
      }
      if (geoCodeArr.length > 0) {
        geoCode = geoCodeArr.map((item, idx) => {
          return (<div key={idx}>
            {item[0]}: {item[1]} <br/>
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
          Googke geocode api key:
          <input type='text' ref={elm => this.googleGeocodeApiKeyInput = elm}/>
        </label>
        <br/>
        <button onClick={this.getGeocode}>Google Geocode</button>
        {this.state.getGeocodeResult}
        <br/>
        {geoCode}
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
  googlePlaceApiKey: googleapi.googlePlaceApiKey,
  googleGeocodeApiKey: googleapi.googleGeocodeApiKey
};

Locpicker.propTypes = {
  googlePlaceApiKey: PropTypes.string,
  googleGeocodeApiKey: PropTypes.string
};
