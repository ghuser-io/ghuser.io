import {XmlEntities} from 'html-entities';
import * as Autolinker from 'autolinker';
import * as emoji from 'node-emoji';
import * as Parser from 'html-react-parser';

export {RichText};

function RichText(text) {
  return (
    Parser(emoji.emojify(
      Autolinker
      .link(
        (new XmlEntities).encode(text).replace(/-/g, '__dash__'),
        {className: 'external', mention: 'twitter'}
      )
      .replace(/https:\/\/twitter\.com\//g, 'https://github.com/')
      .replace(/__dash__/g, '-')
      , name => (
        // See https://developer.github.com/v3/emojis/ :
        `<img className="emoji" src="https://github.global.ssl.fastly.net/images/icons/emoji/${name}.png?v5" />`
      )
    ))
  );
}
