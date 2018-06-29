import React from 'react';

import db from '../../db/db.json';

import Content from './Content';
import CreateYourProfile from './CreateYourProfile';
import NavBar from './NavBar';
import PageContent from './PageContent';
import './All.css';

const Landing = () => (
  <PageContent>
    <NavBar/>
    <Content>
      <div className="container-lg">
        <CreateYourProfile />
      </div>
    </Content>
  </PageContent>
);

export default Landing;
