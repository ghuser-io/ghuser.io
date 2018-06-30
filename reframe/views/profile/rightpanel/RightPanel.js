import React from 'react';
import * as moment from 'moment';

import Badge from './Badge';
import {roundHalf, RepoDescrAndDetails} from './RepoDescrAndDetails';
import './RightPanel.css';
import Avatar from '../Avatar';
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

  const bigNum = num => {
    let suffix='';
    let val = roundHalf(num);
    if (val >= 1000) {
      suffix = 'k';
      val = roundHalf(val / 1000);
    }
    if (val >= 10) {
      val = Math.round(val);
    }
    return `${val}${suffix}`;
  };

  const strStars = numStars => `★ ${bigNum(numStars)}`;
  const strLastPushed = pushedAt => `last pushed ${moment(pushedAt).fromNow()}`;
  const strNumCommits = numCommits => `${bigNum(numCommits)} non-merge commits`;

  const avatar = full_name => {
    if (props.repos[full_name].settings && props.repos[full_name].settings.avatar_url) {
      return <Avatar url={props.repos[full_name].settings.avatar_url} classes="avatar-repo" />;
    }
    if (props.repos[full_name].organization && props.repos[full_name].organization.avatar_url) {
      return <Avatar url={props.repos[full_name].organization.avatar_url} classes="avatar-repo" />;
    }
    return <a href="https://github.com/AurelienLourot/ghuser.io/blob/master/docs/repo-settings.md"
              title="Add an avatar" target="_blank"><Avatar type="add" classes="avatar-repo avatar-add text-gray" /></a>;
  };

  const badges = (owner, percentage, numContributors, popularity, numStars, activity, pushedAt,
                  maturity, numCommits) => {
    const result = [];
    if (props.username == owner || percentage >= 80) {
      result.push(<Badge key="percentage" classes="badge-success contrib-name" text="owner"
                         tooltip={`${props.username} wrote ${roundHalf(percentage)}% of it`}/>);
    } else if (percentage >= 15) {
      result.push(<Badge key="percentage" classes="badge-danger contrib-name" text="maintainer"
                         tooltip={`${props.username} wrote ${roundHalf(percentage)}% of it`}/>);
    }
    if (numContributors > 1) {
      result.push(<Badge key="collaborative" classes="badge-secondary contrib-name" text="collaborative"
                         tooltip={`${numContributors} people worked on it`}/>);
    }
    if (popularity > 2.5) {
      result.push(<Badge key="popular" classes="badge-secondary contrib-name" text="popular"
                         tooltip={strStars(numStars)}/>);
    }
    if (activity > 2.5) {
      result.push(<Badge key="active" classes="badge-secondary contrib-name" text="active"
                         tooltip={strLastPushed(pushedAt)}/>);
    }
    if (maturity > 2.5) {
      result.push(<Badge key="mature" classes="badge-secondary contrib-name" text="mature"
                         tooltip={strNumCommits(numCommits)}/>);
    }
    return result;
  };

  const repos = [];

  if (props.contribs) {
    const contribs = Object.values(props.contribs.repos);
    contribs.sort(compare);

    for (const contrib of contribs) {
      repos.push(
        <div key={contrib.full_name} className="border-bottom border-gray-light py-4">
          {avatar(contrib.full_name)}
          <h4 className="contrib-name">
            <a href={`https://github.com/${contrib.full_name}`}
               target="_blank" className="text-bold contrib-name"
               title={contrib.full_name}>{props.repos[contrib.full_name].name}</a>
          </h4>
          {badges(props.repos[contrib.full_name].owner, contrib.percentage,
                  Object.keys(props.repos[contrib.full_name].contributors).length, contrib.popularity,
                  props.repos[contrib.full_name].stargazers_count, contrib.activity,
                  props.repos[contrib.full_name].pushed_at, contrib.maturity,
                  contrib.total_commits_count)}
          <RepoDescrAndDetails contrib={contrib} descr={props.repos[contrib.full_name].description}
            strStars={strStars(props.repos[contrib.full_name].stargazers_count)}
            strLastPushed={strLastPushed(props.repos[contrib.full_name].pushed_at)}
            strNumCommits={strNumCommits(contrib.total_commits_count)}/>
        </div>
      );
    }
  } else {
    repos.push(<CreateYourProfile key="createyourprofile" />);
  }

  return (
    <div className="col-9 pl-2">
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
    </div>
  );
};

export default RightPanel;
