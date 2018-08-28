import React from 'react';

import Logo from './Logo';
import './NavBar.css';
import {urls} from '../ghuser';

class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-lg">
          <a className="navbar-brand" href="/"><Logo/></a>
          <a role="button" className="btn btn-dark btn-sm ghuser-on-github" target="_blank"
             href={urls.repo}>
            <i className="fab fa-github"></i> ghuser on GitHub
          </a>
        </div>
      </nav>
    );
  }
}

export default NavBar;
