import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input } from 'reactstrap';
import { Redirect } from 'react-router';
import './Modal.css';

const md5 = require('md5');

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      redirect: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.tryLogin = this.tryLogin.bind(this);
    this.tryRegister = this.tryRegister.bind(this);
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


  // API post format for react
  tryLogin(e) {    
    let postBody = {};   
    
    postBody['email']   = this.state.email; 
    postBody['password']= md5(this.state.password) ;
    console.log(JSON.stringify(postBody));
    
    fetch("/api/login", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody)
    })
    .then((response => {
      response.json().then(data =>{
        localStorage.setItem('userID', data['userID']);
        localStorage.setItem('sessionID', data['sessionID']);
        this.setState({ loginModal: false });
        this.handleRedirect();
      })
    })).catch(err => err);
    
  }

  tryRegister(e){    
    let postBody = {};   
    
    postBody['email']   = this.state.email; 
    postBody['password']= md5(this.state.password) ;
    console.log(JSON.stringify(postBody));
    
    
    fetch("/api/register", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody)
    })
    .then((response => {
      response.json().then(data =>{
        localStorage.setItem('userID', data['userID']);
        localStorage.setItem('sessionID', data['sessionID']);
        this.setState({ registerModal: false });
        this.handleRedirect();
      })
    })
    ).catch(err => err);
      
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to='/'/>;
    }

    return (
      <div>
        <Modal isOpen={this.props.loginModal} toggle={this.props.toggleLogin} className={"LoginModal"}>
          <ModalHeader toggle={this.props.toggleLogin} className={"modal-background"}>Login</ModalHeader>
          <ModalBody className={"modal-background"}>
            <Form>
              <FormGroup row className={"d-flex justify-content-center"}>
                <Col sm={10}>
                  <Input type="email" name="email" id="email" placeholder="Email" onChange={this.handleChange.bind(this)} />
                </Col>
              </FormGroup>
              <FormGroup row className={"d-flex justify-content-center"}>
                <Col sm={10}>
                  <Input type="password" name="password" id="password" placeholder="Password" onChange={this.handleChange.bind(this)} />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter className={"modal-background"}>
            <Button color="primary" onClick={this.props.toggleRegister} className={"mr-auto"} >Register</Button>
            <Button color="primary" onClick={this.tryLogin}>Login</Button>{' '}
            <Button color="secondary" onClick={this.props.toggleLogin}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.props.registerModal} toggle={this.props.toggleRegister} className={"LoginModal"}>
          <ModalHeader toggle={this.props.toggleRegister} className={"modal-background"}>Registration</ModalHeader>
          <ModalBody className={"modal-background"}>
            <Form>
              <FormGroup row className={"d-flex justify-content-center"}>
                <Col sm={10}>
                  <Input type="email" name="email" id="email" placeholder="Email" onChange={this.handleChange.bind(this)} />
                </Col>
              </FormGroup>
              <FormGroup row className={"d-flex justify-content-center"}>
                <Col sm={10}>
                  <Input type="password" name="password" id="password" placeholder="Password" onChange={this.handleChange.bind(this)} />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter className={"modal-background"}>
            <Button color="primary" onClick={this.props.toggleLogin} className={"mr-auto"} >Login</Button>
            <Button color="primary" onClick={this.tryRegister}>Register</Button>{' '}
            <Button color="secondary" onClick={this.props.toggleRegister}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default LoginPage;