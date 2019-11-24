import React, { Component } from 'react';
import MapContainer from './MapContainer.js';
import Geocode from "react-geocode";
import './Events.css';
import { Form, FormGroup, Label, Input, ListGroup, ListGroupItem, Button } from 'reactstrap';

Geocode.setApiKey("AIzaSyAyKupRQtPiJHfUutD2aeWE1WFdnTBd_Jc");

var currentComment = {};

class EventView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: JSON.parse(localStorage.getItem('currentEvent')),
      lat: 0,
      lng: 0,
      address: "",
      comments: [],
      commentArea: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.tryGetComments = this.tryGetComments.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.tryLocate = this.tryLocate.bind(this);
    this.state.lat = JSON.parse(this.state.event['eventLocation'])['lat'];
    this.state.lng = JSON.parse(this.state.event['eventLocation'])['lng'];
    this.tryGetComments();
    this.tryLocate();
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  tryGetComments(e) {
    let postBody = {};

    postBody['eventID'] = this.state.event['eventID'];
    postBody['userID'] = localStorage.getItem('userID');
    postBody['sessionID'] = localStorage.getItem('sessionID');

    fetch("/api/events/" + this.state.event['eventID'] + "/comments", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response => {
        response.json().then(data => {
          if (data['error'] === null) {
            this.setState({ comments: data["comments"] });

          }
        })
      })).catch(err => err);
  }

  submitComment(e) {
    let postBody = {};

    postBody['comment'] = this.state.commentArea;
    postBody['event'] = this.state.event['eventID'];
    postBody['userID'] = localStorage.getItem('userID');
    postBody['sessionID'] = localStorage.getItem('sessionID');
    postBody['parent'] = null;
    console.log(JSON.stringify(postBody));

    fetch("/api/comment/create", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody)
    })
      .then((response => {
        response.json().then(data => {
          this.tryGetComments();
        })
      })).catch(err => err);
  }

  tryLocate(e) {

    Geocode.fromLatLng(this.state.lat, this.state.lng).then(
      response => {
        this.setState({ address: response.results[0].formatted_address });
      },
      error => {
        console.error(error);
      }
    );
  }

  render() {

    let comments =
      <ListGroup>{
        this.state.comments.map((item) => {
          if (item['replyTo'] === null) {
            currentComment = item;
            return <ListGroupItem className="comment">
              <h3>{item["createdBy"]}:</h3><p>{item["commentText"]}</p>
              {
                this.state.comments.map((nestedItem) => {
                  if (nestedItem['replyTo'] === currentComment['commentID']) {
                    currentComment = nestedItem;
                    return <ListGroup>
                      <ListGroupItem className="comment">
                      <h3>{nestedItem["createdBy"]}:</h3><p>{nestedItem["commentText"]}</p>
                        {this.state.comments.map((nestedItem) => {
                          if (nestedItem['replyTo'] === currentComment['commentID']) {
                            currentComment = nestedItem;
                            return <ListGroup>
                              <ListGroupItem className="comment">
                              <h3>{nestedItem["createdBy"]}:</h3><p>{nestedItem["commentText"]}</p>

                              </ListGroupItem>
                            </ListGroup>
                          }
                        })
                        }
                      </ListGroupItem>
                    </ListGroup>
                  }
                })
              }
            </ListGroupItem>
          }
        })
      }</ListGroup>


    return (
      <div className="eventView events-container">
        <h1>{this.state.event['eventName']}</h1>
        <h2>{this.state.address}</h2>
        <center><MapContainer lat={this.state.lat} lng={this.state.lng} /></center>
        <div className="events-container">
          <h3 style={{ textAlign: "justify" }}>{this.state.event['eventDescription']}</h3>
        </div>
        <Form className="comment">
          <FormGroup>
          <Label for="commentArea">Comment</Label>
          <Input type="textarea" name="commentArea" id="commentArea" onChange={this.handleChange.bind(this)} />
          <br/>
          <Button className="submit-button" onClick={this.submitComment}>Submit</Button>
          </FormGroup>
        </Form>
        {comments}
      </div>
    );
  }
}

export default EventView;