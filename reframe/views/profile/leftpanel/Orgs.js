import React from 'react';

import Avatar from './Avatar';
import './Orgs.css';

const Orgs = props => {
  const orgAvatar = org => (
    <a key={org} href={`https://github.com/${org}`} target="_blank">
      <Avatar url={props.allOrgs[org].avatar_url} classes="avatar-org" />
    </a>
  );

  const memberOf = [];
  for (const org of props.userOrgs) {
    memberOf.push(orgAvatar(org));
  }
  const contributedTo = [];
  for (const org of props.contribOrgs) {
    contributedTo.push(orgAvatar(org));
  }

  return (
    <div className="border-top border-gray-light py-3">
        <h4 className="mb-1">Member of</h4>{memberOf}
        <h4 className="mt-4 mb-1">Contributed to</h4>{contributedTo}
    </div>
  );
};

export default Orgs;
