import React from 'react';

import Content from '../Content';
import NavBar from '../NavBar';
import PageContent from '../PageContent';
import '../All.css';

import LeftPanel from './leftpanel/LeftPanel';
import RightPanel from './rightpanel/RightPanel';
import './Profile.css';
import assert_internal from 'reassert/internal';

export default Profile;

function Profile(props) {
    const isLoading = props.isServerRendering ? props.doNotRender : true;
    const content = (
      isLoading ? (
        <div><i className="fas fa-spinner fa-pulse"></i> {props.username}'s profile</div>
      ) : (
        <div className="row">
          <LeftPanel user={props.user} contribs={props.contribs}
                     orgsData={props.orgsData} />
          <RightPanel username={props.user.login}
                      fetchedat={props.user.contribs && props.user.contribs.fetched_at}
                      contribs={props.contribs}
                      being_created={props.user.ghuser_being_created}
                      deleted_because={props.user.ghuser_deleted_because}
                      allRepoData={props.allRepoData}
                      profilesBeingCreated={props.profilesBeingCreated} />
        </div>
      )
    );

    return (
      <PageContent>
        <NavBar/>
        <Content>
          <div className="container container-lg mt-2">
            { content }
          </div>
        </Content>
      </PageContent>
    );
}
