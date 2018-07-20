import React from 'react';

import Content from '../Content';
import NavBar from '../NavBar';
import PageContent from '../PageContent';
import '../All.css';

import LeftPanel from './leftpanel/LeftPanel';
import RightPanel from './rightpanel/RightPanel';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: {
        login: props.username
      },
      contribs: null
    };
  }

  async componentDidMount() {
    try {
      const githubRef = 'master';
      const userId = this.props.username.toLowerCase();
      const userData = await fetch(`https://rawgit.com/AurelienLourot/ghuser.io/${githubRef}/db/data/users/${userId}.json`);
      const user = await userData.json();
      this.setState({ user });

      const contribsData = await fetch(`https://rawgit.com/AurelienLourot/ghuser.io/${githubRef}/db/data/contribs/${userId}.json`);
      const contribs = await contribsData.json();
      this.setState({ contribs });
    } catch (_) {}
    this.setState({ loading: false });
  }

  render() {
    const content = this.state.loading &&
      <div><i className="fas fa-spinner fa-pulse"></i> {this.state.user.login}'s profile</div> ||
      <div className="row">
        <LeftPanel user={this.state.user} contribs={this.state.contribs}
                   orgs={this.props.orgs} repos={this.props.repos} />
        <RightPanel username={this.state.user.login}
                    fetchedat={this.state.user.contribs && this.state.user.contribs.fetched_at}
                    contribs={this.state.contribs} repos={this.props.repos}
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
