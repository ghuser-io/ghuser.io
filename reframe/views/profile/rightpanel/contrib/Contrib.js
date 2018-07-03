import React from 'react';
import * as moment from 'moment';

import Badge from './Badge';
import {roundHalf, RepoDescrAndDetails} from './RepoDescrAndDetails';
import './Contrib.css';
import Avatar from '../../Avatar';

const Contrib = props => {
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

  const avatar = () => {
    if (props.repo.settings && props.repo.settings.avatar_url) {
      return <Avatar url={props.repo.settings.avatar_url} classes="avatar-repo" />;
    }
    if (props.repo.organization && props.repo.organization.avatar_url) {
      return <Avatar url={props.repo.organization.avatar_url} classes="avatar-repo" />;
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

  const earnedStars = (percentage, numStars) => {
    let earned = percentage * numStars / 100;
    if (earned < .5) {
      return '';
    }

    earned = bigNum(earned);
    const total = bigNum(numStars);
    let displayStr = `★ ${earned}`;
    if (earned !== total) {
      displayStr += ` / ${total}`;
    }

    return (
      <span className="ml-2 mb-2 contrib-name text-gray">{displayStr}</span>
    );
  };

  return (
    <div className="border-bottom border-gray-light py-4">
      {avatar()}
      <h4 className="contrib-name">
        <a href={`https://github.com/${props.contrib.full_name}`}
           target="_blank" className="text-bold contrib-name"
           title={props.contrib.full_name}>{props.repo.name}</a>
      </h4>
      {badges(props.repo.owner, props.contrib.percentage,
              Object.keys(props.repo.contributors).length, props.contrib.popularity,
              props.repo.stargazers_count, props.contrib.activity,
              props.repo.pushed_at, props.contrib.maturity,
              props.contrib.total_commits_count)}
      {earnedStars(props.contrib.percentage, props.repo.stargazers_count)}
      <RepoDescrAndDetails contrib={props.contrib} descr={props.repo.description}
        languages={props.repo.languages}
        techs={props.repo.settings && props.repo.settings.techs || []}
        strStars={strStars(props.repo.stargazers_count)}
        strLastPushed={strLastPushed(props.repo.pushed_at)}
        strNumCommits={strNumCommits(props.contrib.total_commits_count)}/>
    </div>
  );
};

export default Contrib;
