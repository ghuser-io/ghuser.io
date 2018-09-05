import React from 'react';

import Content from '../Content';
import NavBar from '../NavBar';
import PageContent from '../PageContent';
import '../All.css';

import LeftPanel from './leftpanel/LeftPanel';
import RightPanel from './rightpanel/RightPanel';
import './Profile.css';
import * as db from './db';
import {urls} from '../../ghuser';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: {
        login: props.username
      },
      contribs: null,
      profilesBeingCreated: []
    };
  }

  async componentDidMount() {
    const userId = this.props.username.toLowerCase();
    try {
      const userData = await fetch(`${db.url}/users/${userId}.json`);
      const user = await userData.json();
      this.setState({ user });

      const contribsData = await fetch(`${db.url}/contribs/${userId}.json`);
      const contribs = await contribsData.json();
      this.setState({ contribs });
    } catch (_) {
      // This profile doesn't exist yet, let's see if it's being created:
      const profilesBeingCreatedData = await fetch(urls.profileQueueEndpoint);
      const profilesBeingCreated = await profilesBeingCreatedData.json();
      this.setState({ profilesBeingCreated });
      for (const profile of profilesBeingCreated) {
        if (profile.login.toLowerCase() === userId) { // profile is being created
          this.setState({
            user: {
              ...this.state.user,
              avatar_url: profile.avatar_url
            }
          });
          break;
        }
      }
    }
    this.setState({ loading: false });
  }

  render() {
    const content = this.state.loading &&
      <div><i className="fas fa-spinner fa-pulse"></i> {this.state.user.login}'s profile</div> ||
      <div className="row">
        <LeftPanel user={this.state.user} contribs={this.state.contribs}
                   orgs={this.props.orgs} />
        <RightPanel username={this.state.user.login}
                    fetchedat={this.state.user.contribs && this.state.user.contribs.fetched_at}
                    contribs={this.state.contribs}
                    deleted_because={this.state.user.ghuser_deleted_because} />
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
