import React from 'react';

import './VCard.css';
import {bigNum} from '../numbers';

const VCard = props => (
  <div className="py-3">
    <h1>
      <div className="vcard-fullname">{props.name}</div>
      <div className="vcard-username">
        <a className="vcard-username-login mr-3" href={props.url} target="_blank"><i className="fab fa-github"></i> {props.login}</a>
        <Stars {...props}/>
      </div>
    </h1>
  </div>
);

const Stars = ({stars}) => {
  stars = Math.round(stars);
  if( stars < 1 ) {
    return null;
  }
  return (
    <span className="vcard-stars">
      <span className="earned-stars-icon-color">★</span>
      <span className="earned-stars-text-color">{bigNum(stars)}</span>
    </span>
  );
};

export default VCard;
