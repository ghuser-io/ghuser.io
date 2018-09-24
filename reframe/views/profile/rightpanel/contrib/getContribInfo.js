export {getCommitCounts};

function getCommitCounts(contrib) {
  const {total_commits_count: commits_count__total} = contrib;
  const commits_count__percentage = contrib.percentage/100;
  const commits_count__user = Math.round(commits_count__percentage*commits_count__total);
  return {commits_count__user, commits_count__percentage, commits_count__total};
}
