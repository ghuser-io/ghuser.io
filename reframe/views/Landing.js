import React from 'react';

import * as db from '../db';
import {urls} from '../ghuser';
import Content from './Content';
import LogoWithPunchline from './LogoWithPunchline';
import NavBar from './NavBar';
import {Bio} from './utils/Bio';
import {Typing} from './utils/Typing'
import PageContent from './PageContent';
import './Landing.css';
import './All.css';
import './Mobile.css';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meta: null,
      featuredUsers: [{
        login: 'AurelienLourot',
      }, {
        login: 'brillout',
      }]
    };
  }

  async componentDidMount() {
    const meta = await (await fetch(`${db.url}/meta.json`)).json();
    this.setState({
      meta,
    });

    const newFeaturedUsers = [...this.state.featuredUsers];
    for (const i in newFeaturedUsers) {
      const userId = newFeaturedUsers[i].login.toLowerCase();
      const userData = await fetch(`${db.url}/users/${userId}.json`);
      newFeaturedUsers[i] = await userData.json();
      this.setState({
        featuredUsers: newFeaturedUsers
      });
    }
  }

  render() {
    const cards = this.state.featuredUsers.filter(user => user.avatar_url).map(user => (
      <div key={user.login} className="card">
        <div className="crop-img">
          <img className="card-img-top" src={user.avatar_url} alt="avatar" />
        </div>
        <div className="card-body">
          <h5 className="card-title">{user.name}</h5>
          <Bio text={user.bio} style={{minHeight: '3em'}}/>
          <a href={user.login} className="btn btn-primary">See this example</a>
        </div>
      </div>
    ));

    return (
      <PageContent>
        <NavBar/>
        <div className="jumbotron">
          <Content>
            <div className="container-lg">
              <LogoWithPunchline classes="landing-logo" /><br />
              <div className="ml-3">
                <p>
                  We love the default GitHub profiles and we want to enhance them.
                  <a href={urls.mainRepo} target="_blank" className="landing-to-github external ml-3">
                    More on GitHub
                  </a>
                  {
                    this.state.meta &&
                    <span className="landing-statistics">
                      <br />
                      We are currently refreshing {this.state.meta.num_contribs}
                      &nbsp;contributions daily on {this.state.meta.num_users} user profiles.
                    </span> || ''
                  }
                </p>
                <a className="btn btn-primary ml-2 mr-4 cta-button" href={urls.oauthEndpoint}
                   role="button">Get your profile</a>
                <a className="ghuser-url-example" href={this.state.featuredUsers[0].login}>
                  {urls.landing}
                  /
                  <Typing
                    texts={[
                      'your-github-username',
                      ...this.state.featuredUsers.map(user => user.login)
                    ]}
                  />
                </a>
              </div>
            </div>
          </Content>
        </div>
        <Content>
          <div className="container-lg landing-examples-container">
            {cards}
            <div className="m-4 made-with-reframe">
              <a href="https://github.com/reframejs/reframe" target="_blank"
                 className="landing-to-reframe external">
                <img src="https://avatars0.githubusercontent.com/u/36308163?v=4" />
                Made with <i className="fa fa-heart"></i> and Reframe
              </a>
            </div>
          </div>
        </Content>
      </PageContent>
    );
  }
}

export default Landing;
