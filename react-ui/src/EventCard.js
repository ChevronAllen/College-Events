import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Events.css';
import EventView from './EventView';
import MapContainer from './MapContainer.js';
import {  Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

class EventCard extends Component {
  
  static propTypes = {
    event: PropTypes.object.isRequired,
    handleRedirect: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      event: {},
      userID: localStorage.getItem('userID') || '',
      eventModal: false,
      address: "No Address"
    }
    this.handleChange = this.handleChange.bind(this);
    this.tryGetEvent = this.tryGetEvent.bind(this);
    this.state.event = this.props.event
    
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  toggleEvent = () => {
    let setToggle = !this.state.eventModal;
    this.setState({ eventModal: setToggle });
  }

  tryGetEvent(e){    
    let postBody = {};   
    
    postBody['userID']= localStorage.getItem('userID');
    postBody['sessionID']= localStorage.getItem('sessionID');
    postBody['eventID']= this.state.event["eventID"];
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

  render() {
    var ds = new Date(this.state.event['eventDateStart']);
    var de = new Date(this.state.event['eventDateStart']);
    return (
    <div className="eventCard" style={{textAlign: "center"}}>

      <Card body outline color="info">
          <CardTitle>{this.state.event['eventName']}</CardTitle>
          <CardText>Start Time:<br/>{ds.toDateString()} At {ds.toLocaleTimeString()}</CardText>
          <CardText>End Time:<br/>{de.toDateString()} At {de.toLocaleTimeString()}</CardText>
          <Button onClick={()=>{
            this.tryGetEvent();
            localStorage.setItem("currentEvent", JSON.stringify(this.state.event));
            this.props.handleRedirect();
            }}>View</Button>

        </Card>
    </div>
  );
}
}

export default EventCard;