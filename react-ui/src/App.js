import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink,} from 'reactstrap';
import './App.css';
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';
import AdminPage from './AdminPage';
import RSOCreation from './RSOCreation';
import EventCreation from './EventCreation';
import EventsView from './EventsView';
import EventView from './EventView';
import leftBanner from "./Images/LeftBanner.jpg"
import rightBanner from "./Images/RightBanner.jpg"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModal: false,
      registerModal: false
    }

    this.toggleLogin = this.toggleLogin.bind(this);
    this.toggleRegister = this.toggleRegister.bind(this);
  }

  toggleLogin = () => {
    let setToggle = !this.state.loginModal;
    this.setState({ loginModal: setToggle, registerModal: false, email: "", password: "" });
  }

  toggleRegister = () => {
    let setToggle = !this.state.registerModal;
    this.setState({ registerModal: setToggle, loginModal: false, email: "", password: "" });
  }

  render() {
  return (
    <div className="App">
      <div className="leftBannerDiv">
          <img id="leftBanner" src={leftBanner} alt=""/>
      </div>
      <Router>
        <div className="centerBody">
          <Navbar className="navBar" dark expand="md">
        <NavbarBrand href="/">Home</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <div className="nav-link" style={{cursor: "pointer"}} onClick={this.toggleLogin}>Login</div>
            </NavItem>
            <NavItem>
              <NavLink href="/AdminPage">AdminPage</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/RSOCreation">Create RSO</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/EventCreation">Create Event</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/EventsView">View Events</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
          <Switch>
              <Route exact path='/' component={LandingPage} />
              <Route path='/AdminPage' component={AdminPage} />
              <Route path='/RSOCreation' component={RSOCreation} />
              <Route path='/EventCreation' component={EventCreation} />
              <Route path='/EventsView' component={EventsView} />
              <Route path='/EventView' component={EventView} />
          </Switch>
        </div>
      </Router>
      <div className="rightBannerDiv">
        <img id="rightBanner" src={rightBanner} alt=""/>
      </div>
      <LoginPage 
        loginModal = {this.state.loginModal}
        registerModal = {this.state.registerModal}
        toggleLogin = {this.toggleLogin}
        toggleRegister = {this.toggleRegister}
      />
    </div>
  );
  }
}

export default App;
