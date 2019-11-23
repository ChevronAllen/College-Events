import React, {Component} from 'react';
import { Redirect } from 'react-router';
import './Events.css';
import EventCard from './EventCard';
import MapContainer from './MapContainer.js';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

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
    
    
    fetch("/api/events", {
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
            this.setState({ eventList: data['events'], viewList: data['events']});
        }
      })
    })).catch(err => err);
    
  }

  componentDidMount(){
    this.tryGetEvents();
  }

  render() {

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
    <div className="events events-container">
      <Row>
      {events}
      </Row>
    </div>
  );
}
}

export default EventsView;