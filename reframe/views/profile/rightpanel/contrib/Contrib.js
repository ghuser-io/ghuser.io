import React from 'react';

//import * as db from '../../../../db';
import {urls} from '../../../../ghuser';

import RichText from '../../../utils/RichText';
import {Accordion, AccordionHead, AccordionBody, AccordionBadgerIcon, stopPropagationOnLinks} from '../../../utils/Accordion';
import ProgressBar from '../../../utils/ProgressBar';
import {numberOf} from '../../../utils/pretty-numbers';

import Avatar from '../../Avatar';
import AvatarAdd from '../../AvatarAdd';
import AddSettings from '../../AddSettings';
import {Badges, BadgesMini, BadgesMultiLine, getContribType} from './badges/Badges';
import {getCommitCounts, getRepoAvatar, getContribScore} from './getContribInfo';
import Language from './Language';

import './Contrib.css';


export {Contrib};


class Contrib extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
   // loading: true,
      loading: false,
      repo: null
    };
  }

  componentDidMount() {
    /*
    this.props.pushToFunctionQueue(0, async () => {
      try {
        const repoData = await fetch(`${db.url}/repos/${this.props.contrib.full_name}.json`);
        const repo = await repoData.json();
        this.setState({ repo });
      } catch (_) {}
      this.setState({ loading: false });
    });
    */
  }

  render() {
    const repo = this.state.repo || this.props.repo;

    console.log(repo);
    if( ! this.state.loading && repo && this.props.i>=10 ) {
        return <ContribMini {...{...this.props, ...this.state, repo}}/>;
    }

    const avatar = () => {
      if (this.state.loading) {
        return (
          <span className="mb-2 mr-2" style={{display: 'inline-block', verticalAlign: 'middle'}}>
            <i className="fas fa-spinner fa-pulse"/>
          </span>
        );
      }
      const repoAvatar = getRepoAvatar(repo);
      if( repoAvatar ) {
        return <Avatar url={repoAvatar} classes="avatar-small" />;
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

    const LEFT_PADDING = 67;

    const badgesLine = (
      <Badges contrib={this.props.contrib} username={this.props.username} style={{marginTop: 3}}/>
    );
    const accordionHead = (
      <AccordionHead
        style={{paddingBottom: 15, paddingTop: 15, paddingLeft: LEFT_PADDING, position: 'relative'}}
        className="contrib-head"
      >
        <div style={{position: 'absolute', top: 0, left: 0, paddingTop: 'inherit'}}>
          {avatar()}
        </div>
        <ContribHeader {...{...this.props, ...this.state, repo}}/>
        {badgesLine}
        <AccordionBadgerIcon/>
      </AccordionHead>
    );

    const accordionBody = (
      <ContribExpandedContent
        {...{...this.props, ...this.state}}
        style={{paddingLeft: LEFT_PADDING}}
      />
    );

    return (
        <Accordion
          pushToFunctionQueue={this.props.pushToFunctionQueue}
          className="border-bottom border-gray-light"
        >
          {accordionHead}
          {accordionBody}
        </Accordion>
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

    const accordionHead = (
        <AccordionHead
          style={{paddingTop: 3, paddingBottom: 3, position: 'relative', paddingLeft: LEFT_PADDING}}
        >
          {badgeLine}
          <ContribHeader {...props}/>
        </AccordionHead>
    );

    const accordionBody = (
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
        {accordionHead}
        {accordionBody}
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
    const Spacer = ({mod}) => <div style={{width: 1, height: 20+mod}}/>;

    const languagesView = Languages({repo});

    return (
      <AccordionBody className={"text-gray "+className} style={{paddingBottom: 15, ...style}}>
        <Spacer mod={-12}/>
        {languagesView && (
          <React.Fragment>
            {languagesView}
            <Spacer mod={1}/>
          </React.Fragment>
        )}
        <BadgesExplanation {...{contrib, username}}/>
        <Spacer mod={3}/>
        <ContribLinks {...{repo, username, contrib, pushToFunctionQueue}} />
        <Spacer mod={-2}/>
        <ScoreExplanation {...{contrib}}/>
        <Spacer mod={-7}/>
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
    <div style={{fontSize: '1em'}}>
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

  const {commits_count__user, commits_count__percentage, commits_count__total} = getCommitCounts(contrib);
  const contribType = getContribType(contrib);

  const isMaintainer = contribType === 'contrib_crown';

  const CommitLink = ({children}) => (
    isMaintainer ? (
      children
    ) : (
      <a href={`https://github.com/${contrib.full_name}/commits?author=${username}`}
         target="_blank" className="external">{children}</a>
    )
  );

  return (
    <div>
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
