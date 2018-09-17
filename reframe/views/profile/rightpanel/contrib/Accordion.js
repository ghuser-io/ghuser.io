import React from 'react';
import '../../../../browser/thirdparty/semantic-ui-2.3.2/accordion.min.css';

export {Accordion};
export {AccordionIcon};

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
    return (
      <div className="ui accordion" ref={this.semanticAccordion}>
        <div
          className="title ui"
          ref={stopPropagationOnLinks}
        >
          {this.props.head}
        </div>
        <div className="content ui">
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
  const linkEls = Array.from(domEl.querySelectorAll('a'));
  console.log(linkEls);
  linkEls.forEach(linkEl => {
    linkEl.onclick = ev => ev.stopPropagation();
  });
}
