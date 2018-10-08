import React from 'react';

import Content from '../Content';
import NavBar from '../NavBar';
import PageContent from '../PageContent';
import '../All.css';

import LeftPanel from './leftpanel/LeftPanel';
import RightPanel from './rightpanel/RightPanel';
import './Profile.css';
import * as db from '../../db';
import {urls} from '../../ghuser';
import assert_internal from 'reassert/internal';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.isServerRendering ? this.props.doNotRender : true,
      user: {
        login: props.username
      },
      contribs: null,
      profilesBeingCreated: []
    };
  }

  async componentDidMount() {
    assert_internal(!this.props.isServerRendering);
    assert_internal(!this.props.doNotRender);
    if( this.props.profileDoesNotExist ) {
      // This profile doesn't exist yet, let's see if it's being created:
      const profilesBeingCreatedData = await fetch(urls.profileQueueEndpoint);
      const profilesBeingCreated = await profilesBeingCreatedData.json();
      this.setState({ profilesBeingCreated });
      for (const profile of profilesBeingCreated) {
        if (profile.login.toLowerCase() === userId) { // profile is being created
          this.setState({
            user: {
              ...this.state.user,
              avatar_url: profile.avatar_url,
              ghuser_being_created: true
            }
          });
          break;
        }
      }
    }
    if( this.state.loading ) {
      this.setState({ loading: false });
    }
  }

  render() {
    assert_internal(!this.props.isServerRendering || !this.props.doNotRender || this.state.loading);
    assert_internal(this.state.loading || this.props.orgsData);
    const content = this.state.loading &&
      <div><i className="fas fa-spinner fa-pulse"></i> {this.props.username}'s profile</div> ||
      <div className="row">
        <LeftPanel user={this.props.user} contribs={this.props.contribs}
                   orgsData={this.props.orgsData} />
        <RightPanel username={this.props.user.login}
                    fetchedat={this.props.user.contribs && this.props.user.contribs.fetched_at}
                    contribs={this.props.contribs}
                    being_created={this.props.user.ghuser_being_created}
                    deleted_because={this.props.user.ghuser_deleted_because}
                    allRepoData={this.props.allRepoData}
                    profilesBeingCreated={this.state.profilesBeingCreated} />
      </div>;

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
}

export default Profile;
