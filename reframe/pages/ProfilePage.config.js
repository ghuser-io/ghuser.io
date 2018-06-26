import React from 'react';

import Profile from '../views/profile/Profile';

import db from '../../db/db.json';

const ProfilePage = {
  route: '/:username',
  view: ({route: {args: {username}}}) => <Profile user={db.users[username]} orgs={db.orgs} />,
  domStatic: true
};

export default ProfilePage;
