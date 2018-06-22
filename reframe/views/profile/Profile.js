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
      later: 'later',
    };
  }

  componentDidMount() {
    this.timerId = setTimeout(
      () => this.update(),
      5000,
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  update() {
    this.setState({
      later: 'updated',
    });
  }

  render() {
    return (
      <PageContent>
        <NavBar/>
        <Content>
          <div className="container container-lg">
            <div className="row">
              <LeftPanel/>
              <div className="col-9">Hello {this.props.route.args.name} {this.state.later}</div>
            </div>
          </div>
        </Content>
      </PageContent>
    );
  }
}

export default Profile;
