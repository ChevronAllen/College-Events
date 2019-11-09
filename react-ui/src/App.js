import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink,} from 'reactstrap';
import './App.css';
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';
import AdminPage from './AdminPage';

class App extends Component {
  render() {
  return (
    <div className="App">
      <Router>
        <div>
          <Navbar color="light" light expand="md">
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
          </Nav>
        </Navbar>
          <Switch>
              <Route exact path='/' component={LoginPage} />
              <Route path='/LandingPage' component={LandingPage} />
              <Route path='/AdminPage' component={AdminPage} />
          </Switch>
        </div>
      </Router>
    </div>
  );
  }
}

export default App;
