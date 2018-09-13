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
          <a className="vcard-username-login mr-3" href={props.url} target="_blank"><i className="fab fa-github"></i> {props.login}</a>
          {stars >= 1 && <span className="vcard-stars"><span className="earned-stars-text-color">★</span> {bigNum(stars)}</span>}
        </div>
      </h1>
    </div>
  );
};

export default VCard;
