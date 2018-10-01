import React from 'react';
import './AccordionBadgerIcon.css';
import './AccordionAmpFix.css';

export {AccordionListContainer};
export {Accordion};
export {AccordionHead}
export {AccordionBody};
export {AccordionIcon};
export {AccordionBadgerIcon};

const AccordionBadgerIcon = () => <div className="badger-accordion__header-icon"/>;
const AccordionIcon = () => <span><i className="dropdown icon-vertical-align text-gray mx-1"></i></span>;

const AccordionListContainer = (props) => (
  React.createElement('amp-accordion', {animate: true, ...props})
);

const AccordionHead = ({className, ...props}) => (
  <div
    className={className}
    {...props}
  />
);
const AccordionBody = ({className, ...props}) => (
  <div
    className={className}
    {...props}
  />
);

const Accordion = props => (
  <section {...props}/>
);
