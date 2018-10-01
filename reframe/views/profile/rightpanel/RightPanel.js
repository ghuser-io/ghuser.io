import React from 'react';
import * as Autolinker from 'autolinker';
import * as moment from 'moment';
import * as Parser from 'html-react-parser';

import {urls} from '../../../ghuser';
import CreateYourProfile from './CreateYourProfile';
import ProfileBeingCreated from './ProfileBeingCreated';
import {Contrib} from './contrib/Contrib';
import {getShownContribs} from './contrib/getContribInfo';

const RightPanel = props => {
  // Use these queues to avoid filling up the event loop:
  let functionQueues = [Promise.resolve(), Promise.resolve(), Promise.resolve()];
  const pushToFunctionQueue = (index, func) => {
    functionQueues[index] = functionQueues[index].then(
      () => new Promise(resolve => setTimeout(() => {
        func();
        resolve();
      }, 0))
    );
  };

  const repos = [];

  if (props.contribs) {
    const shownContribs = getShownContribs(props.contribs);
    shownContribs.forEach((contrib, i) => {
      const repo = props.allRepoData[contrib.full_name];
      repos.push(
        <Contrib key={contrib.full_name} username={props.username} contrib={contrib}
                 repo={repo}
                 i={i}
                 pushToFunctionQueue={pushToFunctionQueue} />
      )
    });
  } else {
    const alertCssClasses = 'alert alert-warning my-3';
    if (props.being_created) {
      repos.push(
        <div key="alert" className={alertCssClasses} role="alert">
          This profile is being created...
        </div>,
        <ProfileBeingCreated key="profilecreation"
                             profilesBeingCreated={props.profilesBeingCreated} />
      );
    } else {
      if (props.deleted_because) {
        repos.push(
          <div key="alert" className={alertCssClasses} role="alert">
            This profile was deleted because {Parser(Autolinker.link(props.deleted_because, {
              className: 'external'
            }))}<br /><br />
            If you want to have it again, no problem, just&nbsp;
            <a href={urls.issues} target="_blank" className="external">create an issue</a> :)
          </div>
        );
      } else {
        repos.push(
          <div key="alert" className={alertCssClasses} role="alert">
            This profile doesn't exist yet.
            { /* temporary for issue143: */ }
            <br /><br />
            And we're overloaded at the moment, see&nbsp;
            <a href="https://github.com/ghuser-io/ghuser.io/issues/143" target="_blank" className="external">
              #143
            </a>. We can't onboard any new users for now. We'll be back soon, thanks!
          </div>
        );
      }
      repos.push(
        <CreateYourProfile key="profilecreation" />
      );
    }
  }

  return (
    <div className="col-9 pl-2 pr-0">
      <div style={{fontSize: '14px'}}>
        {repos}
      </div>
      {
        props.contribs &&
        <div className="text-gray" style={{textAlign: 'right'}}>
          <small><i>Updated {moment(props.fetchedat).fromNow()}.</i></small>
        </div>
      }
    </div>
  );
};

export default RightPanel;
