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
  render() {
  return (
    <div className="App">
      <div className="leftBannerDiv">
          <img id="leftBanner" src={leftBanner} alt=""/>
      </div>
      <Router>
        <div className="centerBody">
          <Navbar className="navBar" dark expand="md">
        <NavbarBrand href="/">Login</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/LandingPage">LandingPage</NavLink>
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
              <Route exact path='/' component={LoginPage} />
              <Route path='/LandingPage' component={LandingPage} />
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
    </div>

  
  );
  }
}

export default App;
