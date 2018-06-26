import React from 'react';

import Bio from './Bio';
import Orgs from './Orgs';
import VCard from './VCard';
import VCardDetails from './VCardDetails';
import './LeftPanel.css';

import Avatar from '../Avatar';

const LeftPanel = props => (
  <div className="col-3 p-0 pr-4">
    <Avatar url={props.user.avatar_url} classes="avatar-user" />
    <VCard login={props.user.login} name={props.user.name} url={props.user.html_url} />
    <Bio text={props.user.bio} />
    <VCardDetails location={props.user.location} blog={props.user.blog} />
    <Orgs userOrgs={props.user.organizations} contribOrgs={props.user.contribs.organizations} allOrgs={props.orgs}/>
  </div>
);

export default LeftPanel;
