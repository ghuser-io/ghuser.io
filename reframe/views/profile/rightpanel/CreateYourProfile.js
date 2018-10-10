import React from 'react';

import {urls} from '../../../ghuser';
import LogoWithPunchline from '../../LogoWithPunchline';

const CreateYourProfile = () => (
  <div>
    <LogoWithPunchline />
    <p>
      Good that you are here :)<br />
      We're building profiles like this one:&nbsp;
      <a href="/AurelienLourot">{urls.landing}/AurelienLourot</a><br />
      More details on&nbsp;
      <a href={urls.mainRepo} target="_blank" className="external">
        {urls.mainRepo}
      </a>
    </p>
    <p>
      <a className="btn btn-primary" href={urls.oauthEndpoint} role="button">Get your profile</a>
    </p>
  </div>
);

export default CreateYourProfile;
