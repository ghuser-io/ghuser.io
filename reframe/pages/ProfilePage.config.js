import React from 'react';

import Profile from '../views/profile/Profile';

import {getAllData} from '../views/profile/rightpanel/contrib/getContribInfo';

const ProfilePage = {
  route: '/:username',
  view: ({route: {args: {username}}, ...props}) => <Profile username={username} {...props} />,
  getInitialProps: async ({route: {args: {username}}}) => {
    if( typeof window === "undefined" ) {
      return {IS_SERVER_SIDE_RENDERING: true, doNotRenderOnServer: true};
    }
    const allData = await getAllData({username});
    return allData;
  },
//doNotRenderInBrowser: true,
};

export default ProfilePage;
