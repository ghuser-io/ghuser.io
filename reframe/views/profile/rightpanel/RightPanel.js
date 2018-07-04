import React from 'react';
import * as moment from 'moment';

import Contrib from './contrib/Contrib';
import './RightPanel.css';
import CreateYourProfile from '../../CreateYourProfile';

const RightPanel = props => {
  const compare = (a, b) => {
    if (a.total_score < b.total_score) {
      return 1;
    }
    if (a.total_score > b.total_score) {
      return -1;
    }
    return 0;
  };

  const repos = [];

  if (props.contribs) {
    const contribs = Object.values(props.contribs.repos);
    contribs.sort(compare);

    const uniqueNames = [];
    for (const contrib of contribs) {
      // We show only:
      // * forks with 2+ stars
      // * forks with 1+ stars if the user's contribution > 0
      // * original repos with 1+ stars
      if (props.repos[contrib.full_name].stargazers_count < 1) {
        continue;
      }
      if (props.repos[contrib.full_name].stargazers_count === 1 &&
          props.repos[contrib.full_name].fork && contrib.percentage === 0) {
        continue;
      }

      // We don't want to have two repos with the same name. This happens when a user is
      // contributing to a project and has a fork with the same name:
      if (uniqueNames.indexOf(props.repos[contrib.full_name].name) > -1) {
        continue;
      }
      uniqueNames.push(props.repos[contrib.full_name].name);

      repos.push(
        <Contrib key={contrib.full_name} username={props.username} contrib={contrib}
                 repo={props.repos[contrib.full_name]} />
      );
    }
  } else {
    repos.push(<CreateYourProfile key="createyourprofile" />);
  }

  return (
    <div className="col-9 pl-2 pr-0">
      <div className="user-profile-nav">
        <nav className="UnderlineNav-body">
          <a href="javascript:;" className="UnderlineNav-item selected" aria-selected="true" role="tab">
            Contributions
          </a>
          {/*<a href="javascript:;" className="UnderlineNav-item" aria-selected="false" role="tab">
            Other tab
          </a>*/}
        </nav>
      </div>
      <div className="contribs">
        {repos}
      </div>
      {
        props.contribs &&
        <div className="updated-hint text-gray">
          <small><i>Updated {moment(props.contribs.fetched_at).fromNow()}.</i></small>
        </div>
      }
    </div>
  );
};

export default RightPanel;
