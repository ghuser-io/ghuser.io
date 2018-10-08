import React from 'react';

import './Orgs.css';
import {withSeparator} from '../css';
import Avatar from '../Avatar';
import * as db from '../../../db';

class Orgs extends React.Component {
  render() {
    const orgAvatar = org => (
      <a key={org.name} href={`https://github.com/${org.name}`} target="_blank" title={org.name}>
        <Avatar url={org.avatarUrl} classes="avatar-org" />
      </a>
    );

    const contributedTo = this.props.orgsData.filter(org => org.avatarUrl).map(org => orgAvatar(org));
    if( contributedTo.length===0 ) {
      return null;
    }

    return (
      <div className={withSeparator('top', 3)}>
        <div key='contributedTo'><h4 className="mb-1">Contributed to</h4>{contributedTo}</div>
      </div>
    );
  }
};

export default Orgs;
