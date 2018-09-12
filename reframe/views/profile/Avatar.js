import React from 'react';

import './Avatar.css';

const Avatar = ({classes, url}) => (
  <img className={`avatar border border-white rounded ${classes}`} src={url} />
);

export default Avatar;
