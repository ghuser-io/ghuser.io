import React from 'react';

import './RightPanel.css';

const RightPanel = props => {
  const compare = (a, b) => {
    if (a.total_score < b.total_score) {
      return 1;
    }
    if (a.total_score > b.total_score) {
      return -1;
    }
    return 0;
  };

  const contribs = Object.values(props.contribs.repos);
  contribs.sort(compare);

  const roundHalf = num => Math.round(num * 2) / 2;

  const repos = [];
  for (const contrib of contribs) {
    repos.push(
      <div key={contrib.full_name} className="border-bottom border-gray-light">
        <div>
          <a href={`https://github.com/${contrib.full_name}`}
             target="_blank">{contrib.full_name}</a>
        </div>
        <div><small>project popularity (based on stars): {roundHalf(contrib.popularity)} / 5</small></div>
        <div><small>project maturity (based on num of commits): {roundHalf(contrib.maturity)} / 5</small></div>
        <div><small>project activity (based on age of last push): {roundHalf(contrib.activity)} / 5</small></div>
        <div><small>{props.username} made {roundHalf(contrib.percentage)} % of this project</small></div>
        <div><small>=> sorting score for this contribution: {roundHalf(contrib.total_score)} / {contrib.max_total_score} // {contrib.total_score_human_formula}</small></div>
      </div>
    );
  }

  return (
    <div className="col-9 pl-2">
      <div className="user-profile-nav">
        <nav className="UnderlineNav-body">
          <a href="javascript:;" className="UnderlineNav-item selected" aria-selected="true" role="tab">
            Contributions
          </a>
          <a href="javascript:;" className="UnderlineNav-item " aria-selected="false" role="tab">
            Earned stars
          </a>
        </nav>
      </div>
      <div className="mt-4">
        {repos}
      </div>
    </div>
  );
};

export default RightPanel;
