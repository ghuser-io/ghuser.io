import React from 'react';
import {bigNum, numberOf} from '../../../../utils/pretty-numbers';
import './Badges.css';
import {getCommitCounts, getRepoAvatar, getShownContribs} from '../getContribInfo';
import assert_internal from 'reassert/internal';

export {Badges, BadgesMini, BadgesMultiLine};
export {getContribType};
export {getTotalEarnedStars};

function Badges({contrib, username, style={}}) {
  const badgeInfos = getInfoForBadges(contrib, username);
  const badgeProps = {...contrib, ...badgeInfos, fixedWidth: true};

  return (
    <div style={{display: 'inline-block', ...style}}>
      <ContribType {...badgeProps}/>
      <RepoScale {...badgeProps}/>
      {/*
      <ContribRange {...badgeProps}/>
      */}
      <EarnedStars {...badgeProps}/>
    </div>
  );
}

function BadgesMultiLine({contrib, username}) {
  const badgeInfos = getInfoForBadges(contrib, username);
  const badgeProps = {...contrib, ...badgeInfos, inlineHint: true, showMoreInfo: true, style: {marginBottom: 5}};

  return (
    <div>
        <ContribType {...badgeProps}/>
        <RepoScale {...badgeProps}/>
        {/*
        <ContribRange {...badgeProps}/>
        */}
        <EarnedStars {...badgeProps}/>
    </div>
  );
}

function BadgesMini({contrib, repo, username, style={}}) {
  const {contribTypeIcon, contribTypeHint, repoScaleIcon, repoScaleHint, earnedStars, earnedStarsHint} = getInfoForBadges(contrib, username);
  const repoAvatar = getRepoAvatar(repo);
  const repoImage = (
    repoAvatar && (
        <img className={`avatar border border-white rounded`} src={repoAvatar} style={{width: 18, height: 18}} />
    ) || (
        <div style={{display: 'inline-block', width: 18, height: 18}}/>
    )
  );

  const Star = () => <span style={{fontSize: '0.92em', position: 'relative', top: '-0.08em'}}>★</span>;
  const starsView = (
        <BadgeMini
          head={<span className="earned-stars-text earned-stars-icon-color"><Star/><span className="earned-stars-text-color">{bigNum(earnedStars)}</span></span>}
          hint={earnedStarsHint}
          outerStyle={{textAlign: 'left', minWidth: 40}}
          fixedWidth={true}
        />
  );
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', ...style}}>
      {repoImage}
      <HintWrapper hint={contribTypeHint}>{contribTypeIcon}</HintWrapper>
      <HintWrapper hint={repoScaleHint}>{repoScaleIcon}</HintWrapper>
      {starsView}
    </div>
  );
}

function HintWrapper({hint, children}) {
  return (
    <div style={{display: 'inline-block', lineHeight: 0}} title={hint}>{children}</div>
  );
}

function RepoScale({repoScale, repoScaleIcon, repoScaleHint, ...props}) {
    return (
        <Badge
          head={repoScaleIcon}
          desc={repoScale+' project'}
          hint={repoScaleHint}
          width={130}
          {...props}
        />
    );
}

function ContribRange({contribRange, ...props}) {
       // desc={contribRange.precise.from+' -> '+contribRange.precise.to}
    return (
        <Badge
          head={<div className="contrib-range-title text-gray">{contribRange.coarse}</div>}
          width={160}
          {...props}
        />
    );
}

function EarnedStars({earnedStars, earnedStarsHint, stargazers_count, showMoreInfo, ...props}) {
    const Star = () => <span style={{fontSize: '0.92em', position: 'relative', top: '-0.08em'}}>★</span>;
    return (
        <Badge
          head={<span className="earned-stars-text earned-stars-icon-color"><Star/></span>}
          desc={<span style={{marginLeft: -3}}><span className="earned-stars-text-color">{bigNum(earnedStars)}</span>{(showMoreInfo || earnedStars!==stargazers_count) && <span> / <Star/> {bigNum(stargazers_count)}</span>}</span>}
          hint={earnedStarsHint}
          width={105}
          {...props}
        />
    );
}

function ContribType({contribTypeIcon, contribTypeText, contribTypeHint, ...props}) {
    return (
        <Badge
          head={contribTypeIcon}
          desc={contribTypeText}
          hint={contribTypeHint}
          width={130}
          {...props}
        />
    );
}

function Badge({head, desc, width, hint, fixedWidth, inlineHint, style={}}) {
    const innerStyle = {display: 'inline-block', width: fixedWidth && width};
    const badge = (
        <div style={innerStyle} className="badge-container">
            <div className="contrib-badge text-gray" title={!inlineHint && hint || null}>
                <div>{head}</div>
                {desc && <div className="badge-desc">{desc}</div>}
                <div className="badge-border"/>
            </div>
        </div>
    );

    if( ! inlineHint ) {
      Object.assign(innerStyle, style);
      return badge;
    };

    return (
      <div style={style}>
        {badge}&nbsp; :&nbsp; {hint}
      </div>
    );
}

function BadgeMini({head, width, hint, innerStyle={}, outerStyle={}}) {
    return (
        <div
          style={{
            display: 'block',
            textAlign: 'center',
              lineHeight: 0,
            ...outerStyle
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              paddingLeft: 3,
              paddingRight: 2,
              top: 1,
              paddingBottom: 2,
              fontSize: '0.8em',
              lineHeight: 'normal',
              ...innerStyle
            }}
            title={hint || null}
          >
            <div>{head}</div>
            <div className="badge-border"/>
          </div>
        </div>
    );

}

function getInfoForBadges(contrib, username) {
    const {contribType, ...contribTypeAssets} = getContribTypeAssets(contrib, username);

    const contribRange = getContribRange(contrib);

    return {
        contribType,
        ...contribTypeAssets,
        contribRange,
        ...getEarnedStars(contrib, contribType, username),
        ...getRepoScaleAssets(contrib),
    };
}
function getContribTypeAssets(contrib, username="user") {
  const contribType = getContribType(contrib);

  const {iconClassName, text, hint} = getAssets();
  const contribTypeIcon = <div className={'contrib-type-icon '+iconClassName}/>;
  const contribTypeText = text;
  const contribTypeHint = hint;

  return {contribType, contribTypeText, contribTypeIcon, contribTypeHint};

  function getAssets() {
    const hintPrefix = username+' has ';
    const hintSuffix = ' to this repo';
    const hint = (
      contribType==='contrib_crown' && (
         hintPrefix+'substantially contributed'+hintSuffix
      ) ||
      contribType==='contrib_gold' && (
         hintPrefix+'contributed a lot of times'+hintSuffix
      ) ||
      contribType==='contrib_silver' && (
         hintPrefix+'often contributed'+hintSuffix
      ) ||
      contribType==='contrib_bronze' && (
         hintPrefix+'contributed one or a couple of times'+hintSuffix
      )
    );

    const contrib_type_name = contribType.slice('contrib_'.length);

    const text = (
      contribType==='contrib_crown' ? (
        'maintainer'
      ) : (
        contrib_type_name+' contrib'
      )
    );

    const iconClassName = 'icon-contrib-'+contrib_type_name;

    return {
      iconClassName,
      text,
      hint,
    };
  }
}
function getContribType(contrib) {
    const {
      commits_count__user: userCommitsCount,
      commits_count__percentage: userCommitsPercentage,
      commits_count__total: totalCommitsCount,
    } = getCommitCounts(contrib);

    const THRESHOLD_CROWN = 0.1;
    const THRESHOLD_GOLD = 50;
    const THRESHOLD_SILVER = 5;

    const contribType = (
        userCommitsCount > 1 &&
        (totalCommitsCount * THRESHOLD_CROWN <= 1 || userCommitsPercentage >= THRESHOLD_CROWN) && (
          'contrib_crown'
        ) ||
        userCommitsCount > THRESHOLD_GOLD && (
          'contrib_gold'
        ) ||
        userCommitsCount > THRESHOLD_SILVER && (
          'contrib_silver'
        ) || (
          'contrib_bronze'
        )
    );

    return contribType;
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
function getRepoScaleAssets(contrib) {
  const repoScale = getRepoScale(contrib.total_commits_count);
  const repoScaleIcon = <div className={'icon-repo-scale icon-repo-scale-'+repoScale}/>;
  const repoScaleHint = 'this repo has '+contrib.total_commits_count+' commits';
  return {repoScale, repoScaleIcon, repoScaleHint};
}
function getRepoScale(totalCommitsCount) {
  const THRESHOLD_LARGE = 2000;
  const THRESHOLD_MEDIUM = 500;
  const THRESHOLD_SMALL = 50;

  const repoScale = (
    totalCommitsCount > THRESHOLD_LARGE && 'large' ||
    totalCommitsCount > THRESHOLD_MEDIUM && 'medium' ||
    totalCommitsCount > THRESHOLD_SMALL && 'small' ||
    'micro'
  );

  return repoScale;
}
function getEarnedStars(contrib, contribType, username) {
    const {stargazers_count: stars, percentage: userCommitsPercentage} = contrib;

    const isMaintainer = contribType==='contrib_crown';
    const isBronzeContributor = contribType==='contrib_bronze';
    const isSilverContributor = contribType==='contrib_silver';
    const isGoldContributor = contribType==='contrib_gold';

    assert_internal(
      isMaintainer + isBronzeContributor + isSilverContributor + isGoldContributor === 1,
      {isMaintainer, isBronzeContributor, isSilverContributor, isGoldContributor}
    );

    const earnedStars_bronze = Math.min(10, Math.floor(0.5*stars));
    const earnedStars_silver = Math.max(earnedStars_bronze, Math.min(100, Math.floor(0.1*stars)));
    const earnedStars_gold = Math.max(earnedStars_silver, Math.floor((userCommitsPercentage/100)*stars));

    let earnedStars;
    if( isMaintainer ) {
      assert_internal(earnedStars===undefined);
      earnedStars = stars;
    }
    if ( isGoldContributor ) {
      assert_internal(earnedStars===undefined);
      earnedStars = earnedStars_gold;
    }
    if( isSilverContributor ) {
      assert_internal(earnedStars===undefined);
      earnedStars = earnedStars_silver;
    }
    if( isBronzeContributor ) {
      assert_internal(earnedStars===undefined);
      earnedStars = earnedStars_bronze;
    }
    assert_internal(earnedStars>=0 && (earnedStars|0)===earnedStars, earnedStars);

    const earnedStarsHint = username+' earned '+numberOf(earnedStars, 'star')+' from a total of '+numberOf(stars, 'star');

    return {earnedStars, earnedStarsHint};
}

function getTotalEarnedStars(contribs) {
  const shownContribs = getShownContribs(contribs);
  let totalEarnedStars = 0;
  shownContribs.forEach(contrib => {
    const {earnedStars} = getInfoForBadges(contrib);
    totalEarnedStars += earnedStars;
  });
  return totalEarnedStars;
}
