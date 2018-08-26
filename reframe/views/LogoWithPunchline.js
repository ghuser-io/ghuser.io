import React from 'react';

import BigLogo from './BigLogo';
import './LogoWithPunchline.css';

const LogoWithPunchline = props => (
  <div className={props.classes}>
    <BigLogo classes="logo-with-punchline"/>
    <p className="punchline mb-5"><b>Better GitHub profiles</b></p>
  </div>
);

export default LogoWithPunchline;
  