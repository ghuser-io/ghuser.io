import React from 'react';

import './Avatar.css';

const Avatar = props => (
  <img className={`avatar border border-white rounded ${props.classes}`} src={props.url} />
);

export default Avatar;
