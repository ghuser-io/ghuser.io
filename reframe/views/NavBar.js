import React from 'react';

import './NavBar.css';

class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-lg">
          <a className="navbar-brand" href="/"><b>gh</b>user.io</a>
        </div>
      </nav>
    );
  }
}

export default NavBar;
