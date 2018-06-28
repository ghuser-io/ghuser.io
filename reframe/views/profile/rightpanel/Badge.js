import React from 'react';

const Badge = props => (
  <span className={`badge ml-1 mb-2 ${props.classes}`} title={props.tooltip}>{props.text}</span>
);

export default Badge;
