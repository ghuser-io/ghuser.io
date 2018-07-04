import React from 'react';
import * as url from 'url';

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
    let blogUrl = url.parse(props.blog);
    if (!blogUrl.protocol) {
      blogUrl = url.parse(`http://${props.blog}`);
    }
    const urlWithoutProtol = `${blogUrl.host}${blogUrl.path}`.replace(/\/$/, '');

    details.push(
      <div className="vcard-detail pt-1" key="blog">
        <i className="fas fa-link"></i>&nbsp;
        <a href={blogUrl.href} target="_blank">{urlWithoutProtol}</a>
      </div>
    );
  };

  return (
    <div className="border-top border-gray-light py-3">{details}</div>
  );
};

export default VCardDetails;
