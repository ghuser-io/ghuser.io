import React from 'react';

import Profile from '../views/profile/Profile';

import {getAllData} from '../views/profile/rightpanel/contrib/getContribInfo';

const ProfilePage = {
  route: '/:username',
  view: ({route: {args: {username}}}) => <Profile username={username} />,
  getInitialProps: async ({route: {args: {username}}}) => {
    if( typeof window === "undefined" ) {
      return {IS_SERVER_SIDE_RENDERING: true};
    }
    const allData = await getAllData({username});
    return allData;
  },
};

export default ProfilePage;
