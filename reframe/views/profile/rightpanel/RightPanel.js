import React from 'react';
import * as Autolinker from 'autolinker';
import * as moment from 'moment';
import * as Parser from 'html-react-parser';

import {urls} from '../../../ghuser';
import CreateYourProfile from './CreateYourProfile';
import ProfileBeingCreated from './ProfileBeingCreated';
import {Contrib} from './contrib/Contrib';
import {getShownContribs} from './contrib/getContribInfo';
import {AccordionListContainer} from '../../utils/Accordion';

export default RightPanel;

function RightPanel(props) {
  return (
    <div className="col-9 pl-2 pr-0" style={{fontSize: '14px'}}>{
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

  if (props.deleted_because) {
    return (
      <div className={alertCssClasses} role="alert">
        This profile was deleted because {Parser(Autolinker.link(props.deleted_because, {
          className: 'external'
        }))}<br /><br />
        If you want to have it again, no problem, just&nbsp;
        <a href={urls.issues} target="_blank" className="external">create an issue</a> :)
      </div>
    );
  }

  return (
      <CreateYourProfile alertCssClasses={alertCssClasses}/>
  );
}
