import React from 'react';

import Content from '../Content';
import NavBar from '../NavBar';
import PageContent from '../PageContent';
import '../All.css';

import LeftPanel from './LeftPanel';

class Profile extends React.Component {
  render() {
    return (
      <PageContent>
        <NavBar/>
        <Content>
          <div className="container container-lg">
            <div className="row">
              <LeftPanel avatar={this.props.avatar_url} />
              <div className="col-9">Hello {this.props.login}</div>
            </div>
          </div>
        </Content>
      </PageContent>
    );
  }
}

export default Profile;
