import React from 'react';
import {bigNum} from '../../../numbers';
import './Badges.css';

export {Badges, BadgesMini};
export {getDisplaySettings};
export {getDisplayOrder};

function Badges({contrib, username}) {
    const badgeInfos = getInfoForBadges(contrib, username);

    return (
        <div style={{display: 'inline-flex'}}>
            <ContribType {...badgeInfos} />
            <RepoScale {...badgeInfos} />
            {/*
            <ContribRange {...badgeInfos} />
            */}
            <EarnedStars {...{...contrib, ...badgeInfos}} />
        </div>
    );
}

function HintWrapper({hint, children}) {
  return (
    <div style={{display: 'inline-block'}} title={hint}>{children}</div>
  );
}
function BadgesMini({contrib, username}) {
  const {contribTypeIcon, contribTypeHint, repoScaleIcon, repoScaleHint} = getInfoForBadges(contrib, username);

  return (
    <div style={{textAlign: 'right', width: 67, display: 'inline-block'}}>
      <HintWrapper hint={contribTypeHint}>{contribTypeIcon}</HintWrapper>
      &nbsp;
      <HintWrapper hint={repoScaleHint}>{repoScaleIcon}</HintWrapper>
    </div>
  );
}

function RepoScale({repoScale, repoScaleIcon, repoScaleHint}) {
    return (
        <Badge
          head={repoScaleIcon}
          desc={repoScale+' project'}
          hint={repoScaleHint}
          width={130}
        />
    );
}

function ContribRange({contribRange}) {
       // desc={contribRange.precise.from+' -> '+contribRange.precise.to}
    return (
        <Badge
          head={<div className="contrib-range-title text-gray">{contribRange.coarse}</div>}
          width={160}
        />
    );
}

function EarnedStars({earnedStars, earnedStarsHint, stargazers_count}) {
    const Star = () => <span style={{fontSize: '0.92em', position: 'relative', top: '-0.08em'}}>★</span>;
    /*
    return (
        <Badge
          head={<span className={'earned-stars-text earned-stars-text-color'}><Star/> {bigNum(earnedStars)}</span>}
          desc={earnedStars!==stargazers_count && <span>/ <Star/> {bigNum(stargazers_count)}</span>}
          width={170}
        />
    );
    */
    return (
        <Badge
          head={<span className="earned-stars-text earned-stars-icon-color"><Star/></span>}
          desc={<span style={{marginLeft: -3}}><span className="earned-stars-text-color">{bigNum(earnedStars)}</span>{earnedStars!==stargazers_count && <span> / <Star/> {bigNum(stargazers_count)}</span>}</span>}
          hint={earnedStarsHint}
          width={105}
        />
    );
}

function ContribType({contribTypeIcon, contribTypeText, contribTypeHint}) {
    return (
        <Badge
          head={contribTypeIcon}
          desc={contribTypeText}
          hint={contribTypeHint}
          width={130}
        />
    );
}

function Badge({head, desc, width, hint}) {
    return (
        <div style={{width}}>
            <div className="big-badge text-gray" title={hint}>
                <div>{head}</div>
                {desc && <div className="badge-desc">{desc}</div>}
                <div className="badge-border"/>
            </div>
        </div>
    );
}

function getDisplaySettings(contrib) {
    const {commits_count__user, commits_count__percentage, commits_count__total, contribType, contribRange, earnedStars, repoScale} = getInfoForBadges(contrib);

    const miniDisplay = ! (
        repoScale!=='micro'
        /*
        ['large', 'medium'].includes(repoScale) ||
        repoScale==='small' && ['maintainer', 'contributor_gold', 'contributor_silver'].includes(contribType)
        */
    );

    return {miniDisplay};
}

function getDisplayOrder(contrib1, contrib2) {
    let orderVal;
    orderVal = getOrder__one_sided(contrib1, contrib2);
    if( orderVal!==null ) {
        return orderVal;
    }
    orderVal = getOrder__one_sided(contrib2, contrib1);
    if( orderVal!==null ) {
        return -1*orderVal;
    }

    const {
        contribType: contribType1,
        repoScale: repoScale1,
        commits_count__user: commits_count__user1,
    } = getInfoForBadges(contrib1);
    const {
        contribType: contribType2,
        repoScale: repoScale2,
        commits_count__user: commits_count__user2,
    } = getInfoForBadges(contrib2);

    const getContribOrder = (contribType, repoScale) => (
        contribType==='maintainer' && repoScale==='micro' && -1 ||
        contribType==='maintainer' && 3 ||
        contribType==='contributor_gold' && 2 ||
        contribType==='contributor_silver' && 1 ||
        contribType==='contributor_bronze' && 0
    );
    const contribOrder = getContribOrder(contribType2, repoScale2) - getContribOrder(contribType1, repoScale1);
    if( contribOrder!==0 ) {
        return contribOrder;
    }

    const getRepoOrder = repoScale => (
        repoScale==='large' && 3 ||
        repoScale==='medium' && 2 ||
        repoScale==='small' && 1 ||
        repoScale==='micro' && 0
    );
    const repoOrder = getRepoOrder(repoScale2) - getRepoOrder(repoScale1);
    if( repoOrder!==0 ) {
        return repoOrder;
    }

    return commits_count__user2 - commits_count__user1;
}

function getOrder__one_sided(contrib1, contrib2) {
    const {
        contribType: contribType1,
        repoScale: repoScale1,
        earnedStars: earnedStars1,
    } = getInfoForBadges(contrib1);
    const {
        contribType: contribType2,
        repoScale: repoScale2,
        earnedStars: earnedStars2,
    } = getInfoForBadges(contrib2);


    if( repoScale1!=='micro' && repoScale2==='micro' ) {
        return -1;
    }
    if( repoScale1==='micro' && repoScale2!=='micro' ) {
        return 1;
    }

    if( contribType1!=='contributor_bronze' && ['large', 'medium'].includes(repoScale1) && ! ['large', 'medium'].includes(repoScale2) ) {
        return -1;
    }

    return null;
}

function getInfoForBadges(contrib, username) {
    const {contribType, ...contribInfos} = getContribType(contrib, username);

    const contribRange = getContribRange(contrib);

    return {
        ...getCommitCounts(contrib),
        contribType,
        ...contribInfos,
        contribRange,
        ...getEarnedStars(contrib, contribType, username),
        ...getRepoScale(contrib),
    };

    /*
    if ( contrib.full_name.split('/')[0]!=='brillout') {
        console.log(contrib.full_name);
        console.log('commits - '+contrib.total_commits_count);
        console.log('commits % - '+contrib.percentage);
        console.log('stars - '+contrib.stargazers_count);
        console.log('--');
        console.log(contribType);
        console.log(contribRange);
        console.log(repoScale);
        console.log(earnedStars);
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
    }
    */
}


function getContribType(contrib, username="user") {
    const MAINTAINER_THRESHOLD = 0.1;
    const CONTRIBUTOR_GOLD_THRESHOLD = 50;
    const CONTRIBUTOR_SILVER_THRESHOLD = 5;

    const {commits_count__user, commits_count__percentage, commits_count__total} = getCommitCounts(contrib);

    const contribType = (
        commits_count__user > 1 && (commits_count__total * MAINTAINER_THRESHOLD <= 1 || commits_count__percentage >= MAINTAINER_THRESHOLD) && 'maintainer' ||
        commits_count__user > CONTRIBUTOR_GOLD_THRESHOLD && 'contributor_gold' ||
        commits_count__user > CONTRIBUTOR_SILVER_THRESHOLD && 'contributor_silver' ||
        'contributor_bronze'
    );

    /*
    console.log('pre');
    console.log(contrib.name);
    console.log(commits_count__total);
    console.log(MAINTAINER_THRESHOLD);
    console.log(commits_count__percentage);
    console.log(contribType);
    console.log('aft');
    */

    const {iconClassName, text, hint} = getAssets();
    const contribTypeIcon = <div className={'contrib-type-icon '+iconClassName}/>;
    const contribTypeText = text;
    const contribTypeHint = hint;

    return {contribType, contribTypeText, contribTypeIcon, contribTypeHint};

    function getAssets() {
        if( contribType==='maintainer' ) {
            return {
                iconClassName: 'icon-crown',
                text: 'maintainer',
                hint: username+' has substantially contributed to '+contrib.full_name,
            };
        }
        const CONTRIB_PREFIX = 'contributor_';
        if( contribType.startsWith(CONTRIB_PREFIX) ) {
            const contrib_type_name = contribType.slice(CONTRIB_PREFIX.length);
            /*
            const hint = (
              contribType==='contributor_silver' && (
                username+' has often contributed to '+contrib.full_name
              ) || (
                username+' has contributed to '+contrib.full_name+' '+(contribType==='contributor_gold' && 'a lot' || 'couple')+' of times'
              )
            );
            */
            const contribFrequency = (
              contribType==='maintainer' && 'substantially' ||
              contribType==='contributor_gold' && 'a lot of times' ||
              contribType==='contributor_silver' && 'often' ||
              contribType==='contributor_bronze' && 'a couple of times'
            );
            const hint = username+' has '+contribFrequency+' contributed to '+contrib.full_name;
            return {
                iconClassName: 'icon-contrib-'+contrib_type_name,
                text: contrib_type_name+' contrib',
                hint,
            };
        }

        assert(false, 'getting info for contrib type section');
    }
}

function getCommitCounts(contrib) {
    const {total_commits_count: commits_count__total} = contrib;
    const commits_count__percentage = contrib.percentage/100;
    const commits_count__user = Math.round(commits_count__percentage*commits_count__total);
    return {commits_count__user, commits_count__percentage, commits_count__total};
}

function getContribRange(contrib) {
    const {name} = contrib;

    const coarse = name.charCodeAt(0)<name.charCodeAt(1)?"'17 - '18":"'18";

    const precise = {
        from: '03.18',
        to: '09.18',
    };

    const contribRange = {coarse, precise};

    return contribRange;
}

function getRepoScale(contrib) {
    const THREADSHOLD_BIG = 2000;
    const THREADSHOLD_MEDIUM = 500;
    const THREADSHOLD_SMALL = 50;

    const {total_commits_count} = contrib;

    const repoScale = (
        total_commits_count > THREADSHOLD_BIG && 'large' ||
        total_commits_count > THREADSHOLD_MEDIUM && 'medium' ||
        total_commits_count > THREADSHOLD_SMALL && 'small' ||
        'micro'
    );

    const repoScaleIcon = <div className={'icon-repo-scale icon-repo-scale-'+repoScale}/>;

    const repoScaleHint = contrib.full_name+' seems to be a '+repoScale+' project';

    return {repoScale, repoScaleIcon, repoScaleHint};
}

function getEarnedStars(contrib, contribType, username) {
    const assert_ = val => assert(val, 'computing earned stars');

    const {stargazers_count: stars} = contrib;

    const isMaintainer = contribType==='maintainer';
    const isBronzeContributor = contribType==='contributor_bronze';
    const isSilverContributor = contribType==='contributor_silver';
    const isGoldContributor = contribType==='contributor_gold';

    assert_(isMaintainer + isBronzeContributor + isSilverContributor + isGoldContributor === 1);

    const earnedStars_bronze = Math.min(10, stars);
    const earnedStars_silver = Math.min(100, stars);
    const earnedStars_gold = Math.round(Math.max(earnedStars_silver, Math.ceil((contrib.percentage/100)*stars)));

    const earnedStars = (
        isMaintainer && stars ||
        isGoldContributor && earnedStars_gold ||
        isSilverContributor && earnedStars_silver ||
        isBronzeContributor && earnedStars_bronze
    );

    const earnedStarsHint = username+' earned '+earnedStars+' stars from '+contrib.full_name+"'s total "+stars+" stars";

    assert_(earnedStars>=0 && (earnedStars|0)===earnedStars);

    return {earnedStars, earnedStarsHint};
}

function assert(val, doingWhat) {
    if( val ) {
        return;
    }
    throw new Error('Internal error '+doingWhat);
}
