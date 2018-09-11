import React from 'react';

import {urls} from '../ghuser';
import Content from './Content';
import NavBar from './NavBar';
import PageContent from './PageContent';
import './All.css';

class Creating extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      // temporarily disabled for issue143: window.location.replace(`/${this.props.username}`);
    }, 5000);
  }

  render() {
    return (
      <PageContent>
        <NavBar/>
        <Content>
          <div className="container container-lg mt-2">
            <!-- temporarily disabled for issue143
            <i className="fas fa-spinner fa-pulse"></i> {this.props.username}'s profile is being
            created. You'll be redirected to&nbsp;
            <a href={`/${this.props.username}`}>
              {urls.landing}/{this.props.username}
            </a> in a few seconds...-->
            Sorry, we're overloaded, we had to freeze the <i>profile requests</i> for now. See&nbsp;
            <a href="https://github.com/AurelienLourot/ghuser.io/issues/143" target="_blank" className="external">
              #143
            </a>.
          </div>
        </Content>
      </PageContent>
    );
  }
}

export default Creating;
