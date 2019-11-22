import React, {Component} from 'react';
import { Redirect } from 'react-router'
import './Events.css';
import EventCard from './EventCard';
import MapContainer from './MapContainer.js';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';


const testJson = {
events:[
{eventName: "UCF Party", lat:"28.602427", lng:"-81.20006", startDate:"12/12/19", startTime:"7:00pm", endDate:"12/12/19", endTime:"9:00pm", hostRSO:"", descEvent:"This is an event at 7:00pm"},
{eventName: "Pool Party", lat:"28.3", lng:"-81.006", startDate:"12/2/19", startTime:"2:00pm", endDate:"12/2/19", endTime:"3:00pm", hostRSO:"", descEvent:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla tortor quis neque porta, sit amet facilisis leo consequat. Quisque a fringilla tortor. Vivamus sit amet convallis mi."},
{eventName: "Lecture", lat:"28.602427", lng:"-81.20006", startDate:"12/12/19", startTime:"7:00pm", endDate:"12/12/19", endTime:"9:00pm", hostRSO:"", descEvent:"Pellentesque vulputate consequat blandit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean dictum a magna eget placerat. Cras interdum magna non est finibus ultrices. Quisque eget elementum ex. Vestibulum nec augue vitae velit egestas ornare."},
{eventName: "Protest", lat:"27.902427", lng:"-81.20006", startDate:"12/12/19", startTime:"7:00pm", endDate:"12/12/19", endTime:"9:00pm", hostRSO:"", descEvent:"Protesting for more sleep time"},
{eventName: "Counter Protest", lat:"27.902427", lng:"-81.20006", startDate:"12/12/19", startTime:"7:00pm", endDate:"12/12/19", endTime:"9:00pm", hostRSO:"", descEvent:"Protesting for less sleep time"},
]
};

class EventsView extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      eventList: [],
      viewList: [],
      redirect: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.tryGetEvents = this.tryGetEvents.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.state.eventList = testJson["events"];
    this.state.viewList = this.state.eventList;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleRedirect = () => {
    this.setState({
      redirect: true
    });
  }

  tryGetEvents(e){    
    let postBody = {};   
    
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
        console.log(data);
      })
    })).catch(err => err);
    */
  }

  componentDidMount(){
    this.tryGetEvents();
  }

  render() {

    console.log(this.state.redirect);
    if (this.state.redirect) {
      return <Redirect to='/EventView'/>;
    }

    let events = this.state.viewList.map((item)=> {
      return <Col sm="4" className={"cardCol"} key={item.eventName}><EventCard 
        event={item}
        handleRedirect={this.handleRedirect}
      /></Col>
    })
    return (
    <div className="events">
      <Row>
      {events}
      </Row>
      <Button onClick={this.handleRedirect}>re</Button>
    </div>
  );
}
}

export default EventsView;