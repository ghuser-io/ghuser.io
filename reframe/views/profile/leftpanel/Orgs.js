import React from 'react';

import './Orgs.css';
import {withSeparator} from '../css';
import Avatar from '../Avatar';

const Orgs = props => {
  const orgAvatar = org => (
    <a key={org} href={`https://github.com/${org}`} target="_blank" title={org}>
      <Avatar url={props.allOrgs[org].avatar_url} classes="avatar-org" />
    </a>
  );

  const contributedTo = [];
  for (const org of props.contribOrgs) {
    if (props.allOrgs[org]) {
      contributedTo.push(orgAvatar(org));
    }
  }

  if( contributedTo.length===0 ) {
    return null;
  }

  return (
    <div className={withSeparator('top', 3)}>
      <div key='contributedTo'><h4 className="mb-1">Contributed to</h4>{contributedTo}</div>
    </div>
  );
};

export default Orgs;
