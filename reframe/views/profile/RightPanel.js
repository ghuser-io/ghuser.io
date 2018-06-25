import React from 'react';

const RightPanel = props => {
  const repos = [];
  for (const repo of props.contribs && props.contribs.repos || []) {
    repos.push(
      <li key={repo}><a href={`https://github.com/${repo}`} target="_blank">{repo}</a></li>
    );
  }

  return (
    <div className="col-9"><ul>{repos}</ul></div>
  );
};

export default RightPanel;
