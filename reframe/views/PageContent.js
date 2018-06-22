import React from 'react';
import './PageContent.css';

class PageContent extends React.Component {
  render() {
    return (
      <div className="page-content">
        { this.props.children }
      </div>
    );
  }
}

export default PageContent;
