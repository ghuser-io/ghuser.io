import React from 'react';

import Avatar from './Avatar';
import VCard from './VCard';

const LeftPanel = props => (
  <div className="col-3 p-0 pr-3">
    <Avatar url={props.user.avatar_url} />
    <VCard login={props.user.login} name={props.user.name} />
  </div>
);

export default LeftPanel;
