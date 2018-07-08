import React from 'react';
import * as Autolinker from 'autolinker';
import * as Parser from 'html-react-parser';

import './VCardDetails.css';

const VCardDetails = props => {
  const details = [];
  if (props.location) {
    details.push(
      <div className="vcard-detail pt-1" key="location">
        <i className="fas fa-map-marker-alt"></i>&nbsp;
        {props.location}
      </div>
    );
  };

  if (props.blog) {
    details.push(
      <div className="vcard-detail pt-1" key="blog">
        <i className="fas fa-link"></i> {Parser(Autolinker.link(props.blog))}
      </div>
    );
  };

  return (
    <div className={details.length > 0 && 'border-top border-gray-light py-3' || ''}>{details}</div>
  );
};

export default VCardDetails;
