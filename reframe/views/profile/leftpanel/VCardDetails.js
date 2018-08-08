import React from 'react';
import * as Autolinker from 'autolinker';
import * as Parser from 'html-react-parser';

import AddSettings from '../AddSettings';
import './VCardDetails.css';

const VCardDetails = props => {
  const addSettings = !props.settings &&
          <AddSettings href="https://github.com/AurelienLourot/ghuser.io/blob/master/docs/user-settings.md"
                       title="Add a link" classes="ml-2" />;

  const details = [];
  if (props.location) {
    details.push(
      <div className="vcard-detail pt-1" key="location">
        <i className="vcard-icon fas fa-map-marker-alt"></i>&nbsp;
        {props.location}
        {!props.email && !props.blog && !props.gist_username && addSettings}
      </div>
    );
  };

  if (props.email) {
    details.push(
      <div className="vcard-detail pt-1" key="email">
        <i className="vcard-icon far fa-envelope"></i> {Parser(Autolinker.link(props.email))}
        {!props.blog && !props.gist_username && addSettings}
      </div>
    );
  };

  if (props.blog) {
    details.push(
      <div className="vcard-detail pt-1" key="blog">
        <i className="vcard-icon fas fa-link"></i> {Parser(Autolinker.link(props.blog, {
          className: 'external'
        }))}
        {!props.gist_username && addSettings}
      </div>
    );
  };

  if (props.settings) {
    if (props.settings.twitter_username) {
      details.push(
        <div className="vcard-detail pt-1" key="twitter">
          <i className="vcard-icon fab fa-twitter"></i>&nbsp;
          <a href={`https://twitter.com/${props.settings.twitter_username}`} target="_blank"
             className="external">@{props.settings.twitter_username}</a>
        </div>
      );
    }
    if (props.settings.reddit_username) {
      details.push(
        <div className="vcard-detail pt-1" key="reddit">
          <i className="vcard-icon fab fa-reddit-alien"></i>&nbsp;
          <a href={`https://reddit.com/user/${props.settings.reddit_username}`} target="_blank"
             className="external">u/{props.settings.reddit_username}</a>
        </div>
      );
    }
    if (props.settings.linkedin_id) {
      details.push(
        <div className="vcard-detail pt-1" key="linkedin">
          <i className="vcard-icon fab fa-linkedin"></i>&nbsp;
          <a href={`https://linkedin.com/in/${props.settings.linkedin_id}`} target="_blank"
             className="external">LinkedIn</a>
        </div>
      );
    }
    if (props.settings.stackoverflow_id) {
      details.push(
        <div className="vcard-detail pt-1" key="stackoverflow">
          <i className="vcard-icon fab fa-stack-overflow"></i>&nbsp;
          <a href={`https://stackoverflow.com/users/${props.settings.stackoverflow_id}`}
             target="_blank" className="external">StackOverflow</a>
        </div>
      );
    }
  };

  if (props.gist_username) {
    details.push(
      <div className="vcard-detail pt-1" key="gist">
        <i className="vcard-icon fab fa-github"></i>&nbsp;
        <a href={`https://gist.github.com/${props.gist_username}`} target="_blank"
           className="external">GitHubGist</a>
        {addSettings}
      </div>
    );
  }

  return (
    <div className={details.length > 0 && 'border-top border-gray-light py-3' || ''}>{details}</div>
  );
};

export default VCardDetails;
