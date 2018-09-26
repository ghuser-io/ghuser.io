import {getCommitCounts} from './getContribInfo';
export {getContribDisplayOrder};
export {getContribScore};

function getContribDisplayOrder(contrib1, contrib2) {
  return getContribScore(contrib2).contribScore - getContribScore(contrib1).contribScore;
}

function getContribScore(contrib) {
  const {
      commits_count__user: userCommitsCount,
      commits_count__percentage: userCommitsPercentage,
  } = getCommitCounts(contrib);
  const {stargazers_count: stars} = contrib;

  const starBoost = getStarBoost(stars);
  const contribBoost = getContribBoost(userCommitsPercentage);
  const contribScore = userCommitsCount*starBoost*contribBoost;

  return {contribScore, userCommitsCount, starBoost, contribBoost};
}

function getContribBoost(userCommitsPercentage) {
  const contribBoost = 1 + ((1 - userCommitsPercentage) * 5);
  return contribBoost;
}

function getStarBoost(stars) {
  const MAX_STARS = 100*1000;
  const starBoost = 0.2 + (Math.log10(stars) / Math.log10(MAX_STARS) * 5);
  return starBoost;
}
