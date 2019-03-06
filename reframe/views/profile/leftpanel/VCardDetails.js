import React from 'react';
import * as Autolinker from 'autolinker';
import * as Parser from 'html-react-parser';

import {withSeparator} from '../css';
import {urls} from '../../../ghuser';
import AddSettings from '../AddSettings';
import './VCardDetails.css';

const VCardDetails = props => {
  const insertSettingsButtonOnce = (function () {
    let button = !props.settings &&
            <AddSettings href={`${urls.docs}/user-settings.md`} title="Add a link"
                         classes="ml-2" />;

    return function () {
      const result = button && React.cloneElement(button) || '';
      button = null;
      return result;
    };
  })();

  const details = [];

  if (props.gist_username) {
    details.unshift(
      <div className="vcard-detail pt-1" key="gist">
        <i className="vcard-icon fab fa-github"></i>&nbsp;
        <a href={`https://gist.github.com/${props.gist_username}`} target="_blank"
           className="external">GitHub Gist</a>
        {insertSettingsButtonOnce()}
      </div>
    );
  }

  if (props.settings) {
    if (props.settings.stackoverflow_id) {
      details.unshift(
        <div className="vcard-detail pt-1" key="stackoverflow">
          <i className="vcard-icon fab fa-stack-overflow"></i>&nbsp;
          <a href={`https://stackoverflow.com/users/${props.settings.stackoverflow_id}`}
             target="_blank" className="external">Stack Overflow</a>
        </div>
      );
    }
    if (props.settings.linkedin_id) {
      details.unshift(
        <div className="vcard-detail pt-1" key="linkedin">
          <i className="vcard-icon fab fa-linkedin"></i>&nbsp;
          <a href={`https://linkedin.com/in/${props.settings.linkedin_id}`} target="_blank"
             className="external">LinkedIn</a>
        </div>
      );
    }
    if (props.settings.reddit_username) {
      details.unshift(
        <div className="vcard-detail pt-1" key="reddit">
          <i className="vcard-icon fab fa-reddit-alien"></i>&nbsp;
          <a href={`https://reddit.com/user/${props.settings.reddit_username}`} target="_blank"
             className="external">u/{props.settings.reddit_username}</a>
        </div>
      );
    }
    if (props.settings.twitter_username) {
      details.unshift(
        <div className="vcard-detail pt-1" key="twitter">
          <i className="vcard-icon fab fa-twitter"></i>&nbsp;
          <a href={`https://twitter.com/${props.settings.twitter_username}`} target="_blank"
             className="external">@{props.settings.twitter_username}</a>
        </div>
      );
    }
  };

  if (props.blog) {
    details.unshift(
      <div className="vcard-detail pt-1" key="blog">
        <i className="vcard-icon fas fa-link"></i> {Parser(Autolinker.link(props.blog, {
          className: 'external'
        }))}
        {insertSettingsButtonOnce()}
      </div>
    );
  };

  if (props.email) {
    details.unshift(
      <div className="vcard-detail pt-1" key="email">
        <i className="vcard-icon far fa-envelope"></i> {Parser(Autolinker.link(props.email))}
        {insertSettingsButtonOnce()}
      </div>
    );
  };

  if (props.location) {
    details.unshift(
      <div className="vcard-detail pt-1" key="location">
        <i className="vcard-icon fas fa-map-marker-alt"></i>&nbsp;
        {props.location}
        {insertSettingsButtonOnce()}
      </div>
    );
  };

  if (props.company) {
    details.unshift(
      <div className="vcard-detail pt-1" key="company">
        <i className="vcard-icon fas fa-suitcase"></i> {
          Parser(Autolinker.link(props.company.replace(/-/g, '__dash__'), {
            mention: 'twitter', // Autolinker doesn't support mentions to GitHub orgs, thus this workaround
            className: 'external'
          }).replace(/https:\/\/twitter\.com\//g, 'https://github.com/')
            .replace(/__dash__/g, '-'))
        }
        {insertSettingsButtonOnce()}
      </div>
    );
  };

  return (
    <div className={details.length > 0 && withSeparator('top', 3) || ''}>{details}</div>
  );
};

export default VCardDetails;
