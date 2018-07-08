import React from 'react';
import * as Autolinker from 'autolinker';
import * as Parser from 'html-react-parser';

import './Bio.css';

const Bio = props => (
  <div className="bio">{Parser(Autolinker.link(props.text))}</div>
);

export default Bio;
