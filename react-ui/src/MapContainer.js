import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import './MapContainer.css';

export class MapContainer extends Component {

  render() {
    return (
      <Map className={"mapContainer"} google={this.props.google} zoom={14} initialCenter={{ lat: this.props.lat, lng: this.props.lng}}>
        
        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />

      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyAyKupRQtPiJHfUutD2aeWE1WFdnTBd_Jc')
})(MapContainer)