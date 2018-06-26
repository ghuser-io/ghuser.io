import React from 'react';

import Avatar from './Avatar';
import Bio from './Bio';
import VCard from './VCard';
import VCardDetails from './VCardDetails';

const LeftPanel = props => (
  <div className="col-3 p-0 pr-4">
    <Avatar url={props.user.avatar_url} />
    <VCard login={props.user.login} name={props.user.name} url={props.user.html_url} />
    <Bio text={props.user.bio} />
    <VCardDetails location={props.user.location} blog={props.user.blog} />
  </div>
);

export default LeftPanel;
