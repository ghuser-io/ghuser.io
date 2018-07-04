import React from 'react';

import AvatarUnknown from './AvatarUnknown.png';
import Bio from './Bio';
import Orgs from './Orgs';
import VCard from './VCard';
import VCardDetails from './VCardDetails';
import './LeftPanel.css';

import Avatar from '../Avatar';

const LeftPanel = props => {
  let stars = 0;
  for (const repo in props.user.contribs && props.user.contribs.repos) {
    const contrib = props.user.contribs.repos[repo];
    stars += contrib.percentage * props.repos[contrib.full_name].stargazers_count / 100;
  }

  return (
    <div className="col-3 p-0 pr-4">
      <Avatar url={props.user.avatar_url || AvatarUnknown} classes="avatar-user" />
      <VCard login={props.user.login} name={props.user.name || 'Your name here'}
             url={props.user.html_url} stars={stars} />
      <Bio text={!props.user.name && "I love coding and I'm about to create my profile on ghuser.io :)" || props.user.bio} />
      <VCardDetails location={props.user.location}
                    blog={!props.user.name && 'https://ghuser.io' || props.user.blog} />
      <Orgs userOrgs={props.user.organizations || []}
            contribOrgs={props.user.contribs && props.user.contribs.organizations || []}
            allOrgs={props.orgs}/>
    </div>
  );
};

export default LeftPanel;
