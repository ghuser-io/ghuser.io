import React from 'react';

import Avatar from './Avatar';

class LeftPanel extends React.Component {
  render() {
    return (
      <div className="col-3 p-0">
        <Avatar url={this.props.avatar} />
      </div>
    );
  }
}

export default LeftPanel;
