import React from 'react';

import Logo from './Logo';

import './BigLogo.css';

class BigLogo extends React.Component {
  render() {
    return (
      <div className="big-logo"><Logo/></div>
    );
  }
}

export default BigLogo;
