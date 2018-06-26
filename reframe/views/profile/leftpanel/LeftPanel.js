import React from 'react';

import Avatar from './Avatar';
import Bio from './Bio';
import VCard from './VCard';

const LeftPanel = props => (
  <div className="col-3 p-0 pr-4">
    <Avatar url={props.user.avatar_url} />
    <VCard login={props.user.login} name={props.user.name} url={props.user.html_url} />
    <Bio text={props.user.bio} />
  </div>
);

export default LeftPanel;
