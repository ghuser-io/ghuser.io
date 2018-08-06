import React from 'react';

import BigLogo from './BigLogo';
import './CreateYourProfile.css';

const CreateYourProfile = () => (
  <div>
    <BigLogo classes="landing-logo"/>
    <p className="punchline mb-5"><b>Better GitHub profiles</b></p>
    <p>
      Good that you are here :)<br />
      We're building profiles like this one:&nbsp;
      <a href="/AurelienLourot">https://ghuser.io/AurelienLourot</a><br />
      More details on&nbsp;
      <a href="https://github.com/AurelienLourot/ghuser.io" target="_blank" className="external">
        https://github.com/AurelienLourot/ghuser.io
      </a>
    </p>
    <p>
      <a href="https://github.com/AurelienLourot/ghuser.io/issues/new?template=profile-request.md"
         target="_blank" className="external">Create a profile request</a> and we'll set up your
         profile right away!
    </p>
    <p>
      This is
      a <a href="https://github.com/reframejs/reframe" target="_blank" className="external">Reframe</a> web
      app.
    </p>
  </div>
);

export default CreateYourProfile;
