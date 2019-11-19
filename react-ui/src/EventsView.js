import React, {Component} from 'react';
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
      viewList: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.tryRSOCreate = this.tryRSOCreate.bind(this);
    this.state.eventList = testJson["events"];
    this.state.viewList = this.state.eventList;
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

  componentDidMount(){
    console.log(localStorage.getItem('userID'));
  }

  render() {
    let events = this.state.viewList.map((item)=> {
      return <Col sm="4" className={"cardCol"} key={item.eventName}><EventCard 
        event={item}
      /></Col>
    })
    return (
    <div className="events">
      <Row>
      {events}
      </Row>
    </div>
  );
}
}

export default EventsView;