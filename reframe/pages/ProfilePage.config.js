import React from 'react';

import Profile from '../views/profile/Profile';

import orgs from '../../db/data/orgs.json';

const ProfilePage = {
  route: '/:username',
  view: ({route: {args: {username}}}) => <Profile username={username} orgs={orgs.orgs} />
};

export default ProfilePage;
