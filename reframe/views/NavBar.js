import React from 'react';

import Logo from './Logo';
import './NavBar.css';

class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-lg">
          <a className="navbar-brand" href="/"><Logo/></a>
        </div>
      </nav>
    );
  }
}

export default NavBar;
