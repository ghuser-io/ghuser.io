import React from 'react';

import './Language.css';

const Language = props => (
  <span className="contrib-details language">
    <span style={{backgroundColor: props.color}} className="repo-language-color mr-1"></span>
    {props.name}
  </span>
);

export default Language;
