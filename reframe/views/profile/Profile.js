import React from 'react';

import Content from '../Content';
import NavBar from '../NavBar';
import PageContent from '../PageContent';
import '../All.css';

import LeftPanel from './leftpanel/LeftPanel';
import RightPanel from './rightpanel/RightPanel';

const Profile = props => {
  return (
    <PageContent>
      <NavBar/>
      <Content>
        <div className="container container-lg mt-2">
          <div className="row">
            <LeftPanel user={props.user} orgs={props.orgs} />
            <RightPanel username={props.user.login} contribs={props.user.contribs}
                        repos={props.repos} />
          </div>
        </div>
      </Content>
    </PageContent>
  );
};

export default Profile;
