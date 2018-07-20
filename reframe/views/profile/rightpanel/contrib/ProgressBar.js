import React from 'react';

import '../../../../browser/thirdparty/semantic-ui-2.3.2/progress.min.css';

import './ProgressBar.css';

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.semanticBar = React.createRef();
  }

  componentDidMount() {
    this.setupSemanticUi();
  }

  componentDidUpdate() {
    this.setupSemanticUi();
  }

  setupSemanticUi() {
    setTimeout(() => {
      $(this.semanticBar.current).progress({
        showActivity: false
      });
    }, 0);
  }

  render() {
    return (
      <div className={`ui tiny ${this.props.color} progress mx-1 my-0`} data-percent={this.props.percentage}
           ref={this.semanticBar}>
        <div className="bar"></div>
      </div>
    );
  }
}

export default ProgressBar;
