import React from 'react';

import './Orgs.css';
import {withSeparator} from '../css';
import Avatar from '../Avatar';
import * as db from '../../../db';

export {Orgs};

function Orgs({orgsData}) {
  const orgsToShow = (
    (orgsData||[])
    .filter(org => org.avatar_url)
  );
  if( orgsToShow.length===0 ) {
    return null;
  }

  return (
    <div className={withSeparator('top', 3)}>
      <h4 className="mb-1">Contributed to</h4>
      {
        orgsToShow.map(org => {
          const orgUrl = org.html_url || 'https://github.com/'+org.login;
          return (
            <a key={org.name} href={`${orgUrl}`} target="_blank" title={org.name}>
              <Avatar url={org.avatar_url} classes="avatar-org" />
            </a>
          );
        })
      }
    </div>
  );
}
