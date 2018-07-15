import React from 'react';

import './VCard.css';
import {bigNum} from '../numbers';

const VCard = props => {
  const stars = Math.round(props.stars);

  return (
    <div className="py-3">
      <h1>
        <div className="vcard-fullname">{props.name}</div>
        <div className="vcard-username">
          <a className="vcard-github-login" href={props.url} target="_blank"><i className="fab fa-github"></i> {props.login}</a>
          {stars >= 1 && <span className="vcard-stars ml-3">★{bigNum(stars)}</span>}
        </div>
      </h1>
    </div>
  );
};

export default VCard;
