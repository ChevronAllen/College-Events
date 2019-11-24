import React, {Component} from 'react';
import './RSOCreation.css';
import MapContainer from './MapContainer.js';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class RSOCreation extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      nameRSO: "",
      descriptionRSO: "",
      userID: localStorage.getItem('userID') || ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.tryRSOCreate = this.tryRSOCreate.bind(this);
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
    postBody['userID'] = localStorage.getItem('userID');
    postBody['sessionID'] = localStorage.getItem('sessionID');
    
    console.log(JSON.stringify(postBody)); 
    
    
    fetch('/api/rso/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody) 
    })
    .then(  (response)=>{
        console.log('success');
        console.log(response);
    }).catch(err => err);
    
  }

  componentDidMount(){
    console.log(localStorage.getItem('userID'));
  }

  render() {
    return (
    <div className="container">
      <Form>
      <FormGroup>
        <Label for="nameRSO">Name of RSO</Label>
        <Input type="text" name="name" id="nameRSO" onChange={this.handleChange.bind(this)} />
      </FormGroup>
      <FormGroup>
        <Label for="descriptionRSO">description</Label>
        <Input type="textarea" name="description" id="descriptionRSO" onChange={this.handleChange.bind(this)} />
      </FormGroup>
      <Button color="primary" onClick={this.tryRSOCreate}>Submit</Button>
    </Form>
    </div>
  );
}
}

export default RSOCreation;