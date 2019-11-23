import React, {Component} from 'react';
import './Events.css';
import MapContainer from './MapContainer.js';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import urllib from 'url';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyAyKupRQtPiJHfUutD2aeWE1WFdnTBd_Jc");

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
      startTime: '00:00',
      endDate: '',
      endTime: '00:00',
      hostRSO: '',
      private: false,
      repeat:"never"

    }
    this.handleChange = this.handleChange.bind(this);
    this.checkPrivacy = this.checkPrivacy.bind(this);
    this.tryLocate = this.tryLocate.bind(this);
    this.tryEventCreate = this.tryEventCreate.bind(this);
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

  tryEventCreate(e){    
    let postBody = {};   

    let ds = this.state.startDate + ' ' + this.state.startTime + ':00';
    let de = this.state.endDate + ' ' + this.state.endTime + ':00';

    let location = {}

    Geocode.fromAddress(this.state.address + ' ' + this.state.city + ' ' + this.state.state).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
        location['lat'] = lat;
        location['lng'] = lng;
        console.log(location);
        postBody['userID']= localStorage.getItem('userID');
        postBody['sessionID']= localStorage.getItem('sessionID');
        postBody['nameEvent']= this.state.nameEvent;
        postBody['descriptionEvent']= this.state.descriptionEvent;
        postBody['userID']= this.state.userID;
        postBody['location']= location;
        postBody['startDate']= ds;
        postBody['endDate']= de;
        postBody['hostRSO']= this.state.hostRSO;
        postBody['private']= this.state.private;
        postBody['repeat']= this.state.repeat;
        console.log(JSON.stringify(postBody));

        fetch("/api/events/create", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postBody)
        }).then(  (response)=>{
          console.log('success');
          console.log(response);
        }).catch(err => err);
      },
      error => {
        console.error(error);
      }
    );
  }

  render() {

    var stateList = 
    <Input type="select" name="state" id="state" onChange={this.handleChange.bind(this)} >
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    <option value="AR">Arkansas</option>
    <option value="CA">California</option>
    <option value="CO">Colorado</option>
    <option value="CT">Connecticut</option>
    <option value="DE">Delaware</option>
    <option value="DC">District Of Columbia</option>
    <option value="FL">Florida</option>
    <option value="GA">Georgia</option>
    <option value="HI">Hawaii</option>
    <option value="ID">Idaho</option>
    <option value="IL">Illinois</option>
    <option value="IN">Indiana</option>
    <option value="IA">Iowa</option>
    <option value="KS">Kansas</option>
    <option value="KY">Kentucky</option>
    <option value="LA">Louisiana</option>
    <option value="ME">Maine</option>
    <option value="MD">Maryland</option>
    <option value="MA">Massachusetts</option>
    <option value="MI">Michigan</option>
    <option value="MN">Minnesota</option>
    <option value="MS">Mississippi</option>
    <option value="MO">Missouri</option>
    <option value="MT">Montana</option>
    <option value="NE">Nebraska</option>
    <option value="NV">Nevada</option>
    <option value="NH">New Hampshire</option>
    <option value="NJ">New Jersey</option>
    <option value="NM">New Mexico</option>
    <option value="NY">New York</option>
    <option value="NC">North Carolina</option>
    <option value="ND">North Dakota</option>
    <option value="OH">Ohio</option>
    <option value="OK">Oklahoma</option>
    <option value="OR">Oregon</option>
    <option value="PA">Pennsylvania</option>
    <option value="RI">Rhode Island</option>
    <option value="SC">South Carolina</option>
    <option value="SD">South Dakota</option>
    <option value="TN">Tennessee</option>
    <option value="TX">Texas</option>
    <option value="UT">Utah</option>
    <option value="VT">Vermont</option>
    <option value="VA">Virginia</option>
    <option value="WA">Washington</option>
    <option value="WV">West Virginia</option>
    <option value="WI">Wisconsin</option>
    <option value="WY">Wyoming</option>
    </Input>				

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
         {stateList}
        </Col>
      </Row>
      </FormGroup>
      <FormGroup>
      <Row form>
        <Col md={4}>
        <Label for="startDate">Start Date</Label>
        <Input type="date" name="startDate" id="startDate" onChange={this.handleChange.bind(this)} />
        </Col>
        <Col md={4}>
        <Label for="startTime">Start Time</Label>
        <Input type="time" name="startTime" id="startTime" defaultValue="00:00" onChange={this.handleChange.bind(this)} />
        </Col>
      </Row>
      </FormGroup>
      <FormGroup>
      <Row form>
        <Col md={4}>
        <Label for="endDate">End Date</Label>
        <Input type="date" name="endDate" id="endDate" onChange={this.handleChange.bind(this)} />
        </Col>
        <Col md={4}>
        <Label for="endTime">End Time</Label>
        <Input type="time" name="endTime" id="endTime" defaultValue="00:00" onChange={this.handleChange.bind(this)} />
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
      <Button color="primary" onClick={this.tryEventCreate}>Submit</Button>
    </Form>
    </div>
  );
}
}

export default EventCreation;