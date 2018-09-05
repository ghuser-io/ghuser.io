import React from 'react';

import Creating from '../views/Creating';

const CreatingPage = {
  route: '/:username/creating',
  view: ({route: {args: {username}}}) => <Creating username={username} />
};

export default CreatingPage;
