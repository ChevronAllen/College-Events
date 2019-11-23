import React, {Component} from 'react';
import MapContainer from './MapContainer.js';
import Geocode from "react-geocode";
import './Events.css';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

Geocode.setApiKey("AIzaSyAyKupRQtPiJHfUutD2aeWE1WFdnTBd_Jc");

class EventView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: JSON.parse(localStorage.getItem('currentEvent')),
      lat: 0,
      lng: 0,
      address: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.tryGetComments = this.tryGetComments.bind(this);
    this.tryLocate = this.tryLocate.bind(this);
    this.state.lat = JSON.parse(this.state.event['eventLocation'])['lat'];
    this.state.lng = JSON.parse(this.state.event['eventLocation'])['lng'];
    this.tryGetComments();
    this.tryLocate();
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  tryGetComments(e){    
    let postBody = {};   
    
    postBody['eventID']= this.state.event['eventID'];
    postBody['userID']= localStorage.getItem('userID');
    postBody['sessionID']= localStorage.getItem('sessionID');
    console.log(JSON.stringify(postBody));
    
    /*
    fetch("/api/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody)
    })
    .then((response => {
      response.json().then(data =>{
        if(data['error'] === null)
        {
            console.log(data);
        }
      })
    })).catch(err => err);
    */
  }

  tryLocate(e){    

    Geocode.fromLatLng(this.state.lat, this.state.lng).then(
      response => {
        this.setState({address:response.results[0].formatted_address});
      },
      error => {
        console.error(error);
      }
    );
  }

  componentDidMount(){
    console.log(localStorage.getItem('userID'));
  }

  render() {
    console.log(this.state.event);
    return (
    <div className="eventView events-container">
      <h1>{this.state.event['eventName']}</h1>
      <h2>{this.state.address}</h2>
      <center><MapContainer  lat={this.state.lat} lng={this.state.lng}/></center>
      <div className="events-container">
      <h3 style={{textAlign: "justify"}}>{this.state.event['eventDescription']}</h3>
      </div>
    </div>
  );
}
}

export default EventView;