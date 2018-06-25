import React from 'react';

import Content from '../Content';
import NavBar from '../NavBar';
import PageContent from '../PageContent';
import '../All.css';

import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

const Profile = props => (
  <PageContent>
    <NavBar/>
    <Content>
      <div className="container container-lg">
        <div className="row">
          <LeftPanel avatar={props.avatar_url} />
          <RightPanel contribs={props.contribs} />
        </div>
      </div>
    </Content>
  </PageContent>
);

export default Profile;
