import React from 'react';

import {urls} from '../../ghuser';
import LogoWithPunchline from '../../LogoWithPunchline';

const CreateYourProfile = props => (
  <div>
    <LogoWithPunchline />
    <p>
      Good that you are here :)<br />
      We're building profiles like this one:&nbsp;
      <a href="/AurelienLourot">{urls.landing}/AurelienLourot</a><br />
      More details on&nbsp;
      <a href={urls.repo} target="_blank" className="external">
        {urls.repo}
      </a>
    </p>
    {
      // issue49 is a hidden work in progress, see #49:
      props.issue49 &&
      <p>
        <a className="btn btn-primary" href="/login" role="button">Get your profile</a>
      </p>
      ||
      <p>
        <a href={urls.profileRequest} target="_blank"
           className="external">Create a profile request</a> and we'll set up your profile right
        away!
      </p>
    }
  </div>
);

export default CreateYourProfile;
