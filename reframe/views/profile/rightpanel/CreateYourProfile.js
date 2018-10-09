import React from 'react';

import {urls} from '../../../ghuser';
import LogoWithPunchline from '../../LogoWithPunchline';

const CreateYourProfile = ({alertCssClasses}) => (
  <div>
    <div key="alert" className={alertCssClasses} role="alert">
      This profile doesn't exist yet.
      { /* temporary for issue143: */ }
      <br /><br />
      And we're overloaded at the moment, see&nbsp;
      <a href="https://github.com/ghuser-io/ghuser.io/issues/143" target="_blank" className="external">
        #143
      </a>. We can't onboard any new users for now. We'll be back soon, thanks!
    </div>
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
