import React from 'react';
import {bigNum} from '../../../numbers';
import './Badges.css';

export {Badges};
export {getInfoForBadges};
export {getSortValue};

function Badges({contrib}) {
    const badgeInfos = getInfoForBadges(contrib);

    return (
        <div style={{display: 'flex'}}>
            <ContribType {...badgeInfos} />
            <RepoScale {...badgeInfos} />
            <ContribRange {...badgeInfos} />
            <EarnedStars {...{...contrib, ...badgeInfos}} />
        </div>
    );
}

function RepoScale({repoScale}) {
    return (
        <Badge
          head={<div className={'repo-scale-icon repo-scale-icon-'+repoScale}/>}
          desc={repoScale+' project'}
          width={130}
        />
    );
}

function ContribRange({contribRange}) {
    return (
        <Badge
          head={<div className="contrib-range-title">{contribRange.coarse}</div>}
          desc={contribRange.precise.from+' -> '+contribRange.precise.to}
          width={160}
        />
    );
}

function EarnedStars({earnedStars, stargazers_count}) {
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
          head={<span className="earned-stars-text earned-stars-text-color"><Star/></span>}
          desc={<span style={{marginLeft: -3}}>{bigNum(earnedStars)}{earnedStars!==stargazers_count && <span> / <Star/> {bigNum(stargazers_count)}</span>}</span>}
          width={170}
        />
    );
}

function ContribType({contribType}) {
    const {iconClassName, text} = getInfo();

    return (
        <Badge
          head={<div className={'contrib-type-icon '+iconClassName}/>}
          desc={text}
          width={130}
        />
    );

    function getInfo() {
        if( contribType==='maintainer' ) {
            return {
                iconClassName: 'icon-crown',
                text: 'maintainer',
            };
        }
        const CONTRIB_PREFIX = 'contributor_';
        if( contribType.startsWith(CONTRIB_PREFIX) ) {
            const contrib_type_name = contribType.slice(CONTRIB_PREFIX.length);
            return {
                iconClassName: 'icon-contrib-'+contrib_type_name,
                text: contrib_type_name+' contrib',
            };
        }

        assert(false, 'getting info for contrib type section');
    }
}

function Badge({head, desc, width}) {
    return (
        <div style={{width}}>
            <div className="big-badge text-gray">
                <div>{head}</div>
                {desc && <div className="badge-desc">{desc}</div>}
                <div className="badge-border"/>
            </div>
        </div>
    );
}

function getInfoForBadges(contrib) {
    const contribType = getContribType(contrib);

    const contribRange = getContribRange(contrib);

    const repoScale = getRepoScale(contrib);

    const earnedStars = getEarnedStars(contrib, contribType);

    return {contribType, contribRange, earnedStars, repoScale};

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

    /*
    console.log('pre');
    console.log(contrib.name);
    console.log(commits_count__total);
    console.log(MAINTAINER_THRESHOLD);
    console.log(commits_count__percentage);
    console.log(contribType);
    console.log('aft');
    */

    return contribType;
}

function getContribRange(contrib) {
    const {name} = contrib;

    const coarse = name.charCodeAt(0)<name.charCodeAt(1)?"'17-'18":"'18";

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
    const THREADSHOLD_SMALL = 100;

    const {total_commits_count} = contrib;

    const repoScale = (
        total_commits_count > THREADSHOLD_BIG && 'large' ||
        total_commits_count > THREADSHOLD_MEDIUM && 'medium' ||
        total_commits_count > THREADSHOLD_SMALL && 'small' ||
        'micro'
    );

    return repoScale;
}

function getEarnedStars(contrib, contribType) {
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

    assert_(earnedStars>=0 && (earnedStars|0)===earnedStars);

    return earnedStars;
}

function assert(val, doingWhat) {
    if( val ) {
        return;
    }
    throw new Error('Internal error '+doingWhat);
}
