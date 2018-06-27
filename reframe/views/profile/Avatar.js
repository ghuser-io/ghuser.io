import React from 'react';

import './Avatar.css';

const Avatar = props => {
  if (props.type == "add") { // special button for explaining how to add an avatar
    return <div className={`avatar border border-white rounded ${props.classes}`}>
             <span className="avatar-add-sign">+</span>
           </div>;
  }
  return <img className={`avatar border border-white rounded ${props.classes}`} src={props.url} />;
};

export default Avatar;
