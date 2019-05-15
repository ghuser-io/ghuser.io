import React from 'react';

import {RichText} from './RichText';

export {Bio};

const Bio = props => (
  <div style={{
    marginBottom: '12px',
    overflow: 'hidden',
    fontSize: '14px',
    color: '#6a737d',
    ...props.style
  }}>{RichText(props.text)}</div>
);
