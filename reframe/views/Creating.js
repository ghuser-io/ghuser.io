import React from 'react';

import {urls} from '../ghuser';
import Content from './Content';
import NavBar from './NavBar';
import PageContent from './PageContent';
import './All.css';

class Creating extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      window.location.replace(`/${this.props.username}`);
    }, 5000);
  }

  render() {
    return (
      <PageContent>
        <NavBar/>
        <Content>
          <div className="container container-lg mt-2">
            <i className="fas fa-spinner fa-pulse"></i> {this.props.username}'s profile is being
            created. You'll be redirected to&nbsp;
            <a href={`/${this.props.username}`}>
              {urls.landing}/{this.props.username}
            </a> in a few seconds...
          </div>
        </Content>
      </PageContent>
    );
  }
}

export default Creating;
