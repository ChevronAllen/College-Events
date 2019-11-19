import React, {Component} from 'react';
import './Events.css';
import MapContainer from './MapContainer.js';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import urllib from 'url';

class EventCreation extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      nameEvent: "",
      descriptionEvent: "",
      userID: localStorage.getItem('userID') || '',
      apiKey: 'AIzaSyAyKupRQtPiJHfUutD2aeWE1WFdnTBd_Jc',
      lat: 28.602427, // default is ucf
      lng: -81.20006,
      address: '',
      city: '',
      state: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      hostRSO: '',
      private: false,
      repeat:"never"

    }
    this.handleChange = this.handleChange.bind(this);
    this.checkPrivacy = this.checkPrivacy.bind(this);
    this.tryLocate = this.tryLocate.bind(this);
    this.tryRSOCreate = this.tryRSOCreate.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  checkPrivacy(e) {
    let flip = !(this.state.private)
    this.setState({ private: flip});
  }

  tryLocate(e){    
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ this.state.address +',' 
              + this.state.city + ',' + this.state.state + '&key=' + this.state.apiKey;
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then((response => {
      response.json().then(data =>{
        console.log(data['results'][0]['geometry']['location']['lat']);
      })
    })).catch(err => err);
  }

  tryRSOCreate(e){    
    let postBody = {};   
    
    postBody['nameEvent']= this.state.nameEvent;
    postBody['descriptionEvent']= this.state.descriptionEvent;
    postBody['userID']= this.state.userID;
    postBody['lat']= this.state.lat;
    postBody['lng']= this.state.lng;
    postBody['startDate']= this.state.startDate;
    postBody['startTime']= this.state.startTime;
    postBody['endDate']= this.state.endDate;
    postBody['endTime']= this.state.endTime;
    postBody['hostRSO']= this.state.hostRSO;
    postBody['private']= this.state.private;
    postBody['repeat']= this.state.repeat;

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
        console.log(data['results'][0]['geometry']['location']['lat']);
      })
    })).catch(err => err);
    */
  }

  render() {
    return (
    <div className="container">
      <Form>
      <FormGroup>
        <Label for="nameEvent">Name of Event</Label>
        <Input type="text" name="name" id="nameEvent" onChange={this.handleChange.bind(this)} />
      </FormGroup>
      <FormGroup>
        <Label for="address">Address</Label>
        <Input type="text" name="address" id="address" onChange={this.handleChange.bind(this)} />
      </FormGroup>
      <FormGroup>
      <Row form>
        <Col md={8}>
        <Label for="city">City</Label>
        <Input type="text" name="city" id="city" onChange={this.handleChange.bind(this)} />
        </Col>
        <Col md={4}>
        <Label for="state">State</Label>
        <Input type="text" name="state" id="state" onChange={this.handleChange.bind(this)} />
        </Col>
      </Row>
      </FormGroup>
      <FormGroup>
      <Row form>
        <Col md={4}>
        <Label for="startDate">Start Date</Label>
        <Input type="text" name="startDate" id="startDate" onChange={this.handleChange.bind(this)} />
        </Col>
        <Col md={4}>
        <Label for="startTime">Start Time</Label>
        <Input type="text" name="startTime" id="startTime" onChange={this.handleChange.bind(this)} />
        </Col>
      </Row>
      </FormGroup>
      <FormGroup>
      <Row form>
        <Col md={4}>
        <Label for="endDate">End Date</Label>
        <Input type="text" name="endDate" id="endDate" onChange={this.handleChange.bind(this)} />
        </Col>
        <Col md={4}>
        <Label for="endTime">End Time</Label>
        <Input type="text" name="endTime" id="endTime" onChange={this.handleChange.bind(this)} />
        </Col>
      </Row>
      </FormGroup>
      <FormGroup>
        <Label for="hostRSO">RSO Host</Label>
        <Input type="select" name="hostRSO" id="hostRSO" onChange={this.handleChange.bind(this)} >
          <option></option>
          <option>Temp RSO</option>
        </Input>
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input type="checkbox" id='private' checked={this.state.private} onChange={this.checkPrivacy.bind(this)}/>{' '}
          Private
        </Label>
      </FormGroup>
      <FormGroup>
        <Label for="repeat">Repeat Event</Label>
        <Input type="select" name="repeat" id="repeat" onChange={this.handleChange.bind(this)} >
          <option>Never</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="descriptionEvent">Event Description</Label>
        <Input type="textarea" name="description" id="descriptionEvent" onChange={this.handleChange.bind(this)} />
      </FormGroup>
      <Button color="primary" onClick={this.tryRSOCreate}>Submit</Button>
    </Form>
    </div>
  );
}
}

export default EventCreation;