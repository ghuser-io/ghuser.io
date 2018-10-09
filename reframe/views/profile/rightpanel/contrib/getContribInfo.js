import fetch from '@brillout/fetch';
import * as db from '../../../../db';
import assert_internal from 'reassert/internal';

export {getCommitCounts};
export {getRepoAvatar};
export {getShownContribs};
export {getContribDisplayOrder};
export {getContribScore};
export {getAllData};

function getCommitCounts(contrib) {
  const {total_commits_count: commits_count__total} = contrib;
  const commits_count__percentage = contrib.percentage/100;
  const commits_count__user = Math.round(commits_count__percentage*commits_count__total);
  return {commits_count__user, commits_count__percentage, commits_count__total};
}

function getRepoAvatar(repo) {
  return (
    repo && repo.settings && repo.settings.avatar_url ||
    repo && repo.organization && repo.organization.avatar_url ||
    null
  );
}

function getShownContribs(contribs) {
    const contribList = Object.values(contribs.repos);

    const shownContribs = [];
    const uniqueNames = [];

    contribList.forEach(contrib => {
      // Don't include repos where user has made 0 commits. This happens when a user
      // makes a PR that is not merged.
      if( contrib.percentage===0 ) {
        return;
      }

      // We don't want to have two repos with the same name. This happens when a user is
      // contributing to a project and has a fork with the same name:
      if (uniqueNames.indexOf(contrib.name) > -1) {
        return;
      }
      uniqueNames.push(contrib.name);

      shownContribs.push(contrib);
    });

    shownContribs.sort(getContribDisplayOrder);

    return shownContribs;
}

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

async function getAllData({username}) {
    const {user, contribs, profileDoesNotExist} = await getUserData({username});

    if( profileDoesNotExist ) {
      return {profileDoesNotExist};
    }

    let orgsData;
    let allRepoData;
    await Promise.all([
      getAllRepoData(contribs).then(d => allRepoData=d),
      getOrgsData(contribs).then(d => orgsData=d),
    ]);

    return {user, contribs, orgsData, allRepoData};
}
async function getUserData({username}) {
    const userId = username.toLowerCase();
    const dbBaseUrl = db.url;

    let user;
    let contribs;
    try {
      const userData = await fetch(`${dbBaseUrl}/users/${userId}.json`);
      user = await userData.json();

      const contribsData = await fetch(`${dbBaseUrl}/contribs/${userId}.json`);
      contribs = await contribsData.json();
    } catch (_) {
      return {profileDoesNotExist: true};
    }
    assert_internal(user && contribs, {user, contribs, userId});

    return {user, contribs};
}
async function getOrgsData(contribs) {
  const orgsData = contribs && contribs.organizations || [];
  await Promise.all(
    orgsData.map(async (orgName, i) => {
      const newOrgData = await (await fetch(`${db.url}/orgs/${orgName}.json`)).json();
      orgsData[i] = {name: orgName, ...newOrgData};
    })
  );

  return orgsData;
}
async function getAllRepoData(contribs) {
    const shownContribs = getShownContribs(contribs);

    const allRepoData = {};

    await Promise.all(
        shownContribs
        .map(async contrib => {
          const {full_name} = contrib;
          const resp = await fetch(`${db.url}/repos/${full_name}.json`);
          const repo = await resp.json();
          assert_internal(repo, {full_name, repo});
          allRepoData[full_name] = repo;
        })
    );

    return allRepoData;
}
