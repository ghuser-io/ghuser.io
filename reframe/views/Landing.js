import React from 'react';

import db from '../../db/db.json';

import Content from './Content';
import NavBar from './NavBar';
import PageContent from './PageContent';
import './All.css';

const Landing = props => {
  const profiles = [];
  for (const user in db.users) {
    profiles.push(
      <li key={user}><a href={user}>ghuser.io/{user}</a></li>
    );
  }

  return (
    <PageContent>
      <NavBar/>
      <Content>
        <div className="container-lg">
          <p>Work in progress...</p>
          <p>ghuser.io - Better GitHub profiles</p>
          <p>Serving {Object.keys(db.users).length} profiles:</p>
          <ul>{profiles}</ul>
          <p><a href="https://github.com/AurelienLourot/ghuser.io">AurelienLourot/ghuser.io</a></p>
          <p>Made with <a href="https://github.com/reframejs/reframe">Reframe</a></p>
        </div>
      </Content>
    </PageContent>
  );
};

export default Landing;
