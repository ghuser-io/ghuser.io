import React from 'react';

class Content extends React.Component {
  render() {
    return (
      <div className="p-3">
        { this.props.children }
      </div>
    );
  }
}

export default Content;
