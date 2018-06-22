import React from 'react';

import Content from '../Content';
import NavBar from '../NavBar';
import PageContent from '../PageContent';
import '../All.css';

import LeftPanel from './LeftPanel';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  async componentDidMount() {
    const user = await fetch(`/api/0.1/u/${this.props.route.args.name}`);
    const userJson = await user.json();
    this.setState({
      user: userJson,
    });
  }

  render() {
    return (
      <PageContent>
        <NavBar/>
        <Content>
          <div className="container container-lg">
            <div className="row">
              <LeftPanel avatar={this.state.user.avatar} />
              <div className="col-9">Hello {this.state.user.username}</div>
            </div>
          </div>
        </Content>
      </PageContent>
    );
  }
}

export default Profile;
