import React from 'react';

import './VCard.css';

const VCard = props => (
  <div className="py-3">
    <h1>
      <div className="vcard-fullname">{props.name}</div>
    </h1>
  </div>
);

export default VCard;
