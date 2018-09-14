import React from 'react';

import Profile from '../views/profile/Profile';

const ProfilePage = {
  route: '/:username',
  view: ({route: {args: {username}}}) => <Profile username={username} />
};

export default ProfilePage;
