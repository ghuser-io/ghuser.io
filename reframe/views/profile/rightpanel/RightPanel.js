import React from 'react';
import * as moment from 'moment';

import {urls} from '../../../ghuser';
import CreateYourProfile from './CreateYourProfile';
import ProfileBeingCreated from './ProfileBeingCreated';
import {Contrib} from './contrib/Contrib';
import {getShownContribs} from './contrib/getContribInfo';
import {AccordionListContainer} from '../../utils/Accordion';
import {RichText} from '../../utils/RichText';

export default RightPanel;

function RightPanel(props) {
  return (
    <div className="col-lg-9 pl-2 pr-0 right-panel" style={{fontSize: '14px'}}>{
      props.contribs ? (
        <React.Fragment>
          <ContribList {...props} />
          <div className="text-gray" style={{textAlign: 'right'}}>
            <small><i>Updated {moment(props.fetchedat).fromNow()}.</i></small>
          </div>
        </React.Fragment>
      ) : (
        <ProfileStatus {...props} />
      )
    }</div>
  );
}

function ContribList(props) {
  const repos = [];

  const shownContribs = getShownContribs(props.contribs);
  shownContribs.forEach((contrib, i) => {
    const repo = props.allRepoData[contrib.full_name];
    repos.push(
      <Contrib key={contrib.full_name} username={props.username} contrib={contrib}
               repo={repo}
               i={i} />
    )
  });

  return (
    <AccordionListContainer>
      {repos}
    </AccordionListContainer>
  );
}

function ProfileStatus(props) {
  const alertCssClasses = 'alert alert-warning my-3';

  if (props.deleted_because) {
    return (
      <React.Fragment>
        <div className={alertCssClasses} role="alert">
          This profile was deleted because {RichText(props.deleted_because)}<br /><br />
          If you want to have it again, no problem, just&nbsp;
          <a href={urls.issues} target="_blank" className="external">create an issue</a> :)
        </div>
        <CreateYourProfile />
      </React.Fragment>
    );
  }

  if (props.being_created) {
    return (
      <React.Fragment>
        <div className={alertCssClasses} role="alert">
          This profile is being created...
        </div>
        <ProfileBeingCreated profilesBeingCreated={props.profilesBeingCreated} />
      </React.Fragment>
    );
  }
  return (
      <React.Fragment>
        <div key="alert" className={alertCssClasses} role="alert">
          This profile doesn't exist yet.
          { /* temporary for issue143: */ }
          <br /><br />
          If you have clicked "Get your profile" already, don't click again. Your profile will be
          here in less than 48 hours, see&nbsp;
          <a href="https://github.com/ghuser-io/ghuser.io/issues/143" target="_blank" className="external">
            #143
          </a>.
        </div>
        <CreateYourProfile />
      </React.Fragment>
  );
}
