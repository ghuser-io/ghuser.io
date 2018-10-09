import React from 'react';
import assert_internal from 'reassert/internal';

import Profile from '../views/profile/Profile';

import {getAllData} from '../views/profile/rightpanel/contrib/getContribInfo';

/*
const doNotRenderInBrowser = false;
const doNotRenderOnServer = true;
/*/
const doNotRenderInBrowser = true;
const doNotRenderOnServer = false;
//*/

const ProfilePage = {
  route: '/:username',
  view: ({route: {args: {username}}, ...props}) => <Profile username={username} {...props} />,
  getInitialProps: async ({route: {args: {username}}}) => {
    const isServerRendering = typeof window === "undefined";
    const doNotRender = isServerRendering && doNotRenderOnServer;
    assert_internal(isServerRendering || !doNotRenderInBrowser);

    const allData = (
      doNotRender ? (
        {doNotRender}
      ) : (
        await getAllData({username})
      )
    );
    assert_internal(allData.doNotRender || allData.profileDoesNotExist && allData.user && allData.profilesBeingCreated || allData.user && allData.contribs && allData.orgsData && allData.allRepoData, allData);

    return {
      isServerRendering,
      username,
      ...allData
    };
  },
  doNotRenderInBrowser,
};

export default ProfilePage;
