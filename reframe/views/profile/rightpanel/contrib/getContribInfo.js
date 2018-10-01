import {getContribDisplayOrder} from './getContribScore';

export {getCommitCounts, getRepoAvatar, getShownContribs};

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
