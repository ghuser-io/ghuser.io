import React from 'react';

import Logo from './Logo';

import './BigLogo.css';

const BigLogo = props => {
  return (
    <div className={`big-logo ${props.classes}`}><Logo/></div>
  );
};

export default BigLogo;
