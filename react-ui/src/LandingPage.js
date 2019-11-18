import React from 'react';
import './LandingPage.css';
import MapContainer from './MapContainer.js';

function LandingPage() {
  
  return (
    <div className="container">
      <h1>Plan Events, Together.</h1>
      <h3>Find Events, Host Events, Attend Your Choice <br /> Look for Events Near You</h3>
      <MapContainer />
    </div>
  );
}

export default LandingPage;