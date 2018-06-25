import React from 'react';

import './Avatar.css';

class Avatar extends React.Component {
  render() {
    return (
      <img className="avatar border border-white rounded" src={this.props.url} />
    );
  }
}

export default Avatar;
