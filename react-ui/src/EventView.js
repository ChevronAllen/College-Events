import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Geocode from "react-geocode";
import './Events.css';
import MapContainer from './MapContainer.js';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

Geocode.setApiKey("AIzaSyAyKupRQtPiJHfUutD2aeWE1WFdnTBd_Jc");

class EventView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: localStorage.getItem('currentEvent')
    }
    this.handleChange = this.handleChange.bind(this);
    this.tryRSOCreate = this.tryRSOCreate.bind(this);
    this.tryLocate = this.tryLocate.bind(this);
    console.log(this.state.event);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  tryRSOCreate(e){    
    let postBody = {};   
    
    postBody['nameRSO']= this.state.nameRSO;
    postBody['descriptionRSO']= this.state.descriptionRSO;
    postBody['userID']= this.state.userID;
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
    .then(  (response)=>{
        console.log('success');
    }).catch(err => err);
    */
  }

  tryLocate(e){    

    Geocode.fromLatLng(this.state.event.lat, this.state.event.lng).then(
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
    
    return (
    <div className="eventView">
      {this.state.event}
    </div>
  );
}
}

export default EventView;