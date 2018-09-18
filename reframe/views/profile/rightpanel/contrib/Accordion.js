import React from 'react';
import '../../../../browser/thirdparty/semantic-ui-2.3.2/accordion.min.css';

export {Accordion};
export {AccordionIcon};
export {stopPropagationOnLinks}

const AccordionIcon = () => <span><i className="dropdown icon text-gray mx-1"></i></span>;

class Accordion extends React.Component {
  constructor(props) {
    super(props);
    this.semanticAccordion = React.createRef();
  }

  componentDidMount() {
    this.setupSemanticUi();
  }

  componentDidUpdate() {
    this.setupSemanticUi();
  }

  setupSemanticUi() {
    this.props.pushToFunctionQueue(1, () => $(this.semanticAccordion.current).accordion());
  }

  render() {
    const {style={}, className=""} = this.props;
    return (
      <div
        className={"ui accordion "+className}
        style={style}
        ref={this.semanticAccordion}
      >
        <div
          className="ui title"
          ref={stopPropagationOnLinks}
        >
          {this.props.head}
        </div>
        <div className="ui content">
          {this.props.content}
        </div>
      </div>
    );
  }
}

function stopPropagationOnLinks(domEl) {
  if( ! domEl ) {
    return;
  }
  const applyStop = el => el.onclick = ev => ev.stopPropagation();
  if( domEl.tagName.toLowerCase()==='a' ) {
    applyStop(domEl);
  }
  const linkEls = Array.from(domEl.querySelectorAll('a'));
  linkEls.forEach(applyStop);
}
