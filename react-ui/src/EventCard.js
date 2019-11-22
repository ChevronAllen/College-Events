import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Geocode from "react-geocode";
import './Events.css';
import EventView from './EventView';
import MapContainer from './MapContainer.js';
import {  Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

Geocode.setApiKey("AIzaSyAyKupRQtPiJHfUutD2aeWE1WFdnTBd_Jc");
Geocode.enableDebug();

class EventCard extends Component {
  
  static propTypes = {
    event: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      event: {},
      userID: localStorage.getItem('userID') || '',
      apiKey: 'AIzaSyAyKupRQtPiJHfUutD2aeWE1WFdnTBd_Jc',
      eventModal: false,
      address: "No Address"
    }
    this.handleChange = this.handleChange.bind(this);
    this.tryRSOCreate = this.tryRSOCreate.bind(this);
    this.tryLocate = this.tryLocate.bind(this);
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

  render() {
    return (
    <div className="eventCard">

      <Card body outline color="info">
          <CardTitle>{this.state.event['eventName']}</CardTitle>
    <CardText>{this.state.event['startDate']}{' at '}{this.state.event['startTime']}</CardText>
          <CardText>{this.state.event['endDate']}{' at '}{this.state.event['endTime']}</CardText>
          <Button onClick={this.toggleEvent}>View</Button>

        </Card>
        <Modal isOpen={this.state.eventModal} toggle={this.toggleEvent} className={"eventModal modal-content-event"} onOpened={this.tryLocate}>
          <ModalHeader toggle={this.toggleEvent} className={"modal-background-event"}>{this.state.event['eventName']}</ModalHeader>
          <ModalBody className={"modal-background-event"}>
            <Row>
            <Col sm='4'>
              Start Time: {this.state.event['startDate']}{' at '}{this.state.event['startTime']}
            </Col>
            <Col sm='4'>
              End Time: {this.state.event['endDate']}{' at '}{this.state.event['endTime']}
            </Col>
            </Row>
            <Row>
            <Col sm='8'>
              {this.state.address}
            </Col>
            </Row>
            <Row>
            <Col sm='12'>
              {this.state.event['descEvent']}
            </Col>
            </Row>
          </ModalBody>
          <ModalFooter className={"modal-background-event"}>
            <Button color="secondary" onClick={this.toggleEvent}>Close</Button>
          </ModalFooter>
        </Modal>
    </div>
  );
}
}

export default EventCard;