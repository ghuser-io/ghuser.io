import {XmlEntities} from 'html-entities';
import * as Autolinker from 'autolinker';
import * as emoji from 'node-emoji';
import * as Parser from 'html-react-parser';

export default RichText;

function RichText(text) {
  return (
    Parser(emoji.emojify(
      Autolinker.link((new XmlEntities).encode(text), {
        className: 'external'
      }), name => (
      // See https://developer.github.com/v3/emojis/ :
      `<img className="emoji" src="https://github.global.ssl.fastly.net/images/icons/emoji/${name}.png?v5" />`
      )
    ))
  );
}
