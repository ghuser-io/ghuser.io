import React from 'react';

import {withSeparator} from '../css';
import {urls} from '../../../ghuser';
import Avatar from '../Avatar';
import LogoWithPunchline from '../../LogoWithPunchline';

class ProfileBeingCreated extends React.Component {
  render() {
    const queue = [];
    for (let index = 0; index < this.props.profilesBeingCreated.length; ++index) {
      const request = this.props.profilesBeingCreated[index];
      queue.push(
        <div className={withSeparator('bottom', 2)} key={request.login}>
          <Avatar url={request.avatar_url} classes="avatar-small" />
          <h4 className="my-3">
            {index + 1}.&nbsp;
            <a href={`https://github.com/${request.login}`} target="_blank" className="external">
              {request.login}
            </a>
          </h4>
        </div>
      );
    }

    return (
      <div>
        <LogoWithPunchline />
        <p>
          Your <i>profile request</i> has been enqueued and is being processed by our&nbsp;
          <a href={`${urls.masterBranch}/db/fetchBot`} target="_blank" className="external">fetchBot</a>
          . Each request takes about 3 hours to process:
        </p>
        {queue}
        <div className="mt-3">
          Refresh this page in a few hours.&nbsp;
          <a href="https://github.com/AurelienLourot/github-contribs#why-is-it-so-slow"
             target="_blank" className="external">
            Why does it take so long?
          </a>
        </div>
      </div>
    );
  }
}

export default ProfileBeingCreated;
