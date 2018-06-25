import React from 'react';

import './VCard.css';

const VCard = props => (
  <div className="py-3">
    <h1>
      <div className="vcard-fullname">{props.name}</div>
      <div className="vcard-username">
        <a className="vcard-username" href={props.url} target="_blank"><i className="fab fa-github"></i> {props.login}</a>
      </div>
    </h1>
  </div>
);

export default VCard;
