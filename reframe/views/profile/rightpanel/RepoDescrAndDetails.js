import React from 'react';

import '../../../browser/thirdparty/semantic-ui-2.3.2/accordion.min.css';

import './RepoDescrAndDetails.css';

const roundHalf = num => Math.round(num * 2) / 2;

class RepoDescrAndDetails extends React.Component {
  componentDidMount() {
    this.setupSemanticUi();
  }

  componentDidUpdate() {
    this.setupSemanticUi();
  }

  setupSemanticUi() {
    $('.ui.accordion').accordion();
  }

  render() {
    return (
      <div className="ui accordion">
        <div className="title p-0">
          <span className="text-gray">{this.props.descr}</span>
          <i className="dropdown icon text-gray mx-1"></i>
        </div>
        <div className="content">
          <div><small>project popularity (based on stars): {roundHalf(this.props.contrib.popularity)} / 5</small></div>
          <div><small>project maturity (based on num of commits): {roundHalf(this.props.contrib.maturity)} / 5</small></div>
          <div><small>project activity (based on age of last push): {roundHalf(this.props.contrib.activity)} / 5</small></div>
          <div><small>user made {roundHalf(this.props.contrib.percentage)} % of this project</small></div>
          <div><small>=> sorting score for this contribution: {roundHalf(this.props.contrib.total_score)} / {this.props.contrib.max_total_score} // {this.props.contrib.total_score_human_formula}</small></div>
        </div>
      </div>
    );
  }
}

export {
  roundHalf,
  RepoDescrAndDetails
};
