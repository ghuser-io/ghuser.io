import React from 'react';

import './AddSettings.css';

const AddSettings = props =>
  <a href={props.href} title={props.title} className={`add-settings text-gray ${props.classes}`}
     target="_blank"><span className="add-settings-plus">+</span></a>;

export default AddSettings;
