import React from 'react';
import Typing from 'react-typing-animation';
import {XmlEntities} from 'html-entities';
import * as Autolinker from 'autolinker';
import * as Parser from 'html-react-parser';

import {urls} from './ghuser';
import Content from './Content';
import LogoWithPunchline from './LogoWithPunchline';
import NavBar from './NavBar';
import PageContent from './PageContent';
import './Landing.css';
import './All.css';

import aurelienlourot from '../../db/data/users/aurelienlourot.json';
import brillout from '../../db/data/users/brillout.json';

class Landing extends React.Component {
  render() {
    const typingText = [];
    for (const str of ['your-github-username', aurelienlourot.login, brillout.login]) {
      typingText.push(<span key={str}>{str}</span>);
      typingText.push(<Typing.Delay key={`${str}-delay`} ms={2000} />);
      typingText.push(<Typing.Backspace key={`${str}-backspace`} count={str.length} />);
    }

    const cards = [aurelienlourot, brillout].map(user => (
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
                  <a href={urls.repo} target="_blank" className="landing-to-github external ml-3">
                    More on GitHub
                  </a>
                </p>
                <a className="btn btn-primary ml-2 mr-4" href={urls.profileRequest}
                   role="button">Get your profile</a>
                <a className="typing" href="AurelienLourot">
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
