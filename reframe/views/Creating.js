import React from 'react';

import {urls} from '../ghuser';
import Content from './Content';
import NavBar from './NavBar';
import PageContent from './PageContent';
import './All.css';

class Creating extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      //window.location.replace(`/${this.props.username}`);
    }, 5000);
  }

  render() {
    return (
      <PageContent>
        <NavBar/>
        <Content>
          <div className="container container-lg mt-2">
            Sorry, we're overloaded, we had to freeze the <i>profile requests</i> for now.see&nbsp;
            <a href="https://news.ycombinator.com/item?id=17951478" target="_blank" className="external">
              https://news.ycombinator.com/item?id=17951478
            </a>.
          </div>
        </Content>
      </PageContent>
    );
  }
}

export default Creating;
