import React from 'react';

import Logo from './Logo';
import './NavBar.css';
import {urls} from '../ghuser';

class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/"><Logo/></a>
        <a role="button" className="btn btn-dark btn-sm ghuser-on-github" target="_blank"
            href={urls.mainRepo}>
          <i className="fab fa-github"></i> ghuser on GitHub
        </a>
      </nav>
    );
  }
}

export default NavBar;
