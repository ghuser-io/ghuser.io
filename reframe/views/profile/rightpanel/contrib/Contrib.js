import React from 'react';
import * as moment from 'moment';

import Badge from './Badge';
import RepoDescrAndDetails from './RepoDescrAndDetails';
import './Contrib.css';
import Avatar from '../../Avatar';
import AvatarAdd from '../../AvatarAdd';
import * as db from '../../../../db';
//import {withSeparator} from '../../css';
import {bigNum, roundHalf, numberOf} from '../../numbers';
import {urls} from '../../../../ghuser';
import {Badges, BadgesMini, getDisplaySettings, BadgesMultiLine, getInfoForBadges, getContribScore} from './badges/Badges';
import RichText from './RichText';
import {Accordion, AccordionHead, AccordionBody, AccordionIcon, stopPropagationOnLinks} from './Accordion';
import Language from './Language';
import AddSettings from '../../AddSettings';
import ProgressBar from './ProgressBar';

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
    if( ! this.state.loading && this.state.repo && /*getDisplaySettings(this.props.contrib).miniDisplay*/ this.props.i>=10 ) {
        return <ContribMini {...{...this.props, ...this.state}}/>;
    }

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
      return (
        <a
          href={`${urls.docs}/repo-settings.md`}
          title="Add an avatar"
          target="_blank"
          ref={stopPropagationOnLinks}
        ><AvatarAdd/></a>
      );
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

    const LEFT_PADDING = 67;

    /*
    const badgesLine = (
      <div>
        <AccordionIcon/>
        <Badges contrib={this.props.contrib} username={this.props.username}/>
      </div>
    );
    /*/
    const badgesLine = (
      <Badges contrib={this.props.contrib} username={this.props.username} style={{marginTop: 3}}/>
    );
    //*/
    const accordionBody = (
      <ContribExpandedContent
        {...{...this.props, ...this.state}}
        style={{paddingLeft: LEFT_PADDING}}
      />
    );

    const head = (
      <AccordionHead
        style={{paddingBottom: 15, paddingTop: 15, paddingLeft: LEFT_PADDING, position: 'relative'}}
        className="contrib-head"
      >
        <div style={{position: 'absolute', top: 0, left: 0, paddingTop: 'inherit'}}>
          {avatar()}
        </div>
        <ContribHeader {...{...this.props, ...this.state}}/>
        {badgesLine}
        <div className="badger-accordion__header-icon"/>
      </AccordionHead>
    );

    return (
        <Accordion
          pushToFunctionQueue={this.props.pushToFunctionQueue}
          className="border-bottom border-gray-light"
        >
        {head}
        {accordionBody}
        </Accordion>
    );

    return (
      <div className="border-bottom border-gray-light" style={{paddingBottom: 15, paddingTop: 15, paddingLeft: LEFT_PADDING, position: 'relative'}}>
        <div style={{position: 'absolute', top: 0, left: 0, paddingTop: 'inherit'}}>
          {avatar()}
        </div>
        <ContribHeader {...{...this.props, ...this.state}}/>
        {/*
        <h4 className="contrib-name mr-1">
          <a href={`https://github.com/${this.props.contrib.full_name}`}
             target="_blank" className="text-bold contrib-name external"
             title={this.props.contrib.full_name}>{this.props.contrib.name}</a>
          {
            this.state.repo && this.state.repo.fork &&
              <i className="fas fa-code-branch contrib-name ml-2 text-gray" title="fork"></i>
          }
        </h4>
        */}
        {
          /*
          this.state.repo &&
            badges(this.state.repo.owner, this.state.repo.fork, this.props.contrib.percentage,
                   Object.keys(this.state.repo.contributors || []).length, this.props.contrib.popularity,
                   this.state.repo.stargazers_count, this.props.contrib.activity,
                   this.state.repo.pushed_at, this.props.contrib.maturity,
                   this.props.contrib.total_commits_count, userIsMaintainer)
          */
        }
        {
          /*
          this.state.repo &&
            earnedStars(this.props.contrib.percentage, this.state.repo.stargazers_count)
          */
        }
        {body}
        {
          /*
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
          */
        }
      </div>
    );
  }
}

function ContribMini(props) {
    const LEFT_PADDING = 100;

    const badgeLine = (
      <BadgesMini
        style={{position: 'absolute', left: 0, top:0, paddingTop: 'inherit', width: LEFT_PADDING, marginTop: 1}}
        contrib={props.contrib}
        username={props.username}
        repo={props.repo}
      />
    );

    const head = (
        <AccordionHead
          style={{paddingTop: 3, paddingBottom: 3, position: 'relative', paddingLeft: LEFT_PADDING}}
        >
          {badgeLine}
          <ContribHeader {...props}/>
        </AccordionHead>
    );

    const body = (
      <ContribExpandedContent
        {...props}
        style={{paddingTop: 10, paddingLeft: LEFT_PADDING}}
      />
    );

    return (
      <Accordion
        pushToFunctionQueue={props.pushToFunctionQueue}
        className="border-bottom border-gray-light"
      >
        {head}
        {body}
      </Accordion>
    );
}


function ContribHeader({username, contrib: {name, full_name}, repo}) {
      if( ! repo ) {
          return null;
      }
      const display_name = repo.owner===username ? name : full_name;
      return (
          <div
            style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}
            ref={stopPropagationOnLinks}
          >
            <a href={`https://github.com/${full_name}`}
               className="external"
               target="_blank">
               { repo.owner !== username &&
                   repo.owner+'/'
               }
               <span className="text-bold">{name}</span>
            </a>
            &nbsp; &nbsp;
            <span
              className="repo-descr text-gray"
            >{RichText(repo.description)}</span>
          </div>
      );
}

function Languages({repo, style={}}) {

    const languageViews = [];

    const languages = repo && repo.languages;

    const techs = repo && repo.settings && repo.settings.techs;

    if (languages) {
      for (const language of Object.keys(languages)) {
        languageViews.push(<Language key={language} name={language}
                       color={languages[language].color} />);
      }
    }
    if( techs ) {
      for (const tech of techs) {
        languageViews.push(<Language key={tech} name={tech}
                                 color="#ccc" />);
      }
    }

    if( languageViews.length === 0 ) {
      return null;
    }

    return (
      <div style={{paddingLeft: 3, ...style}}>
        {languageViews}
        <AddSettings href={`${urls.docs}/repo-settings.md`} title="Add a tech" />
      </div>
    );
}

function ContribExpandedContent({repo, username, contrib, style={}, className="", pushToFunctionQueue}) {
    const Spacer = () => <div style={{width: 1, height: 10}}/>;
    return (
      <AccordionBody className={"text-gray "+className} style={{paddingBottom: 15, ...style}}>
        <Spacer/>
        <Languages repo={repo} style={{marginBottom: 9, marginTop: -4}}/>
        <Spacer/>
        <BadgesExplanation {...{contrib, username}}/>
        <Spacer/>
        <ContribLinks {...{repo, username, contrib, pushToFunctionQueue}} />
        <Spacer/>
        <ScoreExplanation {...{contrib}}/>
        <Spacer/>
      </AccordionBody>
    );
}

function BadgesExplanation(props) {
  return (
    <div>
      <BadgesMultiLine {...props} />
      <div className='small-text'>
        How these badges are determined and the earned stars calculated is explained <ExplainerTicket/>
      </div>
    </div>
  );
}

function ScoreExplanation({contrib}) {
  const {contribScore, userCommitsCount, starBoost, contribBoost} = getContribScore(contrib);

  const contribScorePretty = Math.round(contribScore);
  const starBoostPretty = starBoost.toFixed(2);
  const contribBoostPretty = contribBoost.toFixed(2);

  return (
    <div style={{fontSize: '1em', marginTop: 15}}>
      Contribution score: {contribScorePretty}
      <div className="small-text">
        Calculation: {contribScorePretty} = {userCommitsCount} (user commits) * {starBoostPretty} (star boost) * {contribBoostPretty} (contrib boost)
        <br/>
        The contributions on this page are sorted according to this score, more infos <ExplainerTicket/>
      </div>
    </div>
  );

}

function ExplainerTicket () {
  const RELATED_ISSUE_ID = 156;
  return (
    <a href={"https://github.com/ghuser-io/ghuser.io/issues/"+RELATED_ISSUE_ID}
       target="_blank"
       className="external"
    >here</a>
  );
}

function ContribLinks({contrib, username, repo, pushToFunctionQueue}) {

  const {commits_count__user, commits_count__percentage, commits_count__total, contribType} = getInfoForBadges(contrib, username);

  const isMaintainer = contribType === 'maintainer';

  const CommitLink = ({children}) => (
    isMaintainer ? (
      children
    ) : (
      <a href={`https://github.com/${contrib.full_name}/commits?author=${username}`}
         target="_blank" className="external">{children}</a>
    )
  );

  return (
    <div style={{marginTop: 15}}>
      <div>
        <i className="fas fa-code icon contrib-link-icon text-gray"></i>&nbsp;
        <ProgressBar color="green" percentage={commits_count__percentage*100}
                     pushToFunctionQueue={pushToFunctionQueue} />
          {' '}
          {username} wrote <CommitLink>{numberOf(commits_count__user, 'commit')}</CommitLink>
          {' '}
          ({Math.round(commits_count__percentage*100)}% of all {numberOf(commits_count__total, 'commit')})
      </div>
      {
        !isMaintainer && repo && repo.pulls_authors && repo.pulls_authors.indexOf(username) !== -1 && (
          <span>
            <i className="fas fa-code-branch icon contrib-link-icon text-gray"></i>&nbsp;
            <a href={`https://github.com/${contrib.full_name}/pulls?q=is%3Apr+author%3A${username}`}
               target="_blank" className="external">{username}'s pull requests</a>
          </span>
        ) || null
      }
    </div>
  );
}

export default Contrib;
