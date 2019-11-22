import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Events.css';
import MapContainer from './MapContainer.js';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

class EventView extends Component {
  
  static propTypes = {
    event: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      event: localStorage.getItem('currentEvent')
    }
    this.handleChange = this.handleChange.bind(this);
    this.tryRSOCreate = this.tryRSOCreate.bind(this);
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