import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input } from 'reactstrap';
import './Modal.css';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loginToggle: "",
      loginModal: false,
      registerModal: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
    this.toggleRegister = this.toggleRegister.bind(this);
    this.tryLogin = this.tryLogin.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  toggleLogin = () => {
    let setToggle = !this.state.loginModal;
    this.setState({ loginModal: setToggle, registerModal: false, email: "", password: "" });
  }

  toggleRegister = () => {
    let setToggle = !this.state.registerModal;
    this.setState({ registerModal: setToggle, loginModal: false, email: "", password: "" });
  }

  // API post format for react
  tryLogin(e) {
    let postBody = { email: this.state.email, password: this.state.password }
    fetch("/loginAPI", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody)
    })
      .then((response => {
        response.json().then(data => {
          console.log("success?");
        });
      })
      ).catch(err => err);
  }

  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toggleLogin}>Login</Button>
        <Button color="danger" onClick={this.toggleRegister}>Register</Button>

        <Modal isOpen={this.state.loginModal} toggle={this.toggleLogin} className={"LoginModal"}>
          <ModalHeader toggle={this.toggleLogin} className={"modal-background"}>Login</ModalHeader>
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
            <Button color="primary" onClick={this.toggleRegister} className={"mr-auto"} >Register</Button>
            <Button color="primary" onClick={this.tryLogin}>Login</Button>{' '}
            <Button color="secondary" onClick={this.toggleLogin}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.registerModal} toggle={this.toggleRegister} className={"LoginModal"}>
          <ModalHeader toggle={this.toggleRegister} className={"modal-background"}>Registration</ModalHeader>
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
            <Button color="primary" onClick={this.toggleLogin} className={"mr-auto"} >Login</Button>
            <Button color="primary" onClick={this.tryLogin}>Register</Button>{' '}
            <Button color="secondary" onClick={this.toggleRegister}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default LoginPage;