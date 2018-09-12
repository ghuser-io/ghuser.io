import React from 'react';
import * as moment from 'moment';

import Badge from './Badge';
import RepoDescrAndDetails from './RepoDescrAndDetails';
import './Contrib.css';
import Avatar from '../../Avatar';
import AvatarAdd from '../../AvatarAdd';
import * as db from '../../../../db';
import {withSeparator} from '../../css';
import {bigNum, roundHalf} from '../../numbers';
import {urls} from '../../../../ghuser';

class Contrib extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      repo: null
    };
  }

  componentDidMount() {
    this.props.pushToFunctionQueue(0, async () => {
      try {
        const repoData = await fetch(`${db.url}/repos/${this.props.contrib.full_name}.json`);
        const repo = await repoData.json();
        this.setState({ repo });
      } catch (_) {}
      this.setState({ loading: false });
    });
  }

  render() {
    const strStars = numStars => `★ ${bigNum(numStars)}`;
    const strLastPushed = pushedAt => `last pushed ${moment(pushedAt).fromNow()}`;
    const strNumCommits = numCommits => `${bigNum(numCommits)} non-merge commits`;

    const avatar = () => {
      if (this.state.loading) {
        return <span className="contrib-name mb-2 mr-2"><i className="fas fa-spinner fa-pulse"></i></span>;
      }
      if (this.state.repo && this.state.repo.settings && this.state.repo.settings.avatar_url) {
        return <Avatar url={this.state.repo.settings.avatar_url} classes="avatar-small" />;
      }
      if (this.state.repo && this.state.repo.organization &&
          this.state.repo.organization.avatar_url) {
        return <Avatar url={this.state.repo.organization.avatar_url} classes="avatar-small" />;
      }
      return <a href={`${urls.docs}/repo-settings.md`} title="Add an avatar"
                target="_blank"><AvatarAdd/></a>;
    };

    const badges = (owner, isFork, percentage, numContributors, popularity, numStars, activity,
                    pushedAt, maturity, numCommits, isMaintainer) => {
      const result = [];
      if (!isFork && this.props.username === owner || percentage >= 80) {
        result.push(
            <Badge key="percentage" classes="badge-success contrib-name" text="owner"
                   tooltip={`${this.props.username} wrote ${roundHalf(percentage)}% of it`}/>
        );
      } else if (isMaintainer) {
        result.push(
            <Badge key="percentage" classes="badge-danger contrib-name" text="maintainer"
                   tooltip={`${this.props.username} wrote ${roundHalf(percentage)}% of it`}/>
        );
      }
      if (numContributors > 1) {
        result.push(<Badge key="collaborative" classes="badge-secondary contrib-name"
                           text="collaborative"
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

    const userIsMaintainer = this.props.contrib.percentage >= 15;

    const contribType = getContribType(this.props.contrib);

    const {name} = this.props.contrib;
    const contribRange = name.charCodeAt(0)<name.charCodeAt(1)?"'17-'18":"'18";

    const repoScale = getRepoScale(this.props.contrib);

    const contribStars = getEarnedStars(this.props.contrib, contribType);

    if ( this.props.contrib.full_name.split('/')[0]!=='brillout') {
        console.log(this.props.contrib.full_name);
        console.log(this.props);
        console.log('commits - '+this.props.contrib.total_commits_count);
        console.log('commits % - '+this.props.contrib.percentage);
        console.log('stars - '+this.props.contrib.stargazers_count);
        console.log('--');
        console.log(contribType);
        console.log(contribRange);
        console.log(repoScale);
        console.log(contribStars);
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
    }

    return (
      <div className={withSeparator('bottom', 4)}>
        {avatar()}
        <h4 className="contrib-name mr-1">
          <a href={`https://github.com/${this.props.contrib.full_name}`}
             target="_blank" className="text-bold contrib-name external"
             title={this.props.contrib.full_name}>{this.props.contrib.name}</a>
          {
            this.state.repo && this.state.repo.fork &&
              <i className="fas fa-code-branch contrib-name ml-2 text-gray" title="fork"></i>
          }
        </h4>
        {
          this.state.repo &&
            badges(this.state.repo.owner, this.state.repo.fork, this.props.contrib.percentage,
                   Object.keys(this.state.repo.contributors || []).length, this.props.contrib.popularity,
                   this.state.repo.stargazers_count, this.props.contrib.activity,
                   this.state.repo.pushed_at, this.props.contrib.maturity,
                   this.props.contrib.total_commits_count, userIsMaintainer)
        }
        {
          this.state.repo &&
            earnedStars(this.props.contrib.percentage, this.state.repo.stargazers_count)
        }
        <div>
            {'contrib type: '+'ewhi'+''}
        </div>
        {
          this.state.repo &&
            <RepoDescrAndDetails contrib={this.props.contrib} descr={this.state.repo.description}
              languages={this.state.repo.languages}
              techs={this.state.repo.settings && this.state.repo.settings.techs || []}
              pulls_authors={this.state.repo.pulls_authors}
              strStars={strStars(this.state.repo.stargazers_count)}
              strLastPushed={strLastPushed(this.state.repo.pushed_at)}
              strNumCommits={strNumCommits(this.props.contrib.total_commits_count)}
              username={this.props.username} userIsMaintainer={userIsMaintainer}
              pushToFunctionQueue={this.props.pushToFunctionQueue}/>
        }
      </div>
    );
  }
}

export default Contrib;

function getContribType(contrib) {
    const MAINTAINER_THRESHOLD = 0.1;
    const CONTRIBUTOR_GOLD_THRESHOLD = 50;
    const CONTRIBUTOR_SILVER_THRESHOLD = 5;

    const {total_commits_count: commits_count__total} = contrib;
    const commits_count__percentage = contrib.percentage/100;
    const commits_count__user = Math.round(commits_count__percentage*commits_count__total);

    const contribType = (
        commits_count__user > 1 && (commits_count__total * MAINTAINER_THRESHOLD <= 1 || commits_count__percentage >= MAINTAINER_THRESHOLD) && 'maintainer' ||
        commits_count__user > CONTRIBUTOR_GOLD_THRESHOLD && 'contributor_gold' ||
        commits_count__user > CONTRIBUTOR_SILVER_THRESHOLD && 'contributor_silver' ||
        'contributor_bronze'
    );

    console.log('pre');
    console.log(contrib.name);
    console.log(commits_count__total);
    console.log(MAINTAINER_THRESHOLD);
    console.log(commits_count__percentage);
    console.log(contribType);
    console.log('aft');

    return contribType;
}

function getRepoScale(contrib) {
    const THREADSHOLD_BIG = 2000;
    const THREADSHOLD_MEDIUM = 500;
    const THREADSHOLD_LIGHT = 100;

    const {total_commits_count} = contrib;

    return (
        total_commits_count > THREADSHOLD_BIG && 'big' ||
        total_commits_count > THREADSHOLD_MEDIUM && 'medium' ||
        total_commits_count > THREADSHOLD_LIGHT && 'light' ||
        'tiny'
    );
}

function getEarnedStars(contrib, contribType) {
    const {stargazers_count: stars} = contrib;

    const isMaintainer = contribType==='maintainer';
    const isBronzeContributor = contribType==='contributor_bronze';
    const isSilverContributor = contribType==='contributor_silver';
    const isGoldContributor = contribType==='contributor_gold';
    if( isMaintainer + isBronzeContributor + isSilverContributor + isGoldContributor !== 1 ) {
        throw new Error('Internal error computing earned stars');
    }

    const earnedStars_bronze = Math.max(10, stars);
    const earnedStars_silver = Math.max(100, stars);
    const earnedStars_gold = Math.min(earnedStars_silver, Math.ceil((contrib.percentage/100)*stars));

    return (
        isMaintainer && stars ||
        isGoldContributor && earnedStars_gold ||
        isSilverContributor && earnedStars_silver ||
        earnedStars_bronze
    );
}
