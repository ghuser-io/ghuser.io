import React from 'react';

import Content from './Content';
import NavBar from './NavBar';
import PageContent from './PageContent';
import './All.css';

class Landing extends React.Component {
  render() {
    return (
      <PageContent>
        <NavBar/>
        <Content>
          <div className="container-lg">
            <p>Work in progress...</p>
            <p>ghuser.io - Better GitHub profiles.</p>
            <p><a href="https://github.com/AurelienLourot/ghuser.io">AurelienLourot/ghuser.io</a></p>
            <p>Made with <a href="https://github.com/reframejs/reframe">Reframe</a></p>
          </div>
        </Content>
      </PageContent>
    );
  }
}

export default Landing;
