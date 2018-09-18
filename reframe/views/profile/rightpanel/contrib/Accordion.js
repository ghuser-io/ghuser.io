import React from 'react';
import '../../../../browser/thirdparty/semantic-ui-2.3.2/accordion.min.css';

export {Accordion};
export {AccordionHead, AccordionBody};
export {AccordionIcon};
export {stopPropagationOnLinks}

const AccordionIcon = () => <span><i className="dropdown icon text-gray mx-1"></i></span>;

const AccordionHead = ({className, ...props}) => (
  <div
    className={"ui title "+className}
    ref={stopPropagationOnLinks}
    {...props}
  />
);
const AccordionBody = ({className, ...props}) => (
  <div
    className={"ui content "+className}
    {...props}
  />
);

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
    const {className="", ...props} = this.props;
    return (
      <div
        className={"ui accordion "+className}
        ref={this.semanticAccordion}
        {...props}
      />
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
