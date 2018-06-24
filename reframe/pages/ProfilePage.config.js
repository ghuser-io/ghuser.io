import React from 'react';

import Profile from '../views/profile/Profile';

const profiles = {
  AurelienLourot: {
    username: 'AurelienLourot',
    avatar: 'https://avatars2.githubusercontent.com/u/11795312'
  }
};

const ProfilePage = {
  route: '/:username',
  view: ({route: {args: {username}}}) => <Profile {...profiles[username]} />,
  domStatic: true
};

export default ProfilePage;
