import React from 'react';
import Typing from 'react-typing-animation';
import {XmlEntities} from 'html-entities';
import * as Autolinker from 'autolinker';
import * as Parser from 'html-react-parser';

import * as db from './db';
import {urls} from '../ghuser';
import Content from './Content';
import LogoWithPunchline from './LogoWithPunchline';
import NavBar from './NavBar';
import PageContent from './PageContent';
import './Landing.css';
import './All.css';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      featuredUsers: [{
        login: 'AurelienLourot',
      }, {
        login: 'brillout',
      }]
    };
  }

  async componentDidMount() {
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
    const typingText = [];
    for (const str of ['your-github-username', ...this.state.featuredUsers.map(user => user.login)]) {
      typingText.push(<span key={str}>{str}</span>);
      typingText.push(<Typing.Delay key={`${str}-delay`} ms={2000} />);
      typingText.push(<Typing.Backspace key={`${str}-backspace`} count={str.length} />);
    }

    const cards = this.state.featuredUsers.filter(user => user.avatar_url).map(user => (
      <div key={user.login} className="card">
        <div className="crop-img">
          <img className="card-img-top" src={user.avatar_url} alt="avatar" />
        </div>
        <div className="card-body">
          <h5 className="card-title">{user.name}</h5>
          <p className="card-text">{
            Parser(Autolinker.link((new XmlEntities).encode(user.bio), {
              className: 'external'
            }))
          }</p>
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
                </p>
                <a className="btn btn-primary ml-2 mr-4" href={urls.oauthEndpoint}
                   role="button">Get your profile</a>
                <a className="typing" href={this.state.featuredUsers[0].login}>
                  {urls.landing}/<Typing className="typing" speed={10} loop={true}>{typingText}</Typing>
                </a>
              </div>
            </div>
          </Content>
        </div>
        <Content>
          <div className="container-lg">
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
