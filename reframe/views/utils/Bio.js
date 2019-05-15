import React from 'react';
import {XmlEntities} from 'html-entities';
import * as Autolinker from 'autolinker';
import * as emoji from 'node-emoji';
import * as Parser from 'html-react-parser';

export {Bio};

const Bio = props => (
  <div style={{
    marginBottom: '12px',
    overflow: 'hidden',
    fontSize: '14px',
    color: '#6a737d',
    ...props.style
  }}>
    {
      //FIXME this duplicates RepoDescrAndDetails.js
      Parser(emoji.emojify(
        Autolinker
        .link(
          (new XmlEntities).encode(props.text).replace(/-/g, '__dash__'),
          {className: 'external', mention: 'twitter'}
        )
        .replace(/https:\/\/twitter\.com\//g, 'https://github.com/')
        .replace(/__dash__/g, '-')
        , name => (
          // See https://developer.github.com/v3/emojis/ :
          `<img className="emoji" src="https://github.global.ssl.fastly.net/images/icons/emoji/${name}.png?v5" />`
        )
      ))
    }</div>
);
